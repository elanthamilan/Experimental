import React, { useState } from 'react';
import { Row, Col, Form as BootstrapForm, Breadcrumb, Alert, Card, Button as BootstrapButton } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import StyledContainer from './atoms/StyledContainer';
import StyledCard from './atoms/StyledCard';
import StyledButton from './atoms/StyledButton';
import StyledFormLabel from './atoms/StyledFormLabel';
import FormField from './molecules/FormField';
// Atoms below are used via FormField molecule
// import StyledFormControl from './atoms/StyledFormControl';
// import StyledFormSelect from './atoms/StyledFormSelect';
// import StyledFormCheck from './atoms/StyledFormCheck';
import ProductTableRow from './molecules/ProductTableRow'; // Import molecule
import FileUploadDropzone from './molecules/FileUploadDropzone'; // Import molecule
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

  return (
    <StyledContainer fluid className={styles.formPageContainer}> {/* Apply container class */}
      {/* 1. Breadcrumbs & Top Actions */}
      <Row className="align-items-center mb-3">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
            {/* Add more levels if needed */}
            <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs="auto">
          {/* Top action buttons like Send Feedback, Video, Manual - Use StyledButton if desired */}
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
             // TODO: Add 'danger' or 'outline-danger' variant to StyledButton if needed
            <BootstrapButton variant="outline-danger" size="sm" onClick={() => {/* TODO: handleDelete */}}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom' }}>delete</span> Delete
            </BootstrapButton>
          )}
        </Col>
      </Row>

      {/* Page Title */}
      <h2 className={`mb-3 ${styles.pageTitle}`}>{pageTitle}</h2> {/* Apply title style */}

      {/* 1.1 Error Summary */}
      {showErrors && errorSummary.length > 0 && (
        <Alert variant="danger" className="mb-3">
          <h6>There are {errorSummary.length} errors to be resolved</h6>
          <ul>
            {errorSummary.map(err => (
              <li key={err.id}>
                {/* TODO: Make this clickable to scroll (onClick={() => handleScrollToError(err.id)}) */}
                 {/* Using BootstrapButton directly for this specific link style */}
                <BootstrapButton variant="link" className="p-0 text-danger text-decoration-none" >
                  {err.message}
                </BootstrapButton>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* 1.2 Callouts */}
      <Alert variant="warning" className="d-flex align-items-center mb-3">
        <span className="material-symbols-outlined me-2">warning</span>
        Callouts can be colored and have an icon too.
        {/* TODO: Add Delete button if needed for specific callouts */}
      </Alert>
      <Alert variant="info" className="d-flex align-items-center mb-3">
        <span className="material-symbols-outlined me-2">info</span>
        Callouts can be colored and have an icon too.
      </Alert>
      {/* Add more callouts as needed */}


      {/* 2. Form Sections */}
      <BootstrapForm onSubmit={() => {/* TODO: handleSubmit */}}> {/* Use BootstrapForm */}

        {/* 2.1 Section: Basics (First Instance) */}
        <StyledCard variant="default" className={`${styles.formSectionCard} mb-3`}>
          <Card.Body>
            {/* Card Title and Description */}
            <Row>
              <Col md={4}> {/* Left side with title/description */}
                <Card.Title>Basics</Card.Title>
                <Card.Text className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </Card.Text>
              </Col>
              <Col md={8}> {/* Right side with form fields */}
                {/* 2.1.1 & 2.1.2 */}
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                     <FormField
                       controlId="field2_1_2" // Use name for controlId too for consistency
                       label="Discount Amount"
                       type="number" // Assuming currency might be number
                       placeholder="e.g. 10.00"
                       inputGroupPrepend="$"
                       className="mb-3"
                       name="field2_1_2"
                       value={formData.field2_1_2}
                       onChange={handleChange}
                       // TODO: Add currency validation if needed
                     />
                  </Col>
                </Row>
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
                 <Row>
                   <Col md={6}>
                     <FormField
                       controlId="formField2_1_4a"
                       label="Label"
                       type="text"
                       placeholder="Input text"
                       className="mb-3"
                     />
                   </Col>
                   <Col md={6}>
                     <FormField
                       controlId="formField2_1_4b"
                       label="Label"
                       type="text"
                       placeholder="Input text"
                       className="mb-3"
                     />
                   </Col>
                 </Row>
                 {/* 2.1.6 File Upload */}
                 <BootstrapForm.Group className="mb-3" controlId="formField2_1_6">
                   <StyledFormLabel>Upload Images/Documents</StyledFormLabel>
                   <FileUploadDropzone onFilesAccepted={handleFilesAccepted} />
                   {/* TODO: Display uploaded file previews/list if needed */}
                 </BootstrapForm.Group>
                 {/* 2.1.7 Checkbox */}
                 <FormField
                   controlId="field2_1_7"
                   label="Remember the informations"
                   type="checkbox"
                   name="field2_1_7"
                   checked={formData.field2_1_7}
                   onChange={handleChange}
                 />
              </Col>
            </Row>
          </Card.Body>
        </StyledCard>

        {/* 2.1.5 User Info / Transportation Dept Section */}
        {/* This section seems misplaced in the screenshot, combining user info and transportation? */}
        {/* Recreating based on the visual grouping */}
        <Card className={`${styles.formSectionCard} mb-3`}> {/* Apply card style */}
          <Card.Body>
             <Row>
              <Col md={4}>
                 {/* Assuming this is related to the user shown at bottom-left */}
                 <Card.Title>John Smith</Card.Title>
                 <Card.Text className="text-muted">JS Accounts team</Card.Text>
                 <hr/>
                 <Card.Title>Transportation Department</Card.Title>
                 <Card.Text className="text-muted">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                 </Card.Text>
              </Col>
              <Col md={8}>
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
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 2.2 Section: Basics (Checkboxes) */}
        <Card className={`${styles.formSectionCard} mb-3`}> {/* Apply card style */}
          <Card.Body>
            <Row>
              <Col md={4}>
                <Card.Title>Basics</Card.Title>
                <Card.Text className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </Card.Text>
              </Col>
              <Col md={8}>
                {/* 2.2.1 Checkboxes */}
                {/* 2.2.1 Checkboxes */}
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
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 2.3 Section: Basics (Radio Buttons) */}
        <Card className={`${styles.formSectionCard} mb-3`}> {/* Apply card style */}
          <Card.Body>
             <Row>
              <Col md={4}>
                <Card.Title>Basics</Card.Title>
                <Card.Text className="text-muted">
                  Lorem ipsum dolor sit amet, conem fetat adipiscing elit, sed do eiusmod tempor
                </Card.Text>
              </Col>
              <Col md={8}>
                {/* 2.3.1 Radio Group */}
                <FormField
                  controlId="manualRadio"
                  label="Manual"
                  type="radio"
                  name="productAddType" // Name groups radios
                  value="manual" // Value for this option
                  checked={formData.productAddType === 'manual'}
                  onChange={handleChange}
                  className="mb-1"
                />
                <BootstrapForm.Text className="text-muted d-block ms-4 mb-2">Add products to this collection one by one.</BootstrapForm.Text>
                <FormField
                  controlId="automatedRadio"
                  label="Automated"
                  type="radio"
                  name="productAddType" // Name groups radios
                  value="automated" // Value for this option
                  checked={formData.productAddType === 'automated'}
                  onChange={handleChange}
                />
                <BootstrapForm.Text className="text-muted d-block ms-4 mb-2">Existing and future products that match the conditions you set will automatically be added to this collection.</BootstrapForm.Text>
                 {/* 2.5 Additional Settings Link (Placeholder) */}
                <StyledButton variant="link" size="sm" className="p-0">Additional settings +</StyledButton>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 2.6 Product Table Section */}
        <Card className={`${styles.formSectionCard} mb-3`}> {/* Apply card style */}
          <Card.Body>
             <Row>
              <Col md={4}>
                 {/* 2.4 Basics Title (Collapsible?) */}
                 <Card.Title>Basics +</Card.Title>
                 {/* Description might go here if expanded */}
              </Col>
              <Col md={8}>
                 {/* 2.6 Product Table */}
                 <Row className="mb-2 text-muted small fw-bold">
                   <Col md={6}>PRODUCT</Col>
                   <Col md={3} className="text-center">QTY</Col>
                   <Col md={3} className="text-end">TOTAL</Col>
                 </Row>
                 {/* Map over productRows state and render ProductTableRow molecule */}
                 {productRows.map(row => (
                   <ProductTableRow
                     key={row.id}
                     rowId={row.id}
                     productValue={row.product}
                     quantityValue={row.qty}
                     totalValue={row.total} // Pass total if calculated
                     onProductChange={(id, value) => handleProductChange(id, 'product', value)}
                     onQuantityChange={(id, value) => handleProductChange(id, 'qty', value)}
                     onRemoveRow={handleRemoveProductRow}
                   />
                 ))}
                 {/* Add Button */}
                 <StyledButton
                   variant="link"
                   size="sm"
                   className="p-0 mt-2"
                   onClick={handleAddProductRow}
                 >
                   + Add
                 </StyledButton>
              </Col>
            </Row>
             <hr/>
             <Row>
               <Col md={4}>
                 {/* 2.7 Basics Title (Collapsible?) */}
                 <Card.Title>Basics +</Card.Title>
                  <Card.Text className="text-muted">
                   Laren mum dolor sit amet, consechetar adipiscing wit sad do wisted tempor
                 </Card.Text>
               </Col>
               <Col md={8}>
                 {/* 2.8.1 Tags Input */}
                 {/* TODO: Refactor Tags Input - might need a dedicated molecule or library */}
                 <BootstrapForm.Group className="mb-3" controlId="formField2_8_1">
                   <StyledFormLabel>Label</StyledFormLabel>
                   <div className={`border p-2 rounded ${styles.tagInputPlaceholder}`}>
                      <span className="badge bg-secondary me-1">Selection <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize: '0.6em'}} aria-label="Remove"></button></span>
                      <span className="badge bg-secondary me-1">Selection <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize: '0.6em'}} aria-label="Remove"></button></span>
                      <input type="text" placeholder="Select" className="d-inline-block border-0 shadow-none p-0 ms-1 bg-light" style={{outline: 'none'}}/>
                   </div>
                 </BootstrapForm.Group>
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
               </Col>
             </Row>
              <hr/>
              <Row>
                <Col md={4}>
                   {/* 2.9 Additional Settings Title (Collapsible?) */}
                   <Card.Title>Additional settings +</Card.Title>
                </Col>
                <Col md={8}>
                   {/* 2.9.1 Checkboxes */}
                   <StyledFormLabel>Query string forwarding and caching</StyledFormLabel> {/* Keep label separate if it applies to multiple checks */}
                   <FormField controlId="formField2_9_1a" label="Checkbox" type="checkbox" defaultChecked />
                   <FormField controlId="formField2_9_1b" label="Checkbox" type="checkbox" />
                </Col>
              </Row>
          </Card.Body>
        </Card>

        {/* 3. Bottom Action Buttons */}
        <div className={`text-end mt-4 mb-3 ${styles.formActions}`}>
           {/* Apply specific button styles using StyledButton */}
           {/* TODO: Implement handleReset */}
           <StyledButton variant="secondary" type="button" className={`me-2 ${styles.resetButton}`} onClick={() => console.log('Reset clicked')}>Reset</StyledButton>
           {/* TODO: Implement handleDiscard */}
           <StyledButton variant="outline-secondary" type="button" className={`me-2 ${styles.discardButton}`} onClick={() => console.log('Discard clicked')}>Discard</StyledButton>
           {/* Submit button triggers form onSubmit */}
           <StyledButton variant="primary" type="submit" className={styles.saveButton}>Save</StyledButton>
        </div>

      </BootstrapForm> {/* Use BootstrapForm */}
    </StyledContainer>
  );
};

export default AddEditForm;
