import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDepartments } from '../../data/mockDepartments';
import { mockFaculty } from '../../data/mockFaculty';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const AddEditDepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(departmentId);

  const initialFormData = {
    id: '',
    name: '',
    head: '', // Stores faculty ID
    description: '',
    officeLocation: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && departmentId) {
      const deptToEdit = mockDepartments.find(d => d.id === departmentId);
      if (deptToEdit) {
        setFormData(deptToEdit);
      } else {
        setError('Department not found.');
        setTimeout(() => navigate('/admin/masterdata/departments'), 2000);
      }
    } else {
      const newId = `dept${String(mockDepartments.length + 1).padStart(3, '0')}`;
      setFormData({ ...initialFormData, id: newId });
    }
  }, [departmentId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setError('Department Name is required.');
      return;
    }

    const departmentData = { ...formData };
    // Ensure 'head' is stored as null if empty string is selected
    if (departmentData.head === '') {
        departmentData.head = null;
    }


    if (isEditMode) {
      const index = mockDepartments.findIndex(d => d.id === departmentId);
      if (index !== -1) {
        mockDepartments[index] = departmentData;
        setSuccessMessage('Department updated successfully!');
      } else {
        setError('Error: Department not found for update.');
        return;
      }
    } else {
      mockDepartments.push(departmentData);
      setSuccessMessage('Department added successfully!');
    }

    setTimeout(() => {
      navigate('/admin/masterdata/departments');
    }, 1500);
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Department' : 'Add New Department'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartmentId">
                  <Form.Label>Department ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartmentName">
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

            <Form.Group className="mb-3" controlId="formDepartmentDescription">
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
                <Form.Group className="mb-3" controlId="formDepartmentHead">
                  <Form.Label>Head of Department</Form.Label>
                  <Form.Select
                    name="head"
                    value={formData.head || ''}
                    onChange={handleChange}
                  >
                    <option value="">None / N/A</option>
                    {mockFaculty.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>
                        {`${faculty.firstName} ${faculty.lastName}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartmentOfficeLocation">
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

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/admin/masterdata/departments')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Department'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditDepartmentPage;
