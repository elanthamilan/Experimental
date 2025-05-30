import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers'; // For teacher selection
// import { Form } from 'react-bootstrap'; // Form removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  FormField, // FormField should replace Form.Group, Form.Label, Form.Control, Form.Select
  StyledRow, // Added
  StyledCol,  // Added
} from '../../components';
import styles from './AddEditCoursePage.module.scss'; // Using its own SCSS module

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
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}> {/* Use own styles or common AdminPages.module.scss */}
        <h1 className={styles.pageTitle}>{isEditMode ? 'Edit Course Information' : 'Add New Course'}</h1>
        <p className={styles.pageDescription}>
          {isEditMode ? 'Update the details for the existing course.' : 'Fill in the details to create a new course.'}
        </p>
      </div>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header className={styles.formCardHeader}>
          {/* Title moved to pageHeader */}
        </StyledCard.Header>
        <StyledCard.Body>
          <form onSubmit={handleSubmit}>
            <StyledRow className="mb-3"> {/* Using Bootstrap Row for now, can be replaced if StyledRow exists */}
              <StyledCol className="col-md-2">
                <FormField
                  controlId="formCourseId"
                  label="Course ID"
                  type="text"
                  name="id"
                  value={formData.id}
                  readOnly
                />
              </StyledCol>
              <StyledCol className="col-md-5">
                <FormField
                  controlId="formCourseCode"
                  label="Course Code"
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
              <StyledCol className="col-md-5">
                <FormField
                  controlId="formCourseName"
                  label="Course Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-12">
                <FormField
                  controlId="formDescription"
                  label="Description"
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-3">
                <FormField
                  controlId="formCredits"
                  label="Credits"
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </StyledCol>
              <StyledCol className="col-md-9">
                <FormField
                  controlId="formTeacherId"
                  label="Teacher"
                  as="select"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                  options={[
                    { value: '', label: 'Select Teacher' },
                    ...teachers.map(teacher => ({
                      value: teacher.id,
                      label: `${teacher.firstName} ${teacher.lastName} (${teacher.department || 'N/A'})`
                    }))
                  ]}
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formDepartment"
                  label="Department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </StyledCol>
              <StyledCol className="col-md-6">
                <FormField
                  controlId="formSemester"
                  label="Semester"
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-12">
                <FormField
                  controlId="formSchedule"
                  label="Schedule"
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  placeholder="e.g., MWF 10:00-11:00 AM"
                />
              </StyledCol>
            </StyledRow>

            <StyledRow className="mb-3">
              <StyledCol className="col-md-12">
                <FormField
                  controlId="formSyllabus"
                  label="Syllabus"
                  as="textarea"
                  rows={5}
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleChange}
                  placeholder="Enter course syllabus or learning objectives..."
                />
              </StyledCol>
            </StyledRow>

            <div className={styles.formActions}>
              <StyledButton variant="secondary" onClick={() => navigate('/courses')}>
                Cancel
              </StyledButton>
              <StyledButton variant="primary" type="submit">
                {isEditMode ? 'Update Course' : 'Add Course'}
              </StyledButton>
            </div>
          </form>
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AddEditCoursePage;
