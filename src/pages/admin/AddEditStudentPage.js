import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header as="h4" className={styles.formCardHeader}>
          {isEditMode ? 'Edit Student Information' : 'Add New Student'}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h5 className="mt-3 mb-3">Personal Details</h5>
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="formStudentId">
                <Form.Label>Student ID</Form.Label>
                <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} readOnly required />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="formDateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formNationality">
                <Form.Label>Nationality</Form.Label>
                <Form.Control type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
              </Form.Group>
               <Form.Group as={Col} md="3" controlId="formProfileImageUrl">
                <Form.Label>Profile Image URL</Form.Label>
                <Form.Control type="url" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </Form.Group>
            </Row>
            
            <h5 className="mt-4 mb-3">Address</h5>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="formStreet">
                <Form.Label>Street</Form.Label>
                <Form.Control type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" name="state" value={formData.address.state} onChange={handleAddressChange} />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="formZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="text" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" name="country" value={formData.address.country} onChange={handleAddressChange} />
              </Form.Group>
            </Row>

            <h5 className="mt-4 mb-3">Academic Information</h5>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="formMajor">
                <Form.Label>Major</Form.Label>
                <Form.Control type="text" name="major" value={formData.major} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="formAdmissionDate">
                <Form.Label>Admission Date</Form.Label>
                <Form.Control type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="formEnrollmentDate">
                <Form.Label>Enrollment Date</Form.Label>
                <Form.Control type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="formEnrollmentStatus">
                <Form.Label>Enrollment Status</Form.Label>
                <Form.Select name="enrollmentStatus" value={formData.enrollmentStatus} onChange={handleChange}>
                  <option value="Prospective">Prospective</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Graduated">Graduated</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="formAcademicStanding">
                <Form.Label>Academic Standing</Form.Label>
                <Form.Select name="academicStanding" value={formData.academicStanding} onChange={handleChange}>
                  <option value="Good Standing">Good Standing</option>
                  <option value="Academic Probation">Academic Probation</option>
                  <option value="Dean's List">Dean's List</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Expelled">Expelled</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="formWithdrawalDate">
                <Form.Label>Withdrawal Date (if any)</Form.Label>
                <Form.Control type="date" name="withdrawalDate" value={formData.withdrawalDate || ''} onChange={handleChange} />
              </Form.Group>
            </Row>

            <h5 className="mt-4 mb-3">Emergency Contact</h5>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="formEmergencyContactName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formEmergencyContactRelationship">
                <Form.Label>Relationship</Form.Label>
                <Form.Control type="text" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formEmergencyContactPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="formEmergencyContactEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="emergencyContactEmail" value={formData.emergencyContactEmail} onChange={handleChange} />
              </Form.Group>
            </Row>
            
            <h5 className="mt-4 mb-3">Parent/Guardian Information</h5>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="formParentGuardianName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="parentGuardianName" value={formData.parentGuardianName} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formParentGuardianRelationship">
                <Form.Label>Relationship</Form.Label>
                <Form.Control type="text" name="parentGuardianRelationship" value={formData.parentGuardianRelationship} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="formParentGuardianPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="tel" name="parentGuardianPhone" value={formData.parentGuardianPhone} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="formParentGuardianEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="parentGuardianEmail" value={formData.parentGuardianEmail} onChange={handleChange} />
              </Form.Group>
            </Row>

            <div className="mt-4 d-flex justify-content-end">
              <Button variant="secondary" onClick={() => navigate('/students')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Student' : 'Add Student'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditStudentPage;
