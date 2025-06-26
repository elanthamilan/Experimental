import React from 'react';
import { StyledContainer } from '../../components';
import styles from './AtomicPages.module.scss';

const OrganismsPage = () => {
  return (
    <StyledContainer fluid className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Organisms</h1>
      </div>
      <div className={styles.content}>
        <p>This page will showcase organism components, which are complex UI components made up of molecules and/or atoms.</p>
        {/* Example components will be added here */}
      </div>
    </StyledContainer>
  );
};

export default OrganismsPage;
