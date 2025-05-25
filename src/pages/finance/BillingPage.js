import React from 'react';
// Import custom styled components from centralized design system
import { StyledContainer } from '../../components';
import styles from './BillingPage.module.scss'; // Use new SCSS module

const BillingPage = () => {
  return (
    <StyledContainer className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Billing</h1>
      <p className={styles.pageText}>Details for Billing will be displayed here.</p>
    </StyledContainer>
  );
};

export default BillingPage;
