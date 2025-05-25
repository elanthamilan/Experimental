import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StyledContainer from './atoms/StyledContainer';
import StatsCard from './molecules/StatsCard';
import styles from './SummaryStats.module.scss';

const SummaryStats = () => {
  const stats = [
    { title: 'TOTAL SUBJECTS', value: 123, id: 'total' },
    { title: 'SUBJECTS DONE', value: 3, id: 'done' },
    { title: 'SUBJECTS NOT DONE', value: 120, id: 'notDone' },
  ];

  return (
    <StyledContainer fluid className={styles.summaryContainer}>
      <Row>
        {stats.map((stat) => (
          <Col md={4} key={stat.id} className="mb-3 mb-md-0">
            <StatsCard
              title={stat.title}
              value={stat.value}
              variant={stat.id === 'total' ? 'primary' : stat.id === 'done' ? 'success' : 'warning'}
              icon={stat.id === 'total' ? 'school' : stat.id === 'done' ? 'check_circle' : 'pending'}
              className={styles[stat.id]}
            />
          </Col>
        ))}
      </Row>
    </StyledContainer>
  );
};

export default SummaryStats;
