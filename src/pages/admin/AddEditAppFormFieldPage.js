import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useParams, useNavigate } from 'react-router-dom';
import { mockApplicationFormFields } from '../../data/mockApplicationFormFields';
// import { Row, Col } from 'react-bootstrap'; // Removed
import {
  StyledButton,
  StyledCard,
  StyledContainer,
  FormField,
  StyledRow,
  StyledCol,
  StyledAlert, // Added StyledAlert
} from '../../components';
import styles from './AddEditAppFormFieldPage.module.scss'; // Using its own SCSS module

const AddEditAppFormFieldPage = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(fieldId);

  const initialFormData = useMemo(() => ({ // Wrapped in useMemo
    id: '',
    label: '',
    type: 'text', // Default type
    required: false,
    options: '', // Stored as comma-separated string in form
    order: 0,
  }), []); // Empty dependency array as it's static

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
  }, [fieldId, isEditMode, navigate, initialFormData]);

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
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEditMode ? 'Edit Application Form Field' : 'Add New Application Form Field'}</h1>
      </div>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          {/* Assuming StyledCard.Title can accept a className or is styled by parent .formCard :global(.card-header) */}
          {/* <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Application Form Field' : 'Add New Application Form Field'}</StyledCard.Title> */}
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <StyledAlert variant="danger" dismissible onClose={() => setError('')}>{error}</StyledAlert>}
          {successMessage && <StyledAlert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</StyledAlert>}
          <form onSubmit={handleSubmit}>
            <StyledRow className="mb-3"> {/* Ensure Rows have bottom margin if FormFields don't */}
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formFieldId"
                  label="Field ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  readOnly
                />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formFieldLabel"
                  label="Label"
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
              <StyledCol className="col-md-4">
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
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
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
              </StyledCol>
              <StyledCol className="col-md-6 d-flex align-items-center">
                <FormField
                  controlId="formFieldRequired"
                  label="Required Field"
                  type="checkbox"
                  name="required"
                  checked={formData.required}
                  onChange={handleChange}
                  className={styles.formCheckInputLarge} // This class styles the input inside FormField
                />
              </StyledCol>
            </StyledRow>

            {formData.type === 'dropdown' && (
              <FormField
                controlId="formFieldOptions"
                label="Options (for Dropdown type)"
                className={styles.formFieldMarginBottom} // Add margin for this field
                as="textarea"
                rows={3}
                name="options"
                value={formData.options}
                onChange={handleChange}
                placeholder="Comma-separated options, e.g., Option 1, Option 2, Option 3"
              />
            )}

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/admissions/formfields')}>
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
