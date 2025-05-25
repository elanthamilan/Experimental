import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFinancialYears } from '../../data/mockFinancialYears';
import { Form, Row, Col } from 'react-bootstrap'; // Alert & Button will be replaced
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField,
} from '../../components';
import styles from './AddEditFinancialYearPage.module.scss'; // Use new SCSS module

const AddEditFinancialYearPage = () => {
  const { financialYearId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(financialYearId);

  const initialFormData = {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming', // Default status
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && financialYearId) {
      const fyToEdit = mockFinancialYears.find(fy => fy.id === financialYearId);
      if (fyToEdit) {
        setFormData(fyToEdit);
      } else {
        setError('Financial Year not found.');
        setTimeout(() => navigate('/admin/financialyears'), 2000);
      }
    } else {
      const newId = `fy${String(mockFinancialYears.length + 1).padStart(4, '0')}`; // e.g., fy0004
      setFormData({ ...initialFormData, id: newId });
    }
  }, [financialYearId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.startDate || !formData.endDate || !formData.status) {
      setError('Name, Start Date, End Date, and Status are required fields.');
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End Date must be after Start Date.');
      return;
    }

    const financialYearData = { ...formData };

    if (isEditMode) {
      const index = mockFinancialYears.findIndex(fy => fy.id === financialYearId);
      if (index !== -1) {
        mockFinancialYears[index] = financialYearData;
        setSuccessMessage('Financial Year updated successfully!');
      } else {
        setError('Error: Financial Year not found for update.');
        return;
      }
    } else {
      // Check if ID already exists to prevent duplicates in add mode
      if (mockFinancialYears.some(fy => fy.id === financialYearData.id)) {
          setError(`Error: Financial Year with ID ${financialYearData.id} already exists.`);
          return;
      }
      mockFinancialYears.push(financialYearData);
      setSuccessMessage('Financial Year added successfully!');
    }

    setTimeout(() => {
      navigate('/admin/financialyears');
    }, 1500);
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Financial Year' : 'Add New Financial Year'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <div className={styles.alertDanger} role="alert">{error}</div>}
          {successMessage && <div className={styles.alertSuccess} role="alert">{successMessage}</div>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <FormField
                  controlId="formFinancialYearId"
                  label="ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formFinancialYearName"
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
                  controlId="formFinancialYearStartDate"
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
                  controlId="formFinancialYearEndDate"
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>
            
            <FormField
              controlId="formFinancialYearStatus"
              label="Status"
              as="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              options={[
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Open', label: 'Open' },
                { value: 'Closed', label: 'Closed' },
              ]}
              className={styles.formFieldMarginBottom}
            />

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/financialyears')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Financial Year'}
              </StyledButton>
            </div>
          </Form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditFinancialYearPage;
