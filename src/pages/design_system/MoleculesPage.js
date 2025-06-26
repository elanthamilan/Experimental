import React from 'react';
import { StyledContainer } from '../../components';
import styles from './AtomicPages.module.scss';

const MoleculesPage = () => {
  return (
    <StyledContainer fluid className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Molecules</h1>
      </div>
      <div className={styles.content}>
        <p>This page will showcase molecule components, which are groups of atoms bonded together.</p>
        {/* Example components will be added here */}
      </div>
    </StyledContainer>
  );
};

export default MoleculesPage;
