import React from 'react';
// Import custom styled components from centralized design system
import { StyledContainer } from '../../components';
import styles from './ReportsPage.module.scss'; // Use new SCSS module

const ReportsPage = () => {
  return (
    <StyledContainer className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Reports</h1>
      <p className={styles.pageText}>Details for Reports will be displayed here.</p>
    </StyledContainer>
  );
};

export default ReportsPage;
