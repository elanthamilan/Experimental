import React, { useState } from 'react';
import {
  StyledContainer,
  FormField,
  SearchInput,
  ActionBar,
  PageHeader,
  StyledButton, // For use within ActionBar/PageHeader demos
  StyledIcon,   // For use within PageHeader demos
  // designTokens, // May not be needed directly if components encapsulate styles
  // componentVariants // May not be needed directly
} from '../../components';
import styles from './AtomicPages.module.scss'; // Shared styles

const MoleculesPage = () => {
  // State for FormField demo
  const [textInputValue, setTextInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [formError, setFormError] = useState(null);

  // State for SearchInput demo
  const [searchValue, setSearchValue] = useState('');

  const breadcrumbItemsDemo = [
    { label: 'SIS Home', path: '#' },
    { label: 'Students', path: '#' },
    { label: 'List', isActive: true },
  ];

  const handleFormSubmitDemo = (e) => {
    e.preventDefault();
    if (!textInputValue) {
      setFormError('This text field is required.');
    } else {
      setFormError(null);
      alert(`Form submitted with Text: ${textInputValue}, Select: ${selectValue}`);
    }
  };

  return (
    <StyledContainer fluid className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Molecules</h1>
        <p>Molecules are groups of atoms bonded together and are the smallest fundamental units of a compound. These are relatively simple groups of UI elements functioning together as a unit.</p>
      </div>

      {/* PageHeader Demo */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>PageHeader</h2>
        <p>Displays page title, breadcrumbs, and optional actions.</p>
        <div className={styles.componentDemo} style={{border: 'none', padding: 0, background: 'transparent'}}>
          <PageHeader
            title="Student List"
            breadcrumbItems={breadcrumbItemsDemo}
            actions={
              <ActionBar>
                <StyledButton variant="primary" onClick={() => alert('Add New Student clicked!')}>
                  <StyledIcon name="add" size="sm" className={styles.btnIconBefore} />
                  Add New Student
                </StyledButton>
                <StyledButton variant="outline-secondary" onClick={() => alert('Export clicked!')}>
                  <StyledIcon name="download" size="sm" className={styles.btnIconBefore} />
                  Export
                </StyledButton>
              </ActionBar>
            }
          />
          <PageHeader
            title="Dashboard"
            className="mt-4" // Example of passing className
          />
        </div>
      </section>

      {/* FormField Demo */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>FormField</h2>
        <p>A combination of a label, an input control, and optional help/error text.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Text Input with Validation</h3>
          <form onSubmit={handleFormSubmitDemo} noValidate>
            <FormField
              controlId="demo-text-input"
              label="Student Name"
              type="text"
              placeholder="e.g., Jane Doe"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              isInvalid={!!formError}
              feedback={formError}
              helpText="Enter the student's full name."
              required
              className={styles.demoElement}
            />
            <FormField
              controlId="demo-select-input"
              label="Grade Level"
              as="select"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: '', label: 'Select Grade...' },
                { value: '9', label: 'Grade 9' },
                { value: '10', label: 'Grade 10' },
                { value: '11', label: 'Grade 11' },
                { value: '12', label: 'Grade 12' },
              ]}
              helpText="Select the student's current grade level."
              className={`${styles.demoElement} mt-3`}
            />
            <ActionBar className="mt-3">
              <StyledButton type="submit" variant="primary">Submit</StyledButton>
            </ActionBar>
          </form>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Other Input Types</h3>
          <FormField
            controlId="demo-email-input"
            label="Student Email"
            type="email"
            placeholder="e.g., jane.doe@example.com"
            helpText="A valid email address."
            className={styles.demoElement}
          />
          <FormField
            controlId="demo-date-input"
            label="Date of Birth"
            type="date"
            helpText="Select the student's date of birth."
            className={`${styles.demoElement} mt-3`}
          />
        </div>
      </section>

      {/* SearchInput Demo */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SearchInput</h2>
        <p>An input field specifically for search queries, with search icon and clear button.</p>
        <div className={styles.componentDemo}>
          <SearchInput
            placeholder="Search students..."
            ariaLabel="Search students by name or ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
            className={styles.demoElement}
            style={{maxWidth: '400px'}}
          />
          <p className={styles.notes}>Current search: {searchValue}</p>
        </div>
      </section>

      {/* ActionBar Demo */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ActionBar</h2>
        <p>A container for grouping action buttons.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Default (End Alignment)</h3>
          <ActionBar>
            <StyledButton variant="secondary" onClick={() => alert('Cancel clicked!')}>Cancel</StyledButton>
            <StyledButton variant="primary" onClick={() => alert('Save clicked!')}>Save Changes</StyledButton>
          </ActionBar>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Start Alignment with Small Spacing</h3>
          <ActionBar alignment="start" spacing="sm">
            <StyledButton variant="outline-primary" onClick={() => alert('Action 1 clicked!')}>Action 1</StyledButton>
            <StyledButton variant="outline-secondary" onClick={() => alert('Action 2 clicked!')}>Action 2</StyledButton>
          </ActionBar>
        </div>
      </section>

    </StyledContainer>
  );
};

export default MoleculesPage;
