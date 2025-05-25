import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSemesters } from '../../data/mockSemesters';
import { Form, Row, Col } from 'react-bootstrap'; // Alert & Button will be replaced
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField,
} from '../../components';
import styles from './AddEditSemesterPage.module.scss'; // Use new SCSS module

const AddEditSemesterPage = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(semesterId);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    status: 'Upcoming', // Default status
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode && semesterId) {
      const semesterToEdit = mockSemesters.find(s => s.id === semesterId);
      if (semesterToEdit) {
        setFormData(semesterToEdit);
      } else {
        setError('Semester not found.');
        setTimeout(() => navigate('/admin/semesters'), 2000);
      }
    } else {
      // Generate a new ID for a new semester
      const newId = `sem${String(mockSemesters.length + 1).padStart(3, '0')}`;
      setFormData({
        id: newId,
        name: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        status: 'Upcoming',
      });
    }
  }, [semesterId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.startDate || !formData.endDate || !formData.status) {
      setError('Name, Start Date, End Date, and Status are required fields.');
      return;
    }
    
    // Basic date validation
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError('End Date cannot be earlier than Start Date.');
        return;
    }
    if (formData.registrationDeadline && new Date(formData.registrationDeadline) > new Date(formData.startDate)) {
        setError('Registration Deadline cannot be after Start Date.');
        return;
    }

    const semesterData = { ...formData };

    if (isEditMode) {
      const index = mockSemesters.findIndex(s => s.id === semesterId);
      if (index !== -1) {
        mockSemesters[index] = semesterData;
        setSuccess('Semester updated successfully!');
      } else {
        setError('Error: Semester not found for update.');
        return;
      }
    } else {
      mockSemesters.push(semesterData);
      setSuccess('Semester added successfully!');
    }
    
    setTimeout(() => {
        navigate('/admin/semesters');
    }, 1500); // Navigate after showing success message
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Semester' : 'Add New Semester'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <div className={styles.alertDanger} role="alert">{error}</div>}
          {success && <div className={styles.alertSuccess} role="alert">{success}</div>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <FormField
                  controlId="formSemesterId"
                  label="Semester ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formSemesterName"
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormField
                  controlId="formSemesterStartDate"
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formSemesterEndDate"
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <FormField
                        controlId="formSemesterRegistrationDeadline"
                        label="Registration Deadline"
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={6}>
                    <FormField
                        controlId="formSemesterStatus"
                        label="Status"
                        as="select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        options={[
                            { value: 'Upcoming', label: 'Upcoming' },
                            { value: 'Active', label: 'Active' },
                            { value: 'Registration Open', label: 'Registration Open' },
                            { value: 'Completed', label: 'Completed' },
                            { value: 'Archived', label: 'Archived' },
                        ]}
                    />
                </Col>
            </Row>
            
            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/semesters')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Semester'}
              </StyledButton>
            </div>
          </Form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditSemesterPage;
