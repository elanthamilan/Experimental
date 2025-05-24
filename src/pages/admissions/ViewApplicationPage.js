import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
// import { mockApplicationFormFields } from '../../data/mockApplicationFormFields'; // Can be used for a more robust display
import { Button, Form, Row, Col, Card, Alert, ListGroup, Badge } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Reusing admin styles

const ViewApplicationPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const appToView = mockApplications.find(app => app.id === applicationId);
    if (appToView) {
      setApplication(appToView);
      setNewStatus(appToView.status);
      setInterviewDate(appToView.interviewDate || '');
      setInterviewNotes(appToView.interviewNotes || '');
    } else {
      setError('Application not found.');
      setTimeout(() => navigate('/admissions/applications'), 2000);
    }
  }, [applicationId, navigate]);

  const handleStatusUpdate = () => {
    if (!newStatus) {
      setError('Please select a status.');
      return;
    }
    const appIndex = mockApplications.findIndex(app => app.id === applicationId);
    if (appIndex !== -1) {
      mockApplications[appIndex].status = newStatus;
      setApplication({ ...mockApplications[appIndex] }); // Update local state
      setSuccess('Status updated successfully!');
      setError('');
    } else {
      setError('Failed to update status. Application not found.');
    }
  };

  const handleInterviewDetailsSave = () => {
    const appIndex = mockApplications.findIndex(app => app.id === applicationId);
    if (appIndex !== -1) {
      mockApplications[appIndex].interviewDate = interviewDate;
      mockApplications[appIndex].interviewNotes = interviewNotes;
      setApplication({ ...mockApplications[appIndex] }); // Update local state
      setSuccess('Interview details saved successfully!');
      setError('');
    } else {
      setError('Failed to save interview details. Application not found.');
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received': return <Badge bg="secondary">{status}</Badge>;
      case 'Under Review': return <Badge bg="info">{status}</Badge>;
      case 'Interview Scheduled': return <Badge bg="warning" text="dark">{status}</Badge>;
      case 'Accepted': return <Badge bg="success">{status}</Badge>;
      case 'Rejected': return <Badge bg="danger">{status}</Badge>;
      default: return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  if (error && !application) { // Show error prominently if app not found
    return (
      <div className={styles.pageContainer}>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/admissions/applications')}>Back to List</Button>
      </div>
    );
  }
  
  if (!application) {
    return <div className={styles.pageContainer}><p>Loading application details...</p></div>;
  }

  const showInterviewFields = ['Interview Scheduled', 'Accepted', 'Rejected'].includes(application.status);

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>View Application: {application.applicantName} - {application.id}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

          <Row className="mb-3">
            <Col md={6}><strong>Applicant:</strong> {application.applicantName}</Col>
            <Col md={6}><strong>Email:</strong> {application.email}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}><strong>Date of Birth:</strong> {application.dateOfBirth}</Col>
            <Col md={6}><strong>Submitted:</strong> {application.submittedDate}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}><strong>Applying for:</strong> {application.programName}</Col>
            <Col md={6}><strong>Current Status:</strong> {getStatusBadge(application.status)}</Col>
          </Row>

          <hr />
          <h5>Application Responses</h5>
          {application.fieldResponses && application.fieldResponses.length > 0 ? (
            <ListGroup variant="flush" className="mb-3">
              {application.fieldResponses.map(response => (
                <ListGroup.Item key={response.fieldId}>
                  <strong>{response.label}:</strong> {response.response}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : <p>No specific field responses recorded.</p>}
          
          <hr />
          <h5>Update Status</h5>
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>New Status:</Form.Label>
            <Col sm={6}>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Received">Received</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col sm={3}>
              <Button variant="info" onClick={handleStatusUpdate}>Update Status</Button>
            </Col>
          </Form.Group>

          {showInterviewFields && (
            <>
              <hr />
              <h5>Interview Details</h5>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>Interview Date:</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>Interview Notes:</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Enter notes about the interview"
                  />
                </Col>
              </Form.Group>
              <div className="d-flex justify-content-end">
                 <Button variant="primary" onClick={handleInterviewDetailsSave}>Save Interview Details</Button>
              </div>
            </>
          )}
          
          <hr />
          <div className="d-flex justify-content-start mt-4">
            <Button variant="secondary" onClick={() => navigate('/admissions/applications')}>
              Back to Application List
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewApplicationPage;
