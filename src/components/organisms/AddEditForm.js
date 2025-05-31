import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StyledContainer from '../atoms/StyledContainer';
import StyledRow from '../atoms/StyledRow';
import StyledCol from '../atoms/StyledCol';
import StyledBreadcrumb from '../molecules/StyledBreadcrumb';
import StyledAlert from '../atoms/StyledAlert';
import StyledCard from '../atoms/StyledCard';
import StyledButton from '../atoms/StyledButton';
import StyledFormLabel from '../atoms/StyledFormLabel';
import StyledFormGroup from '../atoms/StyledFormGroup';
import FormField from '../molecules/FormField';
import FileUploadDropzone from '../molecules/FileUploadDropzone';
import styles from './AddEditForm.module.scss';

const AddEditForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const pageTitle = isEditing ? 'Edit Collection' : 'Create Collection'; // More specific title

  // --- State Management ---
  const [formData, setFormData] = useState({
    // Initialize state for some fields based on design
    field2_1_1: '', // Basics - First text input
    field2_1_2: '', // Basics - Currency input
    field2_1_3: '', // Basics - Textarea
    field2_1_7: false, // Basics - Remember checkbox
    field2_1_8: '', // Transportation - Select
    field2_1_9: false, // Transportation - Publish checkbox
    productAddType: 'automated', // Basics - Radio group
    // Add more fields as needed
  });
  const [errors, setErrors] = useState({}); // TODO: Implement validation
  const [productRows, setProductRows] = useState([{ id: 1, product: '', qty: 1, total: 0 }]); // Example for product table
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files

  // --- TODO: Data Fetching (for editing) ---
  // useEffect(() => {
  //   if (isEditing) {
  //     // Fetch item data based on id and setFormData
  //   }
  // }, [id, isEditing]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Product Table Handlers
  const handleProductChange = (rowId, field, value) => {
    setProductRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
    // TODO: Recalculate total if needed
  };

  const handleAddProductRow = () => {
    setProductRows(prevRows => [
      ...prevRows,
      { id: Date.now(), product: '', qty: 1, total: 0 } // Use timestamp for unique ID
    ]);
  };

  const handleRemoveProductRow = (rowId) => {
    setProductRows(prevRows => prevRows.filter(row => row.id !== rowId));
  };

  const handleFilesAccepted = (files) => {
    console.log('Files accepted in AddEditForm:', files);
    setUploadedFiles(files);
    // TODO: Handle actual upload logic or further processing
  };

  // const handleSubmit = (e) => { /* Validate and submit form data */ };
  // const handleDiscard = () => { /* Discard changes, maybe navigate back */ };
  // const handleReset = () => { /* Reset form to initial state */ };
  // const handleDelete = () => { /* Handle delete action (for editing) */ };
  // const handleScrollToError = (fieldId) => { /* Scroll to form field */ };

  // --- TODO: Validation ---
  // const validateForm = () => { /* Return errors object */ };

  // --- TODO: Complex Components ---
  // - Replace file input with drag-n-drop library
  // - Replace tags input placeholder with a tag input library

  // --- Placeholder Data ---
  const errorSummary = [
    { id: 'field1', message: 'Error message for field 1' },
    { id: 'field2', message: 'Error message for field 2' },
    { id: 'field3', message: 'Error message for field 3' },
    { id: 'field4', message: 'Error message for field 4' },
  ];
  const showErrors = true; // Control visibility based on validation state

  const breadcrumbItems = [
    { label: 'Home', path: '/', isActive: false },
    { label: pageTitle, isActive: true }
  ];

  return (
    <StyledContainer fluid className={styles.formPageContainer}>
      {/* 1. Breadcrumbs & Top Actions */}
      <StyledRow className="align-items-center mb-3"> {/* Replaced Row with StyledRow */}
        <StyledCol> {/* Replaced Col with StyledCol */}
          <StyledBreadcrumb items={breadcrumbItems} />
        </StyledCol>
        <StyledCol xs="auto"> {/* Replaced Col with StyledCol */}
          <StyledButton variant="link" size="sm" className="text-decoration-none me-2">
             <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom' }}>feedback</span> Send feedback
          </StyledButton>
           <StyledButton variant="link" size="sm" className="text-decoration-none me-2">
             <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom' }}>play_circle</span> Video tutorial
           </StyledButton>
           <StyledButton variant="link" size="sm" className="text-decoration-none me-3">
             <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom' }}>menu_book</span> User manual
           </StyledButton>
          {isEditing && (
            <StyledButton variant="outline-danger" size="sm" onClick={() => {/* TODO: handleDelete */}}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom' }}>delete</span> Delete
            </StyledButton>
          )}
        </StyledCol>
      </StyledRow>

      {/* Page Title */}
      <h2 className={`mb-3 ${styles.pageTitle}`}>{pageTitle}</h2>

      {/* 1.1 Error Summary */}
      {showErrors && errorSummary.length > 0 && (
        <StyledAlert variant="danger" className="mb-3"> {/* Replaced Alert */}
          <h6>There are {errorSummary.length} errors to be resolved</h6>
          <ul>
            {errorSummary.map(err => (
              <li key={err.id}>
                <StyledButton variant="link" className="p-0 text-danger text-decoration-none" onClick={() => {/* TODO: handleScrollToError(err.id) */}}>
                  {err.message}
                </StyledButton>
              </li>
            ))}
          </ul>
        </StyledAlert>
      )}

      {/* 1.2 Callouts */}
      <StyledAlert variant="warning" className="d-flex align-items-center mb-3"> {/* Replaced Alert */}
        <span className="material-symbols-outlined me-2">warning</span>
        Callouts can be colored and have an icon too.
      </StyledAlert>
      <StyledAlert variant="info" className="d-flex align-items-center mb-3"> {/* Replaced Alert */}
        <span className="material-symbols-outlined me-2">info</span>
        Callouts can be colored and have an icon too.
      </StyledAlert>

      {/* 2. Form Sections */}
      <form onSubmit={() => {/* TODO: handleSubmit */}}> {/* Replaced BootstrapForm with form */}

        {/* 2.1 Section: Basics (First Instance) */}
        <StyledCard variant="default" className={`${styles.formSectionCard} mb-3`}> {/* StyledCard used directly */}
          <StyledCard.Body> {/* Replaced Card.Body */}
            {/* Card Title and Description */}
            <StyledRow> {/* Replaced Row */}
              <StyledCol md={4}> {/* Replaced Col */}
                <StyledCard.Title>Basics</StyledCard.Title> {/* Replaced Card.Title */}
                <StyledCard.Text className="text-muted"> {/* Replaced Card.Text */}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </StyledCard.Text>
              </StyledCol>
              <StyledCol md={8}> {/* Replaced Col */}
                {/* 2.1.1 & 2.1.2 */}
                <StyledRow> {/* Replaced Row */}
                  <StyledCol md={6}> {/* Replaced Col */}
                    <FormField
                      controlId="formField2_1_1"
                      label="Collection Name"
                      type="text"
                      placeholder="e.g. Summer Collection"
                      className="mb-3"
                      name="field2_1_1" // Use name for state handling
                      value={formData.field2_1_1}
                      onChange={handleChange}
                    />
                  </StyledCol>
                  <StyledCol md={6}> {/* Replaced Col */}
                     <FormField
                       controlId="field2_1_2"
                       label="Discount Amount"
                       type="number" // Assuming currency might be number
                       placeholder="e.g. 10.00"
                       inputGroupPrepend="$"
                       className="mb-3"
                       name="field2_1_2"
                       value={formData.field2_1_2}
                       onChange={handleChange}
                     />
                  </StyledCol>
                </StyledRow>
                {/* 2.1.3 */}
                <FormField
                  controlId="field2_1_3"
                  label="Description"
                  as="textarea"
                  rows={3}
                  placeholder="Enter a description for this collection..."
                  className="mb-3"
                  name="field2_1_3"
                  value={formData.field2_1_3}
                  onChange={handleChange}
                />
                 {/* 2.1.4 */}
                 <StyledRow> {/* Replaced Row */}
                   <StyledCol md={6}> {/* Replaced Col */}
                     <FormField
                       controlId="formField2_1_4a"
                       label="Label"
                       type="text"
                       placeholder="Input text"
                       className="mb-3"
                     />
                   </StyledCol>
                   <StyledCol md={6}> {/* Replaced Col */}
                     <FormField
                       controlId="formField2_1_4b"
                       label="Label"
                       type="text"
                       placeholder="Input text"
                       className="mb-3"
                     />
                   </StyledCol>
                 </StyledRow>
                 {/* 2.1.6 File Upload */}
                 <StyledFormGroup className="mb-3" controlId="formField2_1_6"> {/* Replaced BootstrapForm.Group */}
                   <StyledFormLabel>Upload Images/Documents</StyledFormLabel>
                   <FileUploadDropzone onFilesAccepted={handleFilesAccepted} />
                 </StyledFormGroup>
                 {/* 2.1.7 Checkbox */}
                 <FormField
                   controlId="field2_1_7"
                   label="Remember the informations"
                   type="checkbox"
                   name="field2_1_7"
                   checked={formData.field2_1_7}
                   onChange={handleChange}
                 />
              </StyledCol>
            </StyledRow>
          </StyledCard.Body>
        </StyledCard>

        {/* 2.1.5 User Info / Transportation Dept Section */}
        <StyledCard className={`${styles.formSectionCard} mb-3`}> {/* Replaced Card */}
          <StyledCard.Body> {/* Replaced Card.Body */}
             <StyledRow> {/* Replaced Row */}
              <StyledCol md={4}> {/* Replaced Col */}
                 <StyledCard.Title>John Smith</StyledCard.Title> {/* Replaced Card.Title */}
                 <StyledCard.Text className="text-muted">JS Accounts team</StyledCard.Text> {/* Replaced Card.Text */}
                 <hr/>
                 <StyledCard.Title>Transportation Department</StyledCard.Title> {/* Replaced Card.Title */}
                 <StyledCard.Text className="text-muted"> {/* Replaced Card.Text */}
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                 </StyledCard.Text>
              </StyledCol>
              <StyledCol md={8}> {/* Replaced Col */}
                 {/* 2.1.8 Dropdown */}
                 <FormField
                   controlId="field2_1_8"
                   label="Department" // More specific label
                   as="select"
                   placeholder="Select Department"
                   options={[
                     // Example options
                     { value: 'hr', label: 'Human Resources' },
                     { value: 'it', label: 'Information Technology' },
                     { value: 'sales', label: 'Sales' },
                     { value: 'marketing', label: 'Marketing' },
                   ]}
                   className="mb-3"
                   name="field2_1_8"
                   value={formData.field2_1_8}
                   onChange={handleChange}
                 />
                 {/* 2.1.9 Button (Publish to portal) - Assuming this is a checkbox now based on layout */}
                 <FormField
                   controlId="field2_1_9"
                   label="Publish to portal"
                   type="checkbox"
                   name="field2_1_9"
                   checked={formData.field2_1_9}
                   onChange={handleChange}
                 />
              </StyledCol>
            </StyledRow>
          </StyledCard.Body>
        </StyledCard>

        {/* 2.2 Section: Basics (Checkboxes) */}
        <StyledCard className={`${styles.formSectionCard} mb-3`}> {/* Replaced Card */}
          <StyledCard.Body> {/* Replaced Card.Body */}
            <StyledRow> {/* Replaced Row */}
              <StyledCol md={4}> {/* Replaced Col */}
                <StyledCard.Title>Basics</StyledCard.Title> {/* Replaced Card.Title */}
                <StyledCard.Text className="text-muted"> {/* Replaced Card.Text */}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </StyledCard.Text>
              </StyledCol>
              <StyledCol md={8}> {/* Replaced Col */}
                <FormField controlId="formField2_2_1a" label="Checkbox" type="checkbox" className="mb-2" />
                <FormField controlId="formField2_2_1b" label="Checkbox" type="checkbox" className="mb-2" defaultChecked />
                {/* 2.2.2 Dropdown */}
                 <FormField
                   controlId="formField2_2_2"
                   as="select"
                   placeholder="Select"
                   options={[
                     { value: 'a', label: 'Option A' },
                     { value: 'b', label: 'Option B' },
                   ]}
                   className="mb-2"
                   style={{maxWidth: '200px'}}
                 />
                <FormField controlId="formField2_2_1c" label="Checkbox" type="checkbox" className="mb-2" />
                <FormField controlId="formField2_2_1d" label="Checkbox" type="checkbox" className="mb-2" />
              </StyledCol>
            </StyledRow>
          </StyledCard.Body>
        </StyledCard>

        {/* 2.3 Section: Basics (Radio Buttons) */}
        <StyledCard className={`${styles.formSectionCard} mb-3`}> {/* Replaced Card */}
          <StyledCard.Body> {/* Replaced Card.Body */}
             <StyledRow> {/* Replaced Row */}
              <StyledCol md={4}> {/* Replaced Col */}
                <StyledCard.Title>Basics</StyledCard.Title> {/* Replaced Card.Title */}
                <StyledCard.Text className="text-muted"> {/* Replaced Card.Text */}
                  Lorem ipsum dolor sit amet, conem fetat adipiscing elit, sed do eiusmod tempor
                </StyledCard.Text>
              </StyledCol>
              <StyledCol md={8}> {/* Replaced Col */}
                {/* 2.3.1 Radio Group */}
                <FormField
                  controlId="manualRadio"
                  label="Manual"
                  type="radio"
                  name="productAddType"
                  value="manual"
                  checked={formData.productAddType === 'manual'}
                  onChange={handleChange}
                  className="mb-1"
                />
                {/* Replaced BootstrapForm.Text with p and SCSS class */}
                <p className={`${styles.formTextMuted} d-block ms-4 mb-2`}>Add products to this collection one by one.</p>
                <FormField
                  controlId="automatedRadio"
                  label="Automated"
                  type="radio"
                  name="productAddType"
                  value="automated"
                  checked={formData.productAddType === 'automated'}
                  onChange={handleChange}
                />
                {/* Replaced BootstrapForm.Text with p and SCSS class */}
                <p className={`${styles.formTextMuted} d-block ms-4 mb-2`}>Existing and future products that match the conditions you set will automatically be added to this collection.</p>
                 {/* 2.5 Additional Settings Link (Placeholder) */}
                <StyledButton variant="link" size="sm" className="p-0">Additional settings +</StyledButton>
              </StyledCol>
            </StyledRow>
          </StyledCard.Body>
        </StyledCard>

        {/* 2.6 Product Table Section */}
        <StyledCard className={`${styles.formSectionCard} mb-3`}> {/* Replaced Card */}
          <StyledCard.Body> {/* Replaced Card.Body */}
             <StyledRow> {/* Replaced Row */}
              <StyledCol md={4}> {/* Replaced Col */}
                 {/* 2.4 Basics Title (Collapsible?) */}
                 <StyledCard.Title>Basics +</StyledCard.Title> {/* Replaced Card.Title */}
              </StyledCol>
              <StyledCol md={8}> {/* Replaced Col */}
                 {/* 2.6 Product Table */}
                 <StyledRow className="mb-2 text-muted small fw-bold"> {/* Replaced Row */}
                   <StyledCol md={6}>PRODUCT</StyledCol> {/* Replaced Col */}
                   <StyledCol md={3} className="text-center">QTY</StyledCol> {/* Replaced Col */}
                   <StyledCol md={3} className="text-end">TOTAL</StyledCol> {/* Replaced Col */}
                 </StyledRow>
                 {/* {productRows.map(row => ( // ProductTableRow was removed, so this is commented
                   <ProductTableRow
                     key={row.id}
                     rowId={row.id}
                    // ...
                 // ))} */}
                 <StyledButton
                   variant="link"
                   size="sm"
                   className="p-0 mt-2"
                   onClick={handleAddProductRow}
                 >
                   + Add
                 </StyledButton>
              </StyledCol>
            </StyledRow>
             <hr/>
             <StyledRow> {/* Replaced Row */}
               <StyledCol md={4}> {/* Replaced Col */}
                 <StyledCard.Title>Basics +</StyledCard.Title> {/* Replaced Card.Title */}
                  <StyledCard.Text className="text-muted"> {/* Replaced Card.Text */}
                   Laren mum dolor sit amet, consechetar adipiscing wit sad do wisted tempor
                 </StyledCard.Text>
               </StyledCol>
               <StyledCol md={8}> {/* Replaced Col */}
                 {/* 2.8.1 Tags Input */}
                 <StyledFormGroup className="mb-3" controlId="formField2_8_1"> {/* Replaced BootstrapForm.Group */}
                   <StyledFormLabel>Label</StyledFormLabel>
                   <div className={`border p-2 rounded ${styles.tagInputPlaceholder}`}>
                      <span className="badge bg-secondary me-1">Selection <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize: '0.6em'}} aria-label="Remove"></button></span>
                      <span className="badge bg-secondary me-1">Selection <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize: '0.6em'}} aria-label="Remove"></button></span>
                      <input type="text" placeholder="Select" className="d-inline-block border-0 shadow-none p-0 ms-1 bg-light" style={{outline: 'none'}}/>
                   </div>
                 </StyledFormGroup>
                 {/* 2.8.2 Dropdown */}
                 <FormField
                   controlId="formField2_8_2"
                   label="Label"
                   as="select"
                   placeholder="Select"
                   options={[
                     { value: 'c', label: 'Option C' },
                     { value: 'd', label: 'Option D' },
                   ]}
                   className="mb-3"
                 />
               </StyledCol>
            </StyledRow>
             <hr/>
             <StyledRow> {/* Replaced Row */}
               <StyledCol md={4}> {/* Replaced Col */}
                 <StyledCard.Title>Additional settings +</StyledCard.Title> {/* Replaced Card.Title */}
               </StyledCol>
               <StyledCol md={8}> {/* Replaced Col */}
                 {/* 2.9.1 Checkboxes */}
                 <StyledFormLabel>Query string forwarding and caching</StyledFormLabel>
                 <FormField controlId="formField2_9_1a" label="Checkbox" type="checkbox" defaultChecked />
                 <FormField controlId="formField2_9_1b" label="Checkbox" type="checkbox" />
               </StyledCol>
             </StyledRow>
          </StyledCard.Body>
        </StyledCard>

        {/* 3. Bottom Action Buttons */}
        <div className={`text-end mt-4 mb-3 ${styles.formActions}`}>
           <StyledButton variant="secondary" type="button" className={`me-2 ${styles.resetButton}`} onClick={() => console.log('Reset clicked')}>Reset</StyledButton>
           <StyledButton variant="outline-secondary" type="button" className={`me-2 ${styles.discardButton}`} onClick={() => console.log('Discard clicked')}>Discard</StyledButton>
           <StyledButton variant="primary" type="submit" className={styles.saveButton}>Save</StyledButton>
        </div>

      </form> {/* Replaced BootstrapForm with form */}
    </StyledContainer>
  );
};

export default AddEditForm;
