import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrgHierarchyNodes } from '../../data/mockOrgHierarchy';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const AddEditOrgHierarchyNodePage = () => {
  const { nodeId } = useParams(); // Changed from departmentId to nodeId to match route
  const navigate = useNavigate();
  const isEditMode = Boolean(nodeId);

  const initialFormData = {
    id: '',
    name: '',
    type: '',
    parentId: '', // Stores parent node ID
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && nodeId) {
      const nodeToEdit = mockOrgHierarchyNodes.find(n => n.id === nodeId);
      if (nodeToEdit) {
        setFormData({
          ...nodeToEdit,
          parentId: nodeToEdit.parentId || '' // Ensure parentId is empty string if null/undefined
        });
      } else {
        setError('Hierarchy Node not found.');
        setTimeout(() => navigate('/admin/organisation/hierarchy'), 2000);
      }
    } else {
      const newId = `node${String(mockOrgHierarchyNodes.length + 1).padStart(3, '0')}`;
      setFormData({ ...initialFormData, id: newId });
    }
  }, [nodeId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.type.trim()) {
      setError('Node Name and Type are required.');
      return;
    }
    if (isEditMode && formData.id === formData.parentId) {
      setError('A node cannot be its own parent.');
      return;
    }

    const nodeData = {
      ...formData,
      parentId: formData.parentId === '' ? null : formData.parentId, // Store empty as null
    };

    if (isEditMode) {
      const index = mockOrgHierarchyNodes.findIndex(n => n.id === nodeId);
      if (index !== -1) {
        mockOrgHierarchyNodes[index] = nodeData;
        setSuccessMessage('Hierarchy Node updated successfully!');
      } else {
        setError('Error: Hierarchy Node not found for update.');
        return;
      }
    } else {
      // Check if ID already exists
      if (mockOrgHierarchyNodes.some(n => n.id === nodeData.id)) {
        setError(`Error: Node with ID ${nodeData.id} already exists.`);
        return;
      }
      mockOrgHierarchyNodes.push(nodeData);
      setSuccessMessage('Hierarchy Node added successfully!');
    }

    setTimeout(() => {
      navigate('/admin/organisation/hierarchy');
    }, 1500);
  };

  // Filter out the current node from parent options in edit mode
  const parentNodeOptions = mockOrgHierarchyNodes.filter(node => !isEditMode || node.id !== nodeId);

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Hierarchy Node' : 'Add New Hierarchy Node'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formNodeId">
                  <Form.Label>Node ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formNodeName">
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
                <Form.Group className="mb-3" controlId="formNodeType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Faculty, Department, Office"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formNodeParentId">
                  <Form.Label>Parent Node</Form.Label>
                  <Form.Select
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleChange}
                  >
                    <option value="">None (Top Level)</option>
                    {parentNodeOptions.map(node => (
                      <option key={node.id} value={node.id}>
                        {`${node.name} (${node.type})`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/admin/organisation/hierarchy')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Node'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditOrgHierarchyNodePage;
