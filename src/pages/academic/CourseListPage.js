import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers'; // To get teacher names
import { Button, Table } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Using admin styles for consistency

const CourseListPage = () => {
  const navigate = useNavigate();

  const getTeacherName = (teacherId) => {
    const teacher = mockUsers.find(user => user.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A';
  };

  return (
    <div className={styles.pageContainer}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Course Management</h1>
        <Button variant="primary" onClick={() => navigate('/courses/new')}>
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
          Add New Course
        </Button>
      </div>

      <Table striped bordered hover responsive="sm" className={styles.dataTable}>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Department</th>
            <th>Credits</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.courseCode}</td>
              <td>{course.name}</td>
              <td>{course.department}</td>
              <td>{course.credits}</td>
              <td>{getTeacherName(course.teacherId)}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>visibility</span> {/* View Details */}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/courses/edit/${course.id}`)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>edit</span> {/* Edit */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {mockCourses.length === 0 && <p>No courses found.</p>}
    </div>
  );
};

export default CourseListPage;
