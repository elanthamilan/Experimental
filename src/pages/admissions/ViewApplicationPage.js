import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
// import { mockApplicationFormFields } from '../../data/mockApplicationFormFields'; // Can be used for a more robust display
import { Row, Col, ListGroup } from 'react-bootstrap';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  StyledBadge,
  FormField
} from '../../components';
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
      case 'Received': return <StyledBadge variant="secondary">{status}</StyledBadge>;
      case 'Under Review': return <StyledBadge variant="info">{status}</StyledBadge>;
      case 'Interview Scheduled': return <StyledBadge variant="warning">{status}</StyledBadge>;
      case 'Accepted': return <StyledBadge variant="success">{status}</StyledBadge>;
      case 'Rejected': return <StyledBadge variant="danger">{status}</StyledBadge>;
      default: return <StyledBadge variant="light">{status}</StyledBadge>;
    }
  };

  if (error && !application) { // Show error prominently if app not found
    return (
      <StyledContainer className={styles.pageContainer}>
        <div className="alert alert-danger" role="alert">{error}</div>
        <StyledButton variant="primary" onClick={() => navigate('/admissions/applications')}>Back to List</StyledButton>
      </StyledContainer>
    );
  }

  if (!application) {
    return <StyledContainer className={styles.pageContainer}><p>Loading application details...</p></StyledContainer>;
  }

  const showInterviewFields = ['Interview Scheduled', 'Accepted', 'Rejected'].includes(application.status);

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>View Application: {application.applicantName} - {application.id}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && (
            <div className="alert alert-danger alert-dismissible" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
            </div>
          )}

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
          <Row className="mb-3 align-items-center">
            <Col sm={3}><strong>New Status:</strong></Col>
            <Col sm={6}>
              <FormField
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'Received', label: 'Received' },
                  { value: 'Under Review', label: 'Under Review' },
                  { value: 'Interview Scheduled', label: 'Interview Scheduled' },
                  { value: 'Accepted', label: 'Accepted' },
                  { value: 'Rejected', label: 'Rejected' }
                ]}
              />
            </Col>
            <Col sm={3}>
              <StyledButton variant="info" onClick={handleStatusUpdate}>Update Status</StyledButton>
            </Col>
          </Row>

          {showInterviewFields && (
            <>
              <hr />
              <h5>Interview Details</h5>
              <Row className="mb-3">
                <Col sm={3}><strong>Interview Date:</strong></Col>
                <Col sm={9}>
                  <FormField
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><strong>Interview Notes:</strong></Col>
                <Col sm={9}>
                  <FormField
                    as="textarea"
                    rows={3}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Enter notes about the interview"
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                 <StyledButton variant="primary" onClick={handleInterviewDetailsSave}>Save Interview Details</StyledButton>
              </div>
            </>
          )}

          <hr />
          <div className="d-flex justify-content-start mt-4">
            <StyledButton variant="secondary" onClick={() => navigate('/admissions/applications')}>
              Back to Application List
            </StyledButton>
          </div>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default ViewApplicationPage;
