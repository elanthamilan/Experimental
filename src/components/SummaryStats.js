import React from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import styles from './SummaryStats.module.scss';

const SummaryStats = () => {
  const stats = [
    { title: 'TOTAL SUBJECTS', value: 123, id: 'total' },
    { title: 'SUBJECTS DONE', value: 3, id: 'done' },
    { title: 'SUBJECTS NOT DONE', value: 120, id: 'notDone' },
  ];

  return (
    <Container fluid className={styles.summaryContainer}>
      <Row>
        {stats.map((stat) => (
          <Col md={4} key={stat.id} className="mb-3 mb-md-0">
            <Card className={`${styles.statCard} ${styles[stat.id]}`}>
              <Card.Body className="text-center">
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statTitle}>{stat.title}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SummaryStats;
