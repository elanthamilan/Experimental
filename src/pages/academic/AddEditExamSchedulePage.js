import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockExamSchedules } from '../../data/mockExamSchedules';
import { mockCourses } from '../../data/mockCourses';
// import { mockFaculty } from '../../data/mockFaculty'; // For invigilator names (optional, or for a future multi-select) - Not directly used for selection options in this version
// import { Alert } from 'react-bootstrap'; // Alert removed
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField,
  StyledRow, 
  StyledCol,  
  StyledAlert, // Added
} from '../../components';
import styles from './AddEditExamSchedulePage.module.scss'; // Using its own SCSS module

const AddEditExamSchedulePage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(scheduleId);

  const initialFormData = {
    id: '',
    courseId: '',
    examName: '',
    date: '',
    time: '',
    room: '',
    invigilators: '', // Stored as comma-separated string of faculty IDs in form
    duration: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && scheduleId) {
      const scheduleToEdit = mockExamSchedules.find(s => s.id === scheduleId);
      if (scheduleToEdit) {
        setFormData({
          ...scheduleToEdit,
          invigilators: Array.isArray(scheduleToEdit.invigilators) 
            ? scheduleToEdit.invigilators.join(', ') 
            : '',
        });
      } else {
        setError('Exam Schedule not found.');
        setTimeout(() => navigate('/academic/examschedules'), 2000);
      }
    } else {
      // Add mode: Generate a new ID
      const newId = `exm${String(mockExamSchedules.length + 1).padStart(3, '0')}`;
      setFormData({
        ...initialFormData,
        id: newId,
      });
    }
  }, [scheduleId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic Validation
    if (!formData.courseId || !formData.examName.trim() || !formData.date || !formData.time) {
      setError('Course, Exam Name, Date, and Time are required fields.');
      return;
    }

    const scheduleData = {
      ...formData,
      // Parse invigilators string back into an array of IDs, removing empty strings
      invigilators: formData.invigilators.split(',').map(id => id.trim()).filter(id => id),
    };

    if (isEditMode) {
      const index = mockExamSchedules.findIndex(s => s.id === scheduleId);
      if (index !== -1) {
        mockExamSchedules[index] = scheduleData;
        setSuccessMessage('Exam Schedule updated successfully!');
      } else {
        setError('Error: Exam Schedule not found for update.');
        return;
      }
    } else {
       // Check if ID already exists
       if (mockExamSchedules.some(s => s.id === scheduleData.id)) {
        setError(`Error: Schedule with ID ${scheduleData.id} already exists.`);
        return;
      }
      mockExamSchedules.push(scheduleData);
      setSuccessMessage('Exam Schedule added successfully!');
    }

    setTimeout(() => {
      navigate('/academic/examschedules');
    }, 1500);
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header as="h4" className={styles.formCardHeaderTitle}>
          {isEditMode ? 'Edit Exam Schedule' : 'Add New Exam Schedule'}
        </StyledCard.Header>
        <StyledCard.Body>
          {error && <StyledAlert variant="danger" className={styles.alert} dismissible onClose={() => setError('')}>{error}</StyledAlert>}
          {successMessage && <StyledAlert variant="success" className={styles.alert} dismissible onClose={() => setSuccessMessage('')}>{successMessage}</StyledAlert>}
          <form onSubmit={handleSubmit}>
            <StyledRow>
              <StyledCol className="col-md-4">
                <FormField
                  controlId="formScheduleId"
                  label="Schedule ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </StyledCol>
              <StyledCol className="col-md-8">
                <FormField
                  controlId="formCourseId"
                  label="Course"
                  as="select"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  options={[
                    { value: '', label: 'Select Course' },
                    ...mockCourses.map(course => ({
                      value: course.id,
                      label: `${course.name} (${course.courseCode})`
                    }))
                  ]}
                />
              </StyledCol>
            </StyledRow>

            <FormField
              controlId="formExamName"
              label="Exam Name"
              type="text"
              name="examName"
              value={formData.examName}
              onChange={handleChange}
              required
              className="mb-3" // Adding margin bottom, can be handled by FormField wrapper if configured
            />
            
            <StyledRow>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formDate"
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formTime"
                  label="Time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
            </StyledRow>

            <StyledRow>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formRoom"
                  label="Room/Venue"
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formDuration"
                  label="Duration"
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 2 hours"
                />
              </Col>
            </Row>

            <FormField
              controlId="formInvigilators"
              label="Invigilators (Faculty IDs, comma-separated)"
              as="textarea"
              rows={2}
              name="invigilators"
              value={formData.invigilators}
              onChange={handleChange}
              placeholder="e.g., faculty001, faculty002"
              className="mb-3"
            />
            {/* Note: A multi-select dropdown from mockFaculty would be a good enhancement here. */}

            <FormField
              controlId="formNotes"
              label="Notes"
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mb-3"
            />

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/academic/examschedules')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Schedule'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditExamSchedulePage;
