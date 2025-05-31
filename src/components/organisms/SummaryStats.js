import React from 'react';
import { StyledRow, StyledCol } from '../../components'; // Updated import
import StatsCard from '../molecules/StatsCard'; // Assuming StatsCard is correctly in molecules
import styles from './SummaryStats.module.scss';

const SummaryStats = () => {
  const stats = [
    {
      title: 'TOTAL SUBJECTS',
      value: 123,
      id: 'total',
      variant: 'primary',
      icon: 'school'
    },
    {
      title: 'SUBJECTS DONE',
      value: 3,
      id: 'done',
      variant: 'success',
      icon: 'check_circle'
    },
    {
      title: 'SUBJECTS NOT DONE',
      value: 120,
      id: 'notDone',
      variant: 'warning',
      icon: 'pending'
    },
  ];

  return (
    <div className={styles.summaryContainer}>
      <StyledRow className="g-4"> {/* Replaced Row with StyledRow */}
        {stats.map((stat) => (
          <StyledCol md={4} key={stat.id}> {/* Replaced Col with StyledCol */}
            <StatsCard
              title={stat.title}
              value={stat.value}
              variant={stat.variant}
              icon={stat.icon}
              className={styles[stat.id]}
            />
          </StyledCol>
        ))}
      </StyledRow>
    </div>
  );
};

export default SummaryStats;
