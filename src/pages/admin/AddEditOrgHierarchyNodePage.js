import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrgHierarchyNodes } from '../../data/mockOrgHierarchy';
// import { Form } from 'react-bootstrap'; // Form removed
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
import styles from './AddEditOrgHierarchyNodePage.module.scss'; // Use new SCSS module

const AddEditOrgHierarchyNodePage = () => {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(nodeId);

  const initialFormData = useMemo(() => ({ // Wrapped in useMemo
    id: '',
    name: '',
    type: '',
    parentId: '', // Stores parent node ID
  }), []); // Empty dependency array as it's static

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
  }, [nodeId, isEditMode, navigate, initialFormData]);

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
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEditMode ? 'Edit Hierarchy Node' : 'Add New Hierarchy Node'}</h1>
      </div>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          {/* <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Hierarchy Node' : 'Add New Hierarchy Node'}</StyledCard.Title> */}
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <StyledAlert variant="danger" dismissible onClose={() => setError('')}>{error}</StyledAlert>}
          {successMessage && <StyledAlert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</StyledAlert>}
          <form onSubmit={handleSubmit}>
            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formNodeId"
                  label="Node ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formNodeName"
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formNodeType"
                  label="Type"
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Faculty, Department, Office"
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formNodeParentId"
                  label="Parent Node"
                  as="select"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'None (Top Level)' },
                    ...parentNodeOptions.map(node => ({
                      value: node.id,
                      label: `${node.name} (${node.type})`
                    }))
                  ]}
                />
              </StyledCol>
            </StyledRow>

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/organisation/hierarchy')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Node'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditOrgHierarchyNodePage;
