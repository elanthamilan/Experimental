import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers'; // For teacher selection
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Using admin styles for consistency

const AddEditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(courseId);

  const [formData, setFormData] = useState({
    id: '', // Auto-generated for new, set for edit
    courseCode: '',
    name: '',
    description: '',
    credits: 0,
    teacherId: '',
    department: '',
    semester: '',
    schedule: '',
    syllabus: '', // New field
  });

  useEffect(() => {
    if (isEditMode && courseId) {
      const courseToEdit = mockCourses.find(c => c.id === courseId);
      if (courseToEdit) {
        setFormData(courseToEdit);
      } else {
        alert(`Course with ID ${courseId} not found.`);
        navigate('/courses');
      }
    } else {
      setFormData(prev => ({ ...prev, id: `course${String(mockCourses.length + 1).padStart(3, '0')}` }));
    }
  }, [isEditMode, courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert(`Course data for "${formData.name}" ${isEditMode ? 'updated' : 'added'} (mock).`);
    
    if (isEditMode) {
      const index = mockCourses.findIndex(c => c.id === courseId);
      if (index !== -1) {
        mockCourses[index] = { ...formData };
      }
    } else {
      mockCourses.push({ ...formData });
    }
    navigate('/courses');
  };

  const teachers = mockUsers.filter(user => user.role === 'Teacher');

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header as="h4" className={styles.formCardHeader}>
          {isEditMode ? 'Edit Course Information' : 'Add New Course'}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="formCourseId">
                <Form.Label>Course ID</Form.Label>
                <Form.Control type="text" name="id" value={formData.id} readOnly />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="formCourseCode">
                <Form.Label>Course Code</Form.Label>
                <Form.Control type="text" name="courseCode" value={formData.courseCode} onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="formCourseName">
                <Form.Label>Course Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="formCredits">
                <Form.Label>Credits</Form.Label>
                <Form.Control type="number" name="credits" value={formData.credits} onChange={handleChange} required min="0" />
              </Form.Group>
              <Form.Group as={Col} md="9" controlId="formTeacherId">
                <Form.Label>Teacher</Form.Label>
                <Form.Select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {`${teacher.firstName} ${teacher.lastName} (${teacher.department || 'N/A'})`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formSemester">
                <Form.Label>Semester</Form.Label>
                <Form.Control type="text" name="semester" value={formData.semester} onChange={handleChange} />
              </Form.Group>
            </Row>
            
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="formSchedule">
                <Form.Label>Schedule</Form.Label>
                <Form.Control type="text" name="schedule" value={formData.schedule} onChange={handleChange} placeholder="e.g., MWF 10:00-11:00 AM" />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="formSyllabus">
                <Form.Label>Syllabus</Form.Label>
                <Form.Control as="textarea" rows={5} name="syllabus" value={formData.syllabus} onChange={handleChange} placeholder="Enter course syllabus or learning objectives..." />
              </Form.Group>
            </Row>

            <div className="mt-4 d-flex justify-content-end">
              <Button variant="secondary" onClick={() => navigate('/courses')} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Course' : 'Add Course'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditCoursePage;
