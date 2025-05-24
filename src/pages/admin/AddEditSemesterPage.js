import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSemesters } from '../../data/mockSemesters';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const AddEditSemesterPage = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(semesterId);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    status: 'Upcoming', // Default status
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode && semesterId) {
      const semesterToEdit = mockSemesters.find(s => s.id === semesterId);
      if (semesterToEdit) {
        setFormData(semesterToEdit);
      } else {
        setError('Semester not found.');
        setTimeout(() => navigate('/admin/semesters'), 2000);
      }
    } else {
      // Generate a new ID for a new semester
      const newId = `sem${String(mockSemesters.length + 1).padStart(3, '0')}`;
      setFormData({
        id: newId,
        name: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        status: 'Upcoming',
      });
    }
  }, [semesterId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.startDate || !formData.endDate || !formData.status) {
      setError('Name, Start Date, End Date, and Status are required fields.');
      return;
    }
    
    // Basic date validation
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError('End Date cannot be earlier than Start Date.');
        return;
    }
    if (formData.registrationDeadline && new Date(formData.registrationDeadline) > new Date(formData.startDate)) {
        setError('Registration Deadline cannot be after Start Date.');
        return;
    }

    const semesterData = { ...formData };

    if (isEditMode) {
      const index = mockSemesters.findIndex(s => s.id === semesterId);
      if (index !== -1) {
        mockSemesters[index] = semesterData;
        setSuccess('Semester updated successfully!');
      } else {
        setError('Error: Semester not found for update.');
        return;
      }
    } else {
      mockSemesters.push(semesterData);
      setSuccess('Semester added successfully!');
    }
    
    setTimeout(() => {
        navigate('/admin/semesters');
    }, 1500); // Navigate after showing success message
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Semester' : 'Add New Semester'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSemesterId">
                  <Form.Label>Semester ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSemesterName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSemesterStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSemesterEndDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formSemesterRegistrationDeadline">
                    <Form.Label>Registration Deadline</Form.Label>
                    <Form.Control
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleChange}
                    />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formSemesterStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Active">Active</option>
                        <option value="Registration Open">Registration Open</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                    </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/admin/semesters')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Semester'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditSemesterPage;
