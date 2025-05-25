import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { Form, Row, Col } from 'react-bootstrap';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField
} from '../../components';
import styles from './AddEditStudentPage.module.scss'; // Use new SCSS module

const AddEditStudentPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(studentId);

  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);

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
  }, [isEditMode, studentId, navigate]);

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
    alert(`Student data for "${studentDataToSave.firstName} ${studentDataToSave.lastName}" ${isEditMode ? 'updated' : 'added'} (mock).`);

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
      <StyledCard className={styles.formCard}>
        <StyledCard.Header as="h4" className={styles.cardTitle}> {/* Use cardTitle from SCSS */}
          {isEditMode ? 'Edit Student Information' : 'Add New Student'}
        </StyledCard.Header>
        <StyledCard.Body>
          <Form onSubmit={handleSubmit}> {/* Keep react-bootstrap Form as main wrapper for FormField */}
            <h5 className={styles.sectionTitle}>Personal Details</h5> {/* Styled section title */}
            <Row className="mb-3">
              <Col md="2">
                <FormField controlId="formStudentId" label="Student ID" type="text" name="id" value={formData.id} onChange={handleChange} readOnly required />
              </Col>
              <Col md="3">
                <FormField controlId="formFirstName" label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Col>
              <Col md="3">
                <FormField controlId="formLastName" label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Col>
              <Col md="4">
                <FormField controlId="formEmail" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md="3">
                <FormField controlId="formDateOfBirth" label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </Col>
              <Col md="3">
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
              </Col>
              <Col md="3">
                <FormField controlId="formNationality" label="Nationality" type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formProfileImageUrl" label="Profile Image URL" type="url" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </Col>
            </Row>

            <h5 className={styles.sectionTitle}>Address</h5>
            <Row className="mb-3">
              <Col md="12">
                <FormField controlId="formStreet" label="Street" type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="4">
                <FormField controlId="formCity" label="City" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formState" label="State" type="text" name="state" value={formData.address.state} onChange={handleAddressChange} />
              </Col>
              <Col md="2">
                <FormField controlId="formZipCode" label="Zip Code" type="text" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formCountry" label="Country" type="text" name="country" value={formData.address.country} onChange={handleAddressChange} />
              </Col>
            </Row>

            <h5 className={styles.sectionTitle}>Academic Information</h5>
            <Row className="mb-3">
              <Col md="4">
                <FormField controlId="formMajor" label="Major" type="text" name="major" value={formData.major} onChange={handleChange} required />
              </Col>
              <Col md="4">
                <FormField controlId="formAdmissionDate" label="Admission Date" type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
              </Col>
              <Col md="4">
                <FormField controlId="formEnrollmentDate" label="Enrollment Date" type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="4">
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
              </Col>
              <Col md="4">
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
              </Col>
              <Col md="4">
                <FormField controlId="formWithdrawalDate" label="Withdrawal Date (if any)" type="date" name="withdrawalDate" value={formData.withdrawalDate || ''} onChange={handleChange} />
              </Col>
            </Row>

            <h5 className={styles.sectionTitle}>Emergency Contact</h5>
            <Row className="mb-3">
              <Col md="4">
                <FormField controlId="formEmergencyContactName" label="Name" type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formEmergencyContactRelationship" label="Relationship" type="text" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={handleChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formEmergencyContactPhone" label="Phone" type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
              </Col>
              <Col md="2">
                <FormField controlId="formEmergencyContactEmail" label="Email" type="email" name="emergencyContactEmail" value={formData.emergencyContactEmail} onChange={handleChange} />
              </Col>
            </Row>

            <h5 className={styles.sectionTitle}>Parent/Guardian Information</h5>
            <Row className="mb-3">
              <Col md="4">
                <FormField controlId="formParentGuardianName" label="Name" type="text" name="parentGuardianName" value={formData.parentGuardianName} onChange={handleChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formParentGuardianRelationship" label="Relationship" type="text" name="parentGuardianRelationship" value={formData.parentGuardianRelationship} onChange={handleChange} />
              </Col>
              <Col md="3">
                <FormField controlId="formParentGuardianPhone" label="Phone" type="tel" name="parentGuardianPhone" value={formData.parentGuardianPhone} onChange={handleChange} />
              </Col>
              <Col md="2">
                <FormField controlId="formParentGuardianEmail" label="Email" type="email" name="parentGuardianEmail" value={formData.parentGuardianEmail} onChange={handleChange} />
              </Col>
            </Row>

            <div className={styles.formActions}> {/* Use formActions from SCSS */}
              <StyledButton variant="secondary" onClick={() => navigate('/students')}> {/* Remove me-2 */}
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Update Student' : 'Add Student'}
              </StyledButton>
            </div>
          </Form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditStudentPage;
