import React from 'react';
// import { useParams } from 'react-router-dom'; // Will use later
// import { mockFaculty } from '../../data/mockFaculty'; // Will use later
// Import custom styled components from centralized design system
import { StyledContainer } from '../../components';
import styles from './FacultyProfilePage.module.scss'; // Use new SCSS module

const FacultyProfilePage = () => {
  // const { facultyId } = useParams();
  // const facultyMember = mockFaculty.find(f => f.id === facultyId);
  return (
    <StyledContainer className={styles.pageContainer}>
      {/* <h1>Faculty Profile: {facultyMember?.firstName} {facultyMember?.lastName}</h1> */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Faculty Profile</h1>
        <p className={styles.pageDescription}>Detailed faculty information will be displayed here.</p>
      </div>
    </StyledContainer>
  );
};
export default FacultyProfilePage;
