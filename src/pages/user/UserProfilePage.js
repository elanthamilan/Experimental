import React from 'react';
// Import custom styled components from centralized design system
import { StyledContainer } from '../../components';
import styles from './UserProfilePage.module.scss'; // Use new SCSS module

const UserProfilePage = () => {
  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>User Profile</h1>
        <p className={styles.pageDescription}>Details for User Profile will be displayed here.</p>
      </div>
    </StyledContainer>
  );
};

export default UserProfilePage;
