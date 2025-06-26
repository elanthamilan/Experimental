import React from 'react';
import { StyledContainer } from '../../components'; // Assuming StyledContainer is a common layout component
import styles from './AtomicPages.module.scss'; // A shared style for these demo pages

const AtomsPage = () => {
  return (
    <StyledContainer fluid className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Atoms</h1>
      </div>
      <div className={styles.content}>
        <p>This page will showcase individual atom components from the design system.</p>
        {/* Example components will be added here */}
      </div>
    </StyledContainer>
  );
};

export default AtomsPage;
