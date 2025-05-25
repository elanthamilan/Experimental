import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApplicationFormFields } from '../../data/mockApplicationFormFields';
import { Row, Col } from 'react-bootstrap';
import StyledButton from '../../components/atoms/StyledButton';
import StyledCard from '../../components/atoms/StyledCard';
import StyledContainer from '../../components/atoms/StyledContainer';
import FormField from '../../components/molecules/FormField';
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
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>{isEditMode ? 'Edit Application Form Field' : 'Add New Application Form Field'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <FormField
                  controlId="formFieldId"
                  label="Field ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  readOnly
                />
              </Col>
              <Col md={4}>
                <FormField
                  controlId="formFieldLabel"
                  label="Label"
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4}>
                <FormField
                  controlId="formFieldOrder"
                  label="Order"
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormField
                  controlId="formFieldType"
                  label="Type"
                  as="select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'textarea', label: 'Textarea' },
                    { value: 'dropdown', label: 'Dropdown' },
                    { value: 'email', label: 'Email' },
                    { value: 'number', label: 'Number' },
                    { value: 'date', label: 'Date' },
                    { value: 'file', label: 'File' }
                  ]}
                />
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <FormField
                  controlId="formFieldRequired"
                  label="Required Field"
                  type="checkbox"
                  name="required"
                  checked={formData.required}
                  onChange={handleChange}
                  className={styles.formCheckInputLarge}
                />
              </Col>
            </Row>

            {formData.type === 'dropdown' && (
              <FormField
                controlId="formFieldOptions"
                label="Options (for Dropdown type)"
                as="textarea"
                rows={3}
                name="options"
                value={formData.options}
                onChange={handleChange}
                placeholder="Comma-separated options, e.g., Option 1, Option 2, Option 3"
              />
            )}

            <div className="d-flex justify-content-end mt-3">
              <StyledButton variant="secondary" onClick={() => navigate('/admin/admissions/formfields')} className="me-2">
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Field'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditAppFormFieldPage;
