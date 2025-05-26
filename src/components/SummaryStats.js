import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatsCard from './molecules/StatsCard';
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
      <Row className="g-4">
        {stats.map((stat) => (
          <Col md={4} key={stat.id}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              variant={stat.variant}
              icon={stat.icon}
              className={styles[stat.id]}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SummaryStats;
