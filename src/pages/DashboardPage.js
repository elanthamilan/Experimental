import React from 'react';
import { StyledContainer } from '../components';
import SearchCriteria from '../components/organisms/SearchCriteria';
import ResultsTable from '../components/organisms/ResultsTable';
import styles from './DashboardPage.module.scss';

// Sample data for the results table
const sampleResultsData = [
  {
    id: 1,
    studentId: 'STU001',
    studentName: 'John Doe',
    program: 'Computer Science',
    semester: 'Fall 2023',
    course: 'CS101 - Introduction to Programming',
    grade: 'A',
    status: 'VERIFIED',
    lastModified: '2023-12-01'
  },
  {
    id: 2,
    studentId: 'STU002',
    studentName: 'Jane Smith',
    program: 'Mathematics',
    semester: 'Fall 2023',
    course: 'MATH201 - Calculus II',
    grade: 'B+',
    status: 'PENDING',
    lastModified: '2023-12-02'
  },
  {
    id: 3,
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    program: 'Physics',
    semester: 'Fall 2023',
    course: 'PHYS301 - Quantum Mechanics',
    grade: 'A-',
    status: 'FINALIZED',
    lastModified: '2023-12-03'
  },
  {
    id: 4,
    studentId: 'STU004',
    studentName: 'Sarah Wilson',
    program: 'Chemistry',
    semester: 'Fall 2023',
    course: 'CHEM201 - Organic Chemistry',
    grade: 'B',
    status: 'PUBLISHED',
    lastModified: '2023-12-04'
  },
  {
    id: 5,
    studentId: 'STU005',
    studentName: 'David Brown',
    program: 'Biology',
    semester: 'Fall 2023',
    course: 'BIO301 - Molecular Biology',
    grade: 'A',
    status: 'VERIFIED',
    lastModified: '2023-12-05'
  }
];

// Column configuration for the results table
const resultsTableColumns = [
  {
    accessor: 'studentId',
    header: 'Student ID',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 120,
    order: 1
  },
  {
    accessor: 'studentName',
    header: 'Student Name',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 180,
    order: 2
  },
  {
    accessor: 'program',
    header: 'Program',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 150,
    order: 3
  },
  {
    accessor: 'semester',
    header: 'Semester',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 120,
    order: 4
  },
  {
    accessor: 'course',
    header: 'Course',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 250,
    order: 5
  },
  {
    accessor: 'grade',
    header: 'Grade',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 80,
    order: 6
  },
  {
    accessor: 'status',
    header: 'Status',
    sortType: 'alphanumeric',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 120,
    order: 7
  },
  {
    accessor: 'lastModified',
    header: 'Last Modified',
    sortType: 'date',
    canSort: true,
    canFilter: true,
    canReorder: true,
    isVisible: true,
    width: 140,
    order: 8
  }
];

const DashboardPage = () => {
  return (
    <StyledContainer fluid className={styles.dashboardContainer}>
        <div className={styles.dashboardContent}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Publish Final Results to Portal</h1>
            <p className={styles.pageDescription}>
              Manage and publish academic results to the student portal. Search, review, and publish results by institution, program, and semester.
            </p>
          </div>

          {/* Search Criteria Section */}
          <div className={styles.section}>
            <SearchCriteria />
          </div>



          {/* Results Table Section */}
          <div className={styles.section}>
            <ResultsTable
              data={sampleResultsData}
              columns={resultsTableColumns}
              showFilterTabs={true}
              showSearch={true}
              addActionLabel="Add New Result"
              addActionTo="/results/new"
            />
          </div>
        </div>
      </StyledContainer>
  );
};

export default DashboardPage;
