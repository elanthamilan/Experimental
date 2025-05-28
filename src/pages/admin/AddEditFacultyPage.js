import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFaculty } from '../../data/mockFaculty';
// import { mockCourses } from '../../data/mockCourses'; // Optional: for course selection - not directly used for select options
// import { Form } from 'react-bootstrap'; // Form removed
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField,
  StyledRow, // Added
  StyledCol,  // Added
} from '../../components';
import styles from './AddEditFacultyPage.module.scss'; // Use new SCSS module

const AddEditFacultyPage = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(facultyId);

  const initialFormData = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    officeLocation: '',
    coursesTaught: '', // Stored as comma-separated string in form
    title: '',
    profileImageUrl: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && facultyId) {
      const facultyToEdit = mockFaculty.find(f => f.id === facultyId);
      if (facultyToEdit) {
        setFormData({
          ...facultyToEdit,
          coursesTaught: Array.isArray(facultyToEdit.coursesTaught) 
            ? facultyToEdit.coursesTaught.join(', ') 
            : '', // Handle if coursesTaught is not an array
        });
      } else {
        alert('Faculty member not found.');
        navigate('/admin/faculty');
      }
    } else {
      // Add mode: Generate a new ID
      const newId = `faculty${String(mockFaculty.length + 1).padStart(3, '0')}`;
      setFormData({
        ...initialFormData,
        id: newId,
      });
    }
  }, [facultyId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.department.trim() || !formData.title.trim()) {
      setError('First Name, Last Name, Email, Department, and Title are required fields.');
      return;
    }

    const facultyData = {
      ...formData,
      // Parse coursesTaught string back into an array, removing empty strings
      coursesTaught: formData.coursesTaught.split(',').map(courseId => courseId.trim()).filter(courseId => courseId),
    };

    if (isEditMode) {
      const index = mockFaculty.findIndex(f => f.id === facultyId);
      if (index !== -1) {
        mockFaculty[index] = facultyData;
        setSuccessMessage('Faculty member updated successfully!');
      } else {
        // Should not happen if useEffect loaded data correctly
        setError('Error: Faculty member not found for update.');
        return;
      }
    } else {
      mockFaculty.push(facultyData);
      setSuccessMessage('Faculty member added successfully!');
    }

    setTimeout(() => {
      navigate('/admin/faculty');
    }, 1500);
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Faculty Member' : 'Add New Faculty Member'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <div className={styles.alertDanger} role="alert">{error}</div>}
          {successMessage && <div className={styles.alertSuccess} role="alert">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formFacultyId"
                  label="Faculty ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formFirstName"
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formLastName"
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formEmail"
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formDepartment"
                  label="Department"
                  type="text" // Consider FormField as="select" if departments are managed
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
            </StyledRow>
            
            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formTitle"
                  label="Title"
                  type="text" // Or as="select" with options
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  // options for select:
                  // options={[
                  //   { value: '', label: 'Select Title' },
                  //   { value: 'Lecturer', label: 'Lecturer' },
                  //   { value: 'Assistant Professor', label: 'Assistant Professor' },
                  //   { value: 'Associate Professor', label: 'Associate Professor' },
                  //   { value: 'Professor', label: 'Professor' },
                  // ]}
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formOfficeLocation"
                  label="Office Location"
                  type="text"
                  name="officeLocation"
                  value={formData.officeLocation}
                  onChange={handleChange}
                />
              </StyledCol>
            </StyledRow>

            <FormField
              controlId="formCoursesTaught"
              label="Courses Taught (comma-separated course IDs)"
              as="textarea"
              rows={3}
              name="coursesTaught"
              value={formData.coursesTaught}
              onChange={handleChange}
              placeholder="e.g., CS101, MA203, PH101"
              className={styles.formFieldMarginBottom}
            />
            {/* TODO: Consider implementing a multi-select dropdown using mockCourses if time permits */}

            <FormField
              controlId="formProfileImageUrl"
              label="Profile Image URL"
              type="url"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={styles.formFieldMarginBottom}
            />

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/faculty')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Faculty Member'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditFacultyPage;
