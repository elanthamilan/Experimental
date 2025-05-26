import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
// import { mockApplicationFormFields } from '../../data/mockApplicationFormFields'; // Can be used for a more robust display
// import { ListGroup } from 'react-bootstrap'; // Row, Col removed // ListGroup removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  StyledBadge,
  FormField,
  StyledRow, 
  StyledCol,  
  StyledListGroup,      // Added
  StyledListGroupItem,  // Added
} from '../../components';
import styles from './ViewApplicationPage.module.scss'; // Use new SCSS module

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
        <div className={styles.alertDanger} role="alert">{error}</div>
        <StyledButton variant="primary" onClick={() => navigate('/admissions/applications')}>Back to List</StyledButton>
      </StyledContainer>
    );
  }

  if (!application) {
    return <StyledContainer className={styles.pageContainer}><p className={styles.loadingText}>Loading application details...</p></StyledContainer>;
  }

  const showInterviewFields = ['Interview Scheduled', 'Accepted', 'Rejected'].includes(application.status);

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.contentCard}> {/* Use contentCard */}
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>View Application: {application.applicantName} - {application.id}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && (
            <div className={styles.alertDanger} role="alert">
              {error}
              <button type="button" className={styles.closeButton} onClick={() => setError('')} aria-label="Close">&times;</button>
            </div>
          )}
          {success && (
            <div className={styles.alertSuccess} role="alert">
              {success}
              <button type="button" className={styles.closeButton} onClick={() => setSuccess('')} aria-label="Close">&times;</button>
            </div>
          )}

          <StyledRow className={styles.detailRow}>
            <StyledCol className="col-md-6"><strong className={styles.detailLabel}>Applicant:</strong> {application.applicantName}</StyledCol>
            <StyledCol className="col-md-6"><strong className={styles.detailLabel}>Email:</strong> {application.email}</StyledCol>
          </StyledRow>
          <StyledRow className={styles.detailRow}>
            <StyledCol className="col-md-6"><strong className={styles.detailLabel}>Date of Birth:</strong> {application.dateOfBirth}</StyledCol>
            <StyledCol className="col-md-6"><strong className={styles.detailLabel}>Submitted:</strong> {application.submittedDate}</StyledCol>
          </StyledRow>
          <StyledRow className={styles.detailRow}>
            <StyledCol className="col-md-6"><strong className={styles.detailLabel}>Applying for:</strong> {application.programName}</StyledCol>
            <StyledCol className="col-md-6"><strong className={styles.detailLabel}>Current Status:</strong> {getStatusBadge(application.status)}</StyledCol>
          </StyledRow>

          <hr />
          <h5 className={styles.sectionTitle}>Application Responses</h5>
          {application.fieldResponses && application.fieldResponses.length > 0 ? (
            <StyledListGroup variant="flush" className={styles.applicationResponsesList}>
              {application.fieldResponses.map(response => (
                <StyledListGroupItem key={response.fieldId}>
                  <strong className={styles.detailLabel}>{response.label}:</strong> {response.response}
                </StyledListGroupItem>
              ))}
            </StyledListGroup>
          ) : <p className={styles.loadingText}>No specific field responses recorded.</p>}

          <hr />
          <h5 className={styles.sectionTitle}>Update Status</h5>
          <StyledRow className={`${styles.statusUpdateSection} align-items-center`}> {/* Keep align-items-center from bootstrap */}
            <StyledCol className="col-sm-3"><strong className={styles.detailLabel}>New Status:</strong></StyledCol>
            <StyledCol className="col-sm-6">
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
            </StyledCol>
            <StyledCol className="col-sm-3"> {/* This button might need margin adjustment via a specific class if not fitting well */}
              <StyledButton variant="info" onClick={handleStatusUpdate}>Update Status</StyledButton>
            </StyledCol>
          </StyledRow>

          {showInterviewFields && (
            <>
              <hr />
              <h5 className={styles.sectionTitle}>Interview Details</h5>
              <StyledRow className={styles.detailRow}>
                <StyledCol className="col-sm-3"><strong className={styles.detailLabel}>Interview Date:</strong></StyledCol>
                <StyledCol className="col-sm-9">
                  <FormField
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </StyledCol>
              </StyledRow>
              <StyledRow className={styles.detailRow}>
                <StyledCol className="col-sm-3"><strong className={styles.detailLabel}>Interview Notes:</strong></StyledCol>
                <StyledCol className="col-sm-9">
                  <FormField
                    as="textarea"
                    rows={3}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Enter notes about the interview"
                  />
                </StyledCol>
              </StyledRow>
              <div className={styles.formActionsEnd}>
                 <StyledButton variant="primary" onClick={handleInterviewDetailsSave}>Save Interview Details</StyledButton>
              </div>
            </>
          )}

          <hr />
          <div className={styles.formActionsStart}>
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
