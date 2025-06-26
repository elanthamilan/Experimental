import React from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';

// Attendance summary cards data
const summaryCards = [
  {
    title: 'Overall avg attendance',
    value: '89%',
    subtitle: 'Today across all degree',
    bg: 'light',
  },
  {
    title: 'Total students present',
    value: '12,500 / 12,700',
    subtitle: 'Today across all degree',
    bg: 'light',
  },
  {
    title: 'Student Attendance Distribution',
    value: null,
    subtitle: null,
    bg: 'light',
    distribution: [
      { label: 'Excellent', value: '90%' },
      { label: 'Good', value: '7%' },
      { label: 'Needs Attention', value: '2%' },
    ],
  },
];

// Table data (mocked from Figma example)
const attendanceRows = [
  {
    id: 'DGR0307',
    name: 'School of Engineering',
    total: 2002,
    present: 850,
    absent: 130,
    unrecorded: 22,
    percent: '88%',
  },
  {
    id: 'DGR0309',
    name: 'School of Business',
    total: 2004,
    present: 950,
    absent: 160,
    unrecorded: 30,
    percent: '92%',
  },
  {
    id: 'DGR0311',
    name: 'School of Medicine',
    total: 2006,
    present: 1000,
    absent: 175,
    unrecorded: 28,
    percent: '95%',
  },
  {
    id: 'DGR0312',
    name: 'School of Music',
    total: 2007,
    present: 640,
    absent: 110,
    unrecorded: 15,
    percent: '80%',
  },
  {
    id: 'DGR0313',
    name: 'School of Science',
    total: 2008,
    present: 900,
    absent: 150,
    unrecorded: 24,
    percent: '89%',
  },
  {
    id: 'DGR0314',
    name: 'School of Philosophy',
    total: 2009,
    present: 700,
    absent: 115,
    unrecorded: 19,
    percent: '86%',
  },
  {
    id: 'DGR0310',
    name: 'School of Law',
    total: 2005,
    present: 820,
    absent: 120,
    unrecorded: 18,
    percent: '87%',
  },
  {
    id: 'DGR0315',
    name: 'School of Environmental Studies',
    total: 2010,
    present: 830,
    absent: 165,
    unrecorded: 27,
    percent: '91%',
  },
  {
    id: 'DGR0316',
    name: 'School of Information Technology',
    total: 2011,
    present: 920,
    absent: 180,
    unrecorded: 29,
    percent: '94%',
  },
  {
    id: 'DGR0308',
    name: 'School of Arts',
    total: 2003,
    present: 780,
    absent: 140,
    unrecorded: 20,
    percent: '85%',
  },
];

export default function AttendanceDashboardPage() {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold text-primary">Attendance Dashboard</h1>
        </Col>
      </Row>
      <Row className="mb-4 g-4">
        {summaryCards.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card bg={card.bg} className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-semibold mb-2">{card.title}</Card.Title>
                {card.value && (
                  <Card.Text className="fs-1 fw-bold text-primary">{card.value}</Card.Text>
                )}
                {card.subtitle && (
                  <Card.Text className="text-secondary">{card.subtitle}</Card.Text>
                )}
                {card.distribution && (
                  <Row>
                    {card.distribution.map((d, i) => (
                      <Col key={i} className="text-center">
                        <div className="fs-2 fw-bold text-primary">{d.value}</div>
                        <div className="text-muted small">{d.label}</div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mb-3 align-items-end">
        <Col md={6}>
          <h2 className="h4 fw-bold mb-0">Degree wise attendance</h2>
        </Col>
        <Col md={3} className="ms-auto">
          <Form.Group controlId="attendance-date">
            <Form.Label className="mb-1">Date</Form.Label>
            <Form.Control type="date" defaultValue="2025-06-02" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table bordered hover responsive className="bg-white shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Degree ID</th>
                <th>Degree Name</th>
                <th>Total Students</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Unrecorded</th>
                <th>Attendance %</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.total}</td>
                  <td>{row.present}</td>
                  <td>{row.absent}</td>
                  <td>{row.unrecorded}</td>
                  <td>{row.percent}</td>
                  <td>
                    <Button variant="outline-primary" size="sm">Detail</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-between align-items-center">
          <div className="text-muted">Showing 1-10 of 1000 results</div>
          <div>
            <Button variant="outline-secondary" size="sm" className="me-2">Prev</Button>
            <Button variant="primary" size="sm" className="me-2">Next</Button>
            <span className="ms-2">Page: <strong>1</strong> of <strong>12,000</strong></span>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
