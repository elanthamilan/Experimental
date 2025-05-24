import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFaculty } from '../../data/mockFaculty';
import { mockCourses } from '../../data/mockCourses'; // Optional: for course selection
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Faculty Member' : 'Add New Faculty Member'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formFacultyId">
                  <Form.Label>Faculty ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                  {/* Consider a Form.Select if departments are managed elsewhere */}
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control // Or Form.Select
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  {/* Example Form.Select:
                  <Form.Select name="title" value={formData.title} onChange={handleChange} required>
                    <option value="">Select Title</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                  </Form.Select>
                  */}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formOfficeLocation">
                  <Form.Label>Office Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="officeLocation"
                    value={formData.officeLocation}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formCoursesTaught">
              <Form.Label>Courses Taught (comma-separated course IDs)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="coursesTaught"
                value={formData.coursesTaught}
                onChange={handleChange}
                placeholder="e.g., CS101, MA203, PH101"
              />
              {/* TODO: Consider implementing a multi-select dropdown using mockCourses if time permits */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProfileImageUrl">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                type="url"
                name="profileImageUrl"
                value={formData.profileImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/admin/faculty')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Faculty Member'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditFacultyPage;
