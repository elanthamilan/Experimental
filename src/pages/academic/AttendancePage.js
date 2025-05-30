import React, { useState, useEffect, useMemo } from 'react';
import {
  StyledContainer,
  ListControlsToolbar,
  ResultsTable,
  StyledBadge, 
  StyledAlert, // Added for AI insight
  // FormField might be used by ListControlsToolbar internally
} from '../../components';
import { mockAttendance } from '../../data/mockAttendance';
import { mockStudents } from '../../data/mockStudents'; 
import { mockCourses } from '../../data/mockCourses';
import styles from './AttendancePage.module.scss';

const AttendancePage = () => {
  // const [attendanceData, setAttendanceData] = useState(mockAttendance); // Raw data if needed elsewhere
  // Filter states for ListControlsToolbar
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for processed attendance stats
  const [studentCourseAttendanceStats, setStudentCourseAttendanceStats] = useState([]);
  const [studentsAtRiskCount, setStudentsAtRiskCount] = useState(0);

  // Data mappings for display (student and course names)
  const studentMap = useMemo(() =>
    mockStudents.reduce((acc, student) => {
      acc[student.id] = `${student.firstName} ${student.lastName}`;
      return acc;
    }, {}), []); // mockStudents is static

  const courseMap = useMemo(() =>
    mockCourses.reduce((acc, course) => {
      acc[course.id] = course.name;
      return acc;
    }, {}), []); // mockCourses is static

  // Options for filters
  const courseOptions = useMemo(() => [
    { value: '', label: 'All Courses' },
    ...mockCourses.map(course => ({ value: course.id, label: course.name }))
  ], []);

  const studentOptions = useMemo(() => [
    { value: '', label: 'All Students' },
    ...mockStudents.map(student => ({ value: student.id, label: `${student.firstName} ${student.lastName}` }))
  ], []);

  // Calculate attendance stats
  useEffect(() => {
    let rawFilteredData = [...mockAttendance];

    if (selectedCourse) {
      rawFilteredData = rawFilteredData.filter(record => record.courseId === selectedCourse);
    }
    if (selectedStudent) {
      rawFilteredData = rawFilteredData.filter(record => record.studentId === selectedStudent);
    }
    if (startDate) {
      rawFilteredData = rawFilteredData.filter(record => new Date(record.date) >= new Date(startDate));
    }
    if (endDate) {
      rawFilteredData = rawFilteredData.filter(record => new Date(record.date) <= new Date(endDate));
    }

    const stats = {}; // Using an object for easier aggregation: { studentId_courseId: { ... } }

    rawFilteredData.forEach(record => {
      const key = `${record.studentId}_${record.courseId}`;
      if (!stats[key]) {
        stats[key] = {
          studentId: record.studentId,
          courseId: record.courseId,
          studentName: studentMap[record.studentId] || record.studentId,
          courseName: courseMap[record.courseId] || record.courseId,
          presentSessions: 0,
          absentSessions: 0,
          totalSessions: 0,
        };
      }
      stats[key].totalSessions += 1;
      if (record.status === 'Present') {
        stats[key].presentSessions += 1;
      } else {
        stats[key].absentSessions += 1;
      }
    });

    const calculatedStats = Object.values(stats).map(stat => ({
      ...stat,
      attendancePercentage: stat.totalSessions > 0 ? Math.round((stat.presentSessions / stat.totalSessions) * 100) : 0,
    }));

    setStudentCourseAttendanceStats(calculatedStats);

    const atRiskStudents = new Set();
    calculatedStats.forEach(stat => {
      if (stat.attendancePercentage < 35) {
        atRiskStudents.add(stat.studentId);
      }
    });
    setStudentsAtRiskCount(atRiskStudents.size);

  }, [selectedCourse, selectedStudent, startDate, endDate, studentMap, courseMap]);


  const columns = useMemo(() => [
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Course Name', accessor: 'courseName' },
    { header: 'Total Sessions', accessor: 'totalSessions' },
    { header: 'Present Sessions', accessor: 'presentSessions' },
    { header: 'Absent Sessions', accessor: 'absentSessions' },
    {
      header: 'Attendance %',
      accessor: 'attendancePercentage',
      cell: (item) => `${item.attendancePercentage}%`,
    },
    {
      header: 'Status',
      accessor: 'status', // This accessor isn't directly in data, logic is in cell
      cell: (item) => {
        if (item.attendancePercentage < 35) {
          return <StyledBadge variant="danger">At Risk</StyledBadge>;
        } else if (item.attendancePercentage >= 75) {
          return <StyledBadge variant="success">Good</StyledBadge>;
        }
        return <StyledBadge variant="neutral">Fair</StyledBadge>; // Or some other neutral/default badge
      },
    },
  ], []);
  
  const listControlsFilters = [
    {
      controlId: "courseFilter",
      label: "Course",
      value: selectedCourse,
      onChange: (e) => setSelectedCourse(e.target.value),
      options: courseOptions,
      type: 'select',
      className: styles.filterControlItem,
    },
    {
      controlId: "studentFilter",
      label: "Student",
      value: selectedStudent,
      onChange: (e) => setSelectedStudent(e.target.value),
      options: studentOptions,
      type: 'select',
      className: styles.filterControlItem,
    },
    {
      controlId: "startDateFilter",
      label: "Start Date",
      value: startDate,
      onChange: (e) => setStartDate(e.target.value),
      type: 'date',
      className: styles.filterControlItem,
    },
    {
      controlId: "endDateFilter",
      label: "End Date",
      value: endDate,
      onChange: (e) => setEndDate(e.target.value),
      type: 'date',
      className: styles.filterControlItem,
    },
  ];


  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Attendance Records</h1>
        <p className={styles.pageDescription}>
          View and filter student attendance records. Students with attendance below 35% in a course are flagged as "At Risk".
        </p>
      </div>

      {studentsAtRiskCount > 0 && (
        <StyledAlert variant="danger" className={styles.pageInsightAlert}>
          <span className="material-symbols-outlined me-1" style={{ verticalAlign: 'middle' }}>error</span>
          <strong>Attendance Alert:</strong> {studentsAtRiskCount} student(s) have attendance below 35% in one or more courses and may be at risk for exam eligibility.
        </StyledAlert>
      )}

      <ListControlsToolbar
        className={styles.filterControls}
        filters={listControlsFilters}
      />

      <ResultsTable
        data={studentCourseAttendanceStats} // Use the calculated stats
        columns={columns}
        showSearch={false} 
        showFilterTabs={false}
      />
      {studentCourseAttendanceStats.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No aggregated attendance data to display for the current filter.</p>
      )}
    </StyledContainer>
  );
};

export default AttendancePage;
