import React, { useState } from 'react';
import StyledCol from '../atoms/StyledCol';
import FormField from '../molecules/FormField';
import FormRow from '../molecules/FormRow';
import StyledButton from '../atoms/StyledButton';
import styles from './SearchCriteria.module.scss';

// Define options for label lookup
const degreeOptions = [
  { value: '', label: 'Select' },
  { value: 'BE CSE', label: 'B.E CSE' },
  { value: 'BTech IT', label: 'B.Tech IT' },
];
const programOptions = [
  { value: '', label: 'Select' },
  { value: 'CS', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics' },
];

const initialFormState = {
  institution: 'SSM University',
  degree: '',
  program: '',
  academicYear: '',
  examMonth: '',
  subject: '',
  section: '',
  displayRevaluation: false,
};

const SearchCriteria = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('form', '').charAt(0).toLowerCase() + id.replace('form', '').slice(1)]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission if it's part of a Form
    // Actual search logic would go here
    setIsCollapsed(true);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setIsCollapsed(false); // Optionally expand on reset
  };

  const handleEdit = () => {
    setIsCollapsed(false);
  };

  const getPreviewText = () => {
    const parts = [];
    if (formData.institution) parts.push(formData.institution);
    if (formData.degree) {
      const degreeOption = degreeOptions.find(opt => opt.value === formData.degree);
      parts.push(degreeOption ? degreeOption.label : formData.degree);
    }
    if (formData.program) {
      const programOption = programOptions.find(opt => opt.value === formData.program);
      parts.push(programOption ? programOption.label : formData.program);
    }
    if (formData.academicYear) parts.push(formData.academicYear);
    // Add other fields as needed for the preview
    return `Showing: ${parts.join(', ')}`;
  };


  if (isCollapsed) {
    return (
      <div className={styles.searchCriteriaContainer}>
        <div className={`${styles.formContainer} ${styles.previewContainer}`}>
          <span className={styles.previewText}>{getPreviewText()}</span>
          <StyledButton variant="link" onClick={handleEdit} className={styles.editButton}>
            <span className="material-symbols-outlined">edit</span> Edit
          </StyledButton>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.searchCriteriaContainer}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSearch}>
          {/* Row 1: Institution, Degree, Program */}
          <FormRow spacing="md">
            <StyledCol xs={12} sm={6} md={4}>
              <FormField
                controlId="formInstitution"
                label="Institution"
                as="select"
                value={formData.institution}
                onChange={handleChange}
                spacing="sm"
                required={true}
                autoComplete="organization"
                helpText="Select your educational institution"
                options={[
                  { value: 'SSM University', label: 'SSM University' },
                  { value: 'Other University 1', label: 'Other University 1' },
                  { value: 'Other University 2', label: 'Other University 2' },
                ]}
              />
            </StyledCol>
            <StyledCol xs={12} sm={6} md={4}>
              <FormField
                controlId="formDegree"
                label="Degree"
                as="select"
                placeholder="Select"
                value={formData.degree}
                onChange={handleChange}
                spacing="sm"
                options={degreeOptions}
              />
            </StyledCol>
            <StyledCol xs={12} sm={6} md={4}>
              <FormField
                controlId="formProgram"
                label="Program"
                as="select"
                placeholder="Select"
                value={formData.program}
                onChange={handleChange}
                spacing="sm"
                options={programOptions}
              />
            </StyledCol>
          </FormRow>

          {/* Row 2: Academic Year, Exam Month, Subject */}
          <FormRow spacing="md">
             <StyledCol xs={12} sm={6} md={4}>
               <FormField
                 controlId="formAcademicYear"
                 label="Academic year"
                 as="select"
                 placeholder="Select"
                 value={formData.academicYear}
                 onChange={handleChange}
                 spacing="sm"
                 options={[
                   { value: '', label: 'Select' },
                   { value: '2023-2024', label: '2023-2024' },
                   { value: '2022-2023', label: '2022-2023' },
                 ]}
               />
             </StyledCol>
             <StyledCol xs={12} sm={6} md={4}>
               <FormField
                 controlId="formExamMonth"
                 label="Exam month"
                 as="select"
                 placeholder="Select Month"
                 value={formData.examMonth}
                 onChange={handleChange}
                 spacing="sm"
                 required={true}
                 helpText="Choose the month when the exam was conducted"
                 options={[
                  { value: '', label: 'Select Month' },
                  { value: '01', label: 'January' },
                  { value: '02', label: 'February' },
                  { value: '03', label: 'March' },
                  { value: '04', label: 'April' },
                  { value: '05', label: 'May' },
                  { value: '06', label: 'June' },
                  { value: '07', label: 'July' },
                  { value: '08', label: 'August' },
                  { value: '09', label: 'September' },
                  { value: '10', label: 'October' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'December' },
                 ]}
               />
             </StyledCol>
             <StyledCol xs={12} sm={6} md={4}>
               <FormField
                 controlId="formSubject"
                 label="Subject"
                 as="select"
                 placeholder="Select"
                 value={formData.subject}
                 onChange={handleChange}
                 spacing="sm"
                 options={[
                   { value: '', label: 'Select' },
                   { value: 'Physics II', label: 'Physics II' },
                   { value: 'Mathematics II', label: 'Mathematics II' },
                 ]}
               />
             </StyledCol>
          </FormRow>

          {/* Row 3: Section, Checkbox, Buttons */}
          <FormRow spacing="sm">
             <StyledCol xs={12} sm={6} md={4}>
               <FormField
                 controlId="formSection"
                 label="Section"
                 as="select"
                 placeholder="Select"
                 value={formData.section}
                 onChange={handleChange}
                 spacing="xs"
                 options={[
                   { value: '', label: 'Select' },
                   { value: 'A', label: 'A' },
                   { value: 'B', label: 'B' },
                 ]}
               />
             </StyledCol>

            <StyledCol xs={12} md={8} className="d-flex align-items-end justify-content-between justify-content-md-end mt-3 mt-md-0">
               <FormField
                 controlId="formDisplayRevaluation"
                 label="Display revaluation"
                 type="checkbox"
                 checked={formData.displayRevaluation}
                 onChange={handleChange}
                 spacing="xs"
                 className={`${styles.displayRevaluationCheck} me-auto me-md-3`}
               />
               <div className="d-flex align-items-center">
                 <StyledButton variant="secondary" onClick={handleReset} className="me-2">
                   Reset
                 </StyledButton>
                 <StyledButton variant="primary" type="submit">
                   <span className="material-symbols-outlined">search</span> Search
                 </StyledButton>
              </div>
            </StyledCol>
          </FormRow>
        </form>
      </div>
    </div>
  );
};

export default SearchCriteria;
