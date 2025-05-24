import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFinancialYears } from '../../data/mockFinancialYears';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Financial Year' : 'Add New Financial Year'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFinancialYearId">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFinancialYearName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFinancialYearStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFinancialYearEndDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="formFinancialYearStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/admin/financialyears')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Financial Year'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditFinancialYearPage;
