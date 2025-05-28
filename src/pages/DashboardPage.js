import React from 'react';
import { StyledContainer } from '../components';
import SearchCriteria from '../components/organisms/SearchCriteria';
import ResultsTable from '../components/organisms/ResultsTable';
import styles from './DashboardPage.module.scss';

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
            <ResultsTable />
          </div>
        </div>
      </StyledContainer>
  );
};

export default DashboardPage;
