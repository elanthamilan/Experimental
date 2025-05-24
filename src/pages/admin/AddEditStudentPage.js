import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
// import { mockCourses } from '../../data/mockCourses'; // For potential course selection
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import styles from './AdminPages.module.scss'; // Optional: for custom styles

const AddEditStudentPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(studentId);

  const [formData, setFormData] = useState({
    id: '', // Will be set for edit mode, or could be auto-generated for new
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
    // coursesEnrolled: [], // Not directly editing enrollments in this form as per spec
  });

  useEffect(() => {
    if (isEditMode && studentId) {
      const studentToEdit = mockStudents.find(s => s.id === studentId);
      if (studentToEdit) {
        setFormData({
          ...studentToEdit,
          address: { ...studentToEdit.address }, // Ensure address is a new object
        });
      } else {
        alert(`Student with ID ${studentId} not found.`);
        navigate('/students');
      }
    } else {
      // For new student, could auto-generate an ID or leave it for backend
      setFormData(prev => ({ ...prev, id: `student${String(mockStudents.length + 1).padStart(3, '0')}` }));
    }
  }, [isEditMode, studentId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    // In a real app, here you would save the data (API call)
    console.log("Form Data Submitted:", formData);
    alert(`Student data for "${formData.firstName} ${formData.lastName}" ${isEditMode ? 'updated' : 'added'} (mock).`);
    // Mock save:
    if (isEditMode) {
      const index = mockStudents.findIndex(s => s.id === studentId);
      if (index !== -1) {
        mockStudents[index] = { ...formData }; // Update the student in the mock array
      }
    } else {
      mockStudents.push({ ...formData }); // Add new student to the mock array
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
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="formStudentId">
                <Form.Label>Student ID</Form.Label>
                <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} readOnly={isEditMode} required />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formDateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formMajor">
                <Form.Label>Major</Form.Label>
                <Form.Control type="text" name="major" value={formData.major} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formEnrollmentDate">
                <Form.Label>Enrollment Date</Form.Label>
                <Form.Control type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
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

            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="formProfileImageUrl">
                <Form.Label>Profile Image URL</Form.Label>
                <Form.Control type="url" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
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
