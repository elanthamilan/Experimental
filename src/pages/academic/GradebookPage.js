import React from 'react';
// Import custom styled components from centralized design system
import { StyledContainer } from '../../components';
import styles from './GradebookPage.module.scss'; // Using its own SCSS module

const GradebookPage = () => {
  return (
    <StyledContainer className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Gradebook</h1>
      <p className={styles.pageText}>Details for Gradebook will be displayed here.</p>
    </StyledContainer>
  );
};

export default GradebookPage;
