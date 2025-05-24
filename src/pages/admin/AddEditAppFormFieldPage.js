import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApplicationFormFields } from '../../data/mockApplicationFormFields';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const AddEditAppFormFieldPage = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(fieldId);

  const initialFormData = {
    id: '',
    label: '',
    type: 'text', // Default type
    required: false,
    options: '', // Stored as comma-separated string in form
    order: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && fieldId) {
      const fieldToEdit = mockApplicationFormFields.find(f => f.id === fieldId);
      if (fieldToEdit) {
        setFormData({
          ...fieldToEdit,
          options: Array.isArray(fieldToEdit.options) ? fieldToEdit.options.join(', ') : '',
        });
      } else {
        setError('Form Field not found.');
        setTimeout(() => navigate('/admin/admissions/formfields'), 2000);
      }
    } else {
      const newId = `field${String(mockApplicationFormFields.length + 1).padStart(3, '0')}`;
      // Find the highest current order and add 1
      const maxOrder = mockApplicationFormFields.reduce((max, field) => Math.max(max, field.order), 0);
      setFormData({ ...initialFormData, id: newId, order: maxOrder + 1 });
    }
  }, [fieldId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.label.trim() || !formData.type.trim() || formData.order <= 0) {
      setError('Label, Type, and a valid Order are required.');
      return;
    }

    const fieldData = {
      ...formData,
      order: Number(formData.order),
      options: formData.type === 'dropdown' ? formData.options.split(',').map(opt => opt.trim()).filter(opt => opt) : [],
    };

    if (isEditMode) {
      const index = mockApplicationFormFields.findIndex(f => f.id === fieldId);
      if (index !== -1) {
        mockApplicationFormFields[index] = fieldData;
        setSuccessMessage('Form Field updated successfully!');
      } else {
        setError('Error: Form Field not found for update.');
        return;
      }
    } else {
      // Check for duplicate order in add mode
      if (mockApplicationFormFields.some(f => f.order === fieldData.order)) {
          setError(`Error: Order ${fieldData.order} is already in use. Please choose a different order.`);
          return;
      }
      mockApplicationFormFields.push(fieldData);
      setSuccessMessage('Form Field added successfully!');
    }

    // Sort fields by order after add/edit for consistency in list view
    mockApplicationFormFields.sort((a, b) => a.order - b.order);

    setTimeout(() => {
      navigate('/admin/admissions/formfields');
    }, 1500);
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Application Form Field' : 'Add New Application Form Field'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formFieldId">
                  <Form.Label>Field ID</Form.Label>
                  <Form.Control type="text" name="id" value={formData.id} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formFieldLabel">
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formFieldOrder">
                  <Form.Label>Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFieldType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="file">File</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <Form.Group className="mb-3 mt-3 form-check-group" controlId="formFieldRequired">
                  <Form.Check
                    type="checkbox"
                    name="required"
                    label="Required Field"
                    checked={formData.required}
                    onChange={handleChange}
                    className={styles.formCheckInputLarge} // For larger checkbox if needed
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.type === 'dropdown' && (
              <Form.Group className="mb-3" controlId="formFieldOptions">
                <Form.Label>Options (for Dropdown type)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="options"
                  value={formData.options}
                  onChange={handleChange}
                  placeholder="Comma-separated options, e.g., Option 1, Option 2, Option 3"
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/admin/admissions/formfields')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Field'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditAppFormFieldPage;
