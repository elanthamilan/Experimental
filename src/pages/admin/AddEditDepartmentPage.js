import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDepartments } from '../../data/mockDepartments';
import { mockFaculty } from '../../data/mockFaculty';
import { Form, Row, Col } from 'react-bootstrap'; // Alert will be replaced by styled divs
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField // Import FormField
} from '../../components';
import styles from './AddEditDepartmentPage.module.scss'; // Use new SCSS module

const AddEditDepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(departmentId);

  const initialFormData = {
    id: '',
    name: '',
    head: '', // Stores faculty ID
    description: '',
    officeLocation: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && departmentId) {
      const deptToEdit = mockDepartments.find(d => d.id === departmentId);
      if (deptToEdit) {
        setFormData(deptToEdit);
      } else {
        setError('Department not found.');
        setTimeout(() => navigate('/admin/masterdata/departments'), 2000);
      }
    } else {
      const newId = `dept${String(mockDepartments.length + 1).padStart(3, '0')}`;
      setFormData({ ...initialFormData, id: newId });
    }
  }, [departmentId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setError('Department Name is required.');
      return;
    }

    const departmentData = { ...formData };
    // Ensure 'head' is stored as null if empty string is selected
    if (departmentData.head === '') {
        departmentData.head = null;
    }


    if (isEditMode) {
      const index = mockDepartments.findIndex(d => d.id === departmentId);
      if (index !== -1) {
        mockDepartments[index] = departmentData;
        setSuccessMessage('Department updated successfully!');
      } else {
        setError('Error: Department not found for update.');
        return;
      }
    } else {
      mockDepartments.push(departmentData);
      setSuccessMessage('Department added successfully!');
    }

    setTimeout(() => {
      navigate('/admin/masterdata/departments');
    }, 1500);
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Department' : 'Add New Department'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <div className={styles.alertDanger} role="alert">{error}</div>}
          {successMessage && <div className={styles.alertSuccess} role="alert">{successMessage}</div>}
          <Form onSubmit={handleSubmit}> {/* Keep react-bootstrap Form for now as FormField is used within */}
            <Row className="mb-3">
              <Col md={6}>
                <FormField
                  controlId="formDepartmentId"
                  label="Department ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formDepartmentName"
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <FormField
              controlId="formDepartmentDescription"
              label="Description"
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.formFieldMarginBottom} // Add margin if not in Col/Row with mb-3
            />

            <Row className="mb-3">
              <Col md={6}>
                <FormField
                  controlId="formDepartmentHead"
                  label="Head of Department"
                  as="select"
                  name="head"
                  value={formData.head || ''}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'None / N/A' },
                    ...mockFaculty.map(faculty => ({
                      value: faculty.id,
                      label: `${faculty.firstName} ${faculty.lastName}`
                    }))
                  ]}
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formDepartmentOfficeLocation"
                  label="Office Location"
                  type="text"
                  name="officeLocation"
                  value={formData.officeLocation}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/masterdata/departments')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Department'}
              </StyledButton>
            </div>
          </Form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditDepartmentPage;
