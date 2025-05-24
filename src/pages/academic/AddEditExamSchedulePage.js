import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockExamSchedules } from '../../data/mockExamSchedules';
import { mockCourses } from '../../data/mockCourses';
import { mockFaculty } from '../../data/mockFaculty'; // For invigilator names (optional, or for a future multi-select)
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Reusing admin styles

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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>{isEditMode ? 'Edit Exam Schedule' : 'Add New Exam Schedule'}</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formScheduleId">
                  <Form.Label>Schedule ID</Form.Label>
                  <Form.Control type="text" name="id" value={formData.id} readOnly />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="formCourseId">
                  <Form.Label>Course</Form.Label>
                  <Form.Select name="courseId" value={formData.courseId} onChange={handleChange} required>
                    <option value="">Select Course</option>
                    {mockCourses.map(course => (
                      <option key={course.id} value={course.id}>
                        {`${course.name} (${course.courseCode})`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formExamName">
              <Form.Label>Exam Name</Form.Label>
              <Form.Control type="text" name="examName" value={formData.examName} onChange={handleChange} required />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTime">
                  <Form.Label>Time</Form.Label>
                  <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRoom">
                  <Form.Label>Room/Venue</Form.Label>
                  <Form.Control type="text" name="room" value={formData.room} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDuration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 2 hours" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formInvigilators">
              <Form.Label>Invigilators (Faculty IDs, comma-separated)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="invigilators"
                value={formData.invigilators}
                onChange={handleChange}
                placeholder="e.g., faculty001, faculty002"
              />
              {/* Note: A multi-select dropdown from mockFaculty would be a good enhancement here. */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => navigate('/academic/examschedules')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Schedule'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditExamSchedulePage;
