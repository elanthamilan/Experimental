import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useParams, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
// import { Form } from 'react-bootstrap'; // Form removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  // StyledContainer, // Removed duplicate
  StyledCard,
  StyledButton,
  FormField,
  StyledRow, // Added
  StyledCol,  // Added
  StyledAlert, // Added StyledAlert
} from '../../components';
import styles from './AddEditStudentPage.module.scss'; // Use new SCSS module

const AddEditStudentPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(studentId);

  const initialFormData = useMemo(() => ({ // Wrapped in useMemo
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    major: '',
    enrollmentDate: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    profileImageUrl: '',
    gender: '',
    nationality: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    parentGuardianName: '',
    parentGuardianRelationship: '',
    parentGuardianPhone: '',
    parentGuardianEmail: '',
    academicStanding: 'Good Standing', // Default
    enrollmentStatus: 'Enrolled',   // Default
    admissionDate: '',
    withdrawalDate: '',
  }), []); // Empty dependency array as it's static

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success messages

  useEffect(() => {
    if (isEditMode && studentId) {
      const studentToEdit = mockStudents.find(s => s.id === studentId);
      if (studentToEdit) {
        setFormData({
          ...initialFormData, // Start with defaults to ensure all fields are present
          ...studentToEdit,
          address: { ...initialFormData.address, ...studentToEdit.address },
          // Populate simplified contact fields from the first entry if available
          emergencyContactName: studentToEdit.emergencyContacts?.[0]?.name || '',
          emergencyContactRelationship: studentToEdit.emergencyContacts?.[0]?.relationship || '',
          emergencyContactPhone: studentToEdit.emergencyContacts?.[0]?.phone || '',
          emergencyContactEmail: studentToEdit.emergencyContacts?.[0]?.email || '',
          parentGuardianName: studentToEdit.parentGuardianInfo?.[0]?.name || '',
          parentGuardianRelationship: studentToEdit.parentGuardianInfo?.[0]?.relationship || '',
          parentGuardianPhone: studentToEdit.parentGuardianInfo?.[0]?.phone || '',
          parentGuardianEmail: studentToEdit.parentGuardianInfo?.[0]?.email || '',
        });
      } else {
        alert(`Student with ID ${studentId} not found.`);
        navigate('/students');
      }
    } else {
      // For new student
      setFormData({
        ...initialFormData,
        id: `student${String(mockStudents.length + 1).padStart(3, '0')}`
      });
    }
  }, [isEditMode, studentId, navigate, initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle direct properties and simplified contact properties
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the student data to be saved, including structured contacts
    const studentDataToSave = {
      ...formData,
      emergencyContacts: [{
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone,
        email: formData.emergencyContactEmail,
      }],
      parentGuardianInfo: [{
        name: formData.parentGuardianName,
        relationship: formData.parentGuardianRelationship,
        phone: formData.parentGuardianPhone,
        email: formData.parentGuardianEmail,
      }],
    };
    // Remove the flat contact properties if they are not part of the main student object schema
    // For this mock, we'll keep them flat on formData for simplicity, but structure for mockStudents array
    delete studentDataToSave.emergencyContactName;
    delete studentDataToSave.emergencyContactRelationship;
    delete studentDataToSave.emergencyContactPhone;
    delete studentDataToSave.emergencyContactEmail;
    delete studentDataToSave.parentGuardianName;
    delete studentDataToSave.parentGuardianRelationship;
    delete studentDataToSave.parentGuardianPhone;
    delete studentDataToSave.parentGuardianEmail;


    console.log("Form Data Submitted (structured):", studentDataToSave);
    // alert(`Student data for "${studentDataToSave.firstName} ${studentDataToSave.lastName}" ${isEditMode ? 'updated' : 'added'} (mock).`);
    setSuccessMessage(`Student data for "${studentDataToSave.firstName} ${studentDataToSave.lastName}" ${isEditMode ? 'updated' : 'added'} successfully (mock).`);
    setError(''); // Clear any previous errors

    if (isEditMode) {
      const index = mockStudents.findIndex(s => s.id === studentId);
      if (index !== -1) {
        mockStudents[index] = studentDataToSave;
      }
    } else {
      mockStudents.push(studentDataToSave);
    }
    navigate('/students');
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEditMode ? 'Edit Student Information' : 'Add New Student'}</h1>
      </div>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header> {/* Use cardTitle from SCSS */}
          {/* {isEditMode ? 'Edit Student Information' : 'Add New Student'} */}
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <StyledAlert variant="danger" dismissible onClose={() => setError('')}>{error}</StyledAlert>}
          {successMessage && <StyledAlert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</StyledAlert>}
          <form onSubmit={handleSubmit}> {/* Keep react-bootstrap Form as main wrapper for FormField */}
            <h5 className={styles.sectionTitle}>Personal Details</h5> {/* Styled section title */}
            <StyledRow className="mb-3">
              <StyledCol className="col-md-2">
                <FormField controlId="formStudentId" label="Student ID" type="text" name="id" value={formData.id} onChange={handleChange} readOnly required />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formFirstName" label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formLastName" label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField controlId="formEmail" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-3">
                <FormField controlId="formDateOfBirth" label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField
                  controlId="formGender"
                  label="Gender"
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select Gender...' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Non-binary', label: 'Non-binary' },
                    { value: 'Other', label: 'Other' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formNationality" label="Nationality" type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formProfileImageUrl" label="Profile Image URL" type="url" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </StyledCol>
            </StyledRow>

            <h5 className={styles.sectionTitle}>Address</h5>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-12">
                <FormField controlId="formStreet" label="Street" type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
              </StyledCol>
            </StyledRow>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField controlId="formCity" label="City" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formState" label="State" type="text" name="state" value={formData.address.state} onChange={handleAddressChange} />
              </StyledCol>
              <StyledCol className="col-md-2">
                <FormField controlId="formZipCode" label="Zip Code" type="text" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formCountry" label="Country" type="text" name="country" value={formData.address.country} onChange={handleAddressChange} />
              </StyledCol>
            </StyledRow>

            <h5 className={styles.sectionTitle}>Academic Information</h5>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField controlId="formMajor" label="Major" type="text" name="major" value={formData.major} onChange={handleChange} required />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField controlId="formAdmissionDate" label="Admission Date" type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField controlId="formEnrollmentDate" label="Enrollment Date" type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
              </StyledCol>
            </StyledRow>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formEnrollmentStatus"
                  label="Enrollment Status"
                  as="select"
                  name="enrollmentStatus"
                  value={formData.enrollmentStatus}
                  onChange={handleChange}
                  options={[
                    { value: 'Prospective', label: 'Prospective' },
                    { value: 'Enrolled', label: 'Enrolled' },
                    { value: 'On Leave', label: 'On Leave' },
                    { value: 'Withdrawn', label: 'Withdrawn' },
                    { value: 'Graduated', label: 'Graduated' },
                  ]}
                />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formAcademicStanding"
                  label="Academic Standing"
                  as="select"
                  name="academicStanding"
                  value={formData.academicStanding}
                  onChange={handleChange}
                  options={[
                    { value: 'Good Standing', label: 'Good Standing' },
                    { value: 'Academic Probation', label: 'Academic Probation' },
                    { value: "Dean's List", label: "Dean's List" },
                    { value: 'Suspended', label: 'Suspended' },
                    { value: 'Expelled', label: 'Expelled' },
                  ]}
                />
              </StyledCol>
              <StyledCol className="col-md-4">
                <FormField controlId="formWithdrawalDate" label="Withdrawal Date (if any)" type="date" name="withdrawalDate" value={formData.withdrawalDate || ''} onChange={handleChange} />
              </StyledCol>
            </StyledRow>

            <h5 className={styles.sectionTitle}>Emergency Contact</h5>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField controlId="formEmergencyContactName" label="Name" type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formEmergencyContactRelationship" label="Relationship" type="text" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formEmergencyContactPhone" label="Phone" type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-2">
                <FormField controlId="formEmergencyContactEmail" label="Email" type="email" name="emergencyContactEmail" value={formData.emergencyContactEmail} onChange={handleChange} />
              </StyledCol>
            </StyledRow>

            <h5 className={styles.sectionTitle}>Parent/Guardian Information</h5>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-4">
                <FormField controlId="formParentGuardianName" label="Name" type="text" name="parentGuardianName" value={formData.parentGuardianName} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formParentGuardianRelationship" label="Relationship" type="text" name="parentGuardianRelationship" value={formData.parentGuardianRelationship} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-3">
                <FormField controlId="formParentGuardianPhone" label="Phone" type="tel" name="parentGuardianPhone" value={formData.parentGuardianPhone} onChange={handleChange} />
              </StyledCol>
              <StyledCol className="col-md-2">
                <FormField controlId="formParentGuardianEmail" label="Email" type="email" name="parentGuardianEmail" value={formData.parentGuardianEmail} onChange={handleChange} />
              </StyledCol>
            </StyledRow>

            <div className={styles.formActions}> {/* Use formActions from SCSS */}
              <StyledButton variant="secondary" onClick={() => navigate('/students')}> {/* Remove me-2 */}
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Update Student' : 'Add Student'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditStudentPage;
