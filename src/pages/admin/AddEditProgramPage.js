import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPrograms } from '../../data/mockPrograms'; // Assuming mockPrograms is an array that can be mutated
import { Row, Col } from 'react-bootstrap';
import StyledButton from '../../components/atoms/StyledButton';
import StyledCard from '../../components/atoms/StyledCard';
import StyledContainer from '../../components/atoms/StyledContainer';
import FormField from '../../components/molecules/FormField';
import styles from './AddEditProgramPage.module.scss'; // Use new SCSS module

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
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>{isEditMode ? 'Edit Program' : 'Add New Program'}</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {error && (
            <div className={styles.alertDanger} role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Row className="mb-3"> {/* Ensure Row has margin if FormFields within don't */}
              <Col md={6}>
                <FormField
                  controlId="formProgramId"
                  label="Program ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  readOnly
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formProgramName"
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <FormField
              controlId="formProgramDescription"
              label="Description"
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.formFieldMarginBottom}
            />

            <Row className="mb-3"> {/* Ensure Row has margin */}
              <Col md={6}>
                <FormField
                  controlId="formProgramDepartment"
                  label="Department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <FormField
                  controlId="formProgramDegreeLevel"
                  label="Degree Level"
                  as="select"
                  name="degreeLevel"
                  value={formData.degreeLevel}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select Degree Level' },
                    { value: 'Associate Degree', label: 'Associate Degree' },
                    { value: "Bachelor's", label: "Bachelor's" },
                    { value: "Master's", label: "Master's" },
                    { value: 'PhD', label: 'PhD' }
                  ]}
                />
              </Col>
            </Row>

            <FormField
              controlId="formProgramRequiredCourses"
              label="Required Courses (comma-separated)"
              type="text"
              name="requiredCourses"
              value={formData.requiredCourses}
              onChange={handleChange}
              placeholder="Enter course IDs, comma-separated"
              className={styles.formFieldMarginBottom}
            />

            <FormField
              controlId="formProgramDuration"
              label="Duration"
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={styles.formFieldMarginBottom}
            />

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/admin/programs')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Program'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditProgramPage;
