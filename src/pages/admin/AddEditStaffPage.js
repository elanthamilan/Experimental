import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStaff } from '../../data/mockStaff';
import { mockDepartments } from '../../data/mockDepartments'; // Using this for department dropdown
// import { Form } from 'react-bootstrap'; // Form removed
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField,
  StyledRow, // Added
  StyledCol,  // Added
} from '../../components';
import styles from './AddEditStaffPage.module.scss'; // Use new SCSS module

const AddEditStaffPage = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(staffId);

  const initialFormData = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    employmentDate: '',
    phone: '',
    officeLocation: '',
    status: 'Active', // Default status
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && staffId) {
      const staffToEdit = mockStaff.find(s => s.id === staffId);
      if (staffToEdit) {
        setFormData(staffToEdit);
      } else {
        setError('Staff member not found.');
        setTimeout(() => navigate('/staff'), 2000);
      }
    } else {
      // Add mode: Generate a new ID
      const newId = `staff${String(mockStaff.length + 1).padStart(3, '0')}`;
      setFormData({
        ...initialFormData,
        id: newId,
      });
    }
  }, [staffId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || 
        !formData.department.trim() || !formData.role.trim() || !formData.employmentDate || !formData.status) {
      setError('First Name, Last Name, Email, Department, Role, Employment Date, and Status are required fields.');
      return;
    }
    // Email validation regex (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    const staffData = { ...formData };

    if (isEditMode) {
      const index = mockStaff.findIndex(s => s.id === staffId);
      if (index !== -1) {
        mockStaff[index] = staffData;
        setSuccessMessage('Staff member updated successfully!');
      } else {
        setError('Error: Staff member not found for update.');
        return;
      }
    } else {
      // Check if ID already exists
      if (mockStaff.some(s => s.id === staffData.id)) {
          setError(`Error: Staff member with ID ${staffData.id} already exists.`);
          return;
      }
      mockStaff.push(staffData);
      setSuccessMessage('Staff member added successfully!');
    }

    setTimeout(() => {
      navigate('/staff');
    }, 1500);
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <div className={styles.alertDanger} role="alert">{error}</div>}
          {successMessage && <div className={styles.alertSuccess} role="alert">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField controlId="formStaffId" label="Staff ID" type="text" name="id" value={formData.id} readOnly />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField controlId="formFirstName" label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField controlId="formLastName" label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField controlId="formEmail" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formDepartment"
                  label="Department"
                  as="select"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  options={[
                    { value: '', label: 'Select Department' },
                    ...mockDepartments.map(dept => ({ value: dept.name, label: dept.name })),
                    { value: 'Administration', label: 'Administration' },
                    { value: 'Student Support', label: 'Student Support' },
                    { value: 'IT Services', label: 'IT Services' },
                    { value: 'Library', label: 'Library' },
                    { value: 'Maintenance', label: 'Maintenance' },
                  ]}
                />
              </StyledCol>
            </StyledRow>
            
            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField controlId="formRole" label="Role/Title" type="text" name="role" value={formData.role} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField controlId="formEmploymentDate" label="Employment Date" type="date" name="employmentDate" value={formData.employmentDate} onChange={handleChange} required />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField controlId="formPhone" label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField controlId="formOfficeLocation" label="Office Location" type="text" name="officeLocation" value={formData.officeLocation} onChange={handleChange} />
              </StyledCol>
            </StyledRow>

            <FormField
              controlId="formStatus"
              label="Status"
              as="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Terminated', label: 'Terminated' },
              ]}
              className={styles.formFieldMarginBottom}
            />

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/staff')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Staff Member'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditStaffPage;
