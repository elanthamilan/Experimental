import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStaff } from '../../data/mockStaff';
import { mockDepartments } from '../../data/mockDepartments'; // Using this for department dropdown
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formStaffId">
                  <Form.Label>Staff ID</Form.Label>
                  <Form.Control type="text" name="id" value={formData.id} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Select name="department" value={formData.department} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    {mockDepartments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                     <option value="Administration">Administration</option>
                     <option value="Student Support">Student Support</option>
                     <option value="IT Services">IT Services</option>
                     <option value="Library">Library</option>
                     <option value="Maintenance">Maintenance</option>
                     {/* Add other departments if not covered by mockDepartments */}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRole">
                  <Form.Label>Role/Title</Form.Label>
                  <Form.Control type="text" name="role" value={formData.role} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmploymentDate">
                  <Form.Label>Employment Date</Form.Label>
                  <Form.Control type="date" name="employmentDate" value={formData.employmentDate} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formOfficeLocation">
                  <Form.Label>Office Location</Form.Label>
                  <Form.Control type="text" name="officeLocation" value={formData.officeLocation} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/staff')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Staff Member'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditStaffPage;
