import React from 'react';
import { StyledContainer } from '../../components';
import styles from './AdmissionsPage.module.scss';

const AdmissionsPage = () => {
  return (
    <StyledContainer className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Admissions</h1>
      <p className={styles.pageText}>Details for Admissions will be displayed here.</p>
    </StyledContainer>
  );
};

export default AdmissionsPage;
