import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPrograms } from '../../data/mockPrograms'; // Assuming mockPrograms is an array that can be mutated
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const AddEditProgramPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(programId);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    department: '',
    degreeLevel: '',
    requiredCourses: '', // Stored as comma-separated string in form
    duration: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const programToEdit = mockPrograms.find(p => p.id === programId);
      if (programToEdit) {
        setFormData({
          ...programToEdit,
          requiredCourses: programToEdit.requiredCourses.join(', '), // Convert array to string for form
        });
      } else {
        setError('Program not found.');
        // Optionally navigate back or show persistent error
        setTimeout(() => navigate('/admin/programs'), 2000);
      }
    } else {
      // Generate a new ID for a new program
      const newId = `prog${String(mockPrograms.length + 1).padStart(3, '0')}`;
      setFormData({
        id: newId,
        name: '',
        description: '',
        department: '',
        degreeLevel: '',
        requiredCourses: '',
        duration: '',
      });
    }
  }, [programId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!formData.name.trim()) {
        setError("Program Name is required.");
        return;
    }

    const programData = {
      ...formData,
      requiredCourses: formData.requiredCourses.split(',').map(course => course.trim()).filter(course => course), // Convert string to array, remove empty strings
    };

    if (isEditMode) {
      const index = mockPrograms.findIndex(p => p.id === programId);
      if (index !== -1) {
        mockPrograms[index] = programData;
        alert('Program data updated (mock).');
      } else {
        // This case should ideally not happen if useEffect loaded data correctly
        alert('Error: Program not found for update.');
        return;
      }
    } else {
      mockPrograms.push(programData);
      alert('Program added (mock).');
    }
    navigate('/admin/programs');
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Program' : 'Add New Program'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProgramId">
                  <Form.Label>Program ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProgramName">
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

            <Form.Group className="mb-3" controlId="formProgramDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProgramDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProgramDegreeLevel">
                  <Form.Label>Degree Level</Form.Label>
                  <Form.Control // Or Form.Select for predefined options
                    type="text"
                    name="degreeLevel"
                    value={formData.degreeLevel}
                    onChange={handleChange}
                  />
                  {/* Example for Form.Select:
                  <Form.Select name="degreeLevel" value={formData.degreeLevel} onChange={handleChange}>
                    <option value="">Select Degree Level</option>
                    <option value="Associate Degree">Associate Degree</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                  </Form.Select>
                  */}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formProgramRequiredCourses">
              <Form.Label>Required Courses (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="requiredCourses"
                value={formData.requiredCourses}
                onChange={handleChange}
                placeholder="Enter course IDs, comma-separated"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProgramDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => navigate('/admin/programs')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Program'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditProgramPage;
