import React from 'react';
import styles from './ComponentPreviewPage.module.scss';

// Import from centralized design system
import {
  StyledContainer,
  StyledButton,
  StyledFormCheck,
  StyledFormControl,
  StyledFormLabel,
  StyledFormSelect,
  FileUploadDropzone,
  FormField,
  // ProductTableRow, // Removed as component was deleted
} from '../components';

// Import specific molecules that aren't in main export
// import ProductTableRow from '../components/molecules/ProductTableRow'; // Removed direct import

const ComponentPreviewPage = () => {
  // Mock handlers for ProductTableRow
  const mockProductChange = (id, field, value) => console.log(`Product ${id} ${field} changed to: ${value}`);
  const mockRemoveProduct = (id) => console.log(`Product ${id} removed`);

  return (
    <StyledContainer className={styles.pageContainer}>
      <h1>Component Preview</h1>

      {/* Atom Components Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Atom Components</h2>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>StyledButton</h3>
          <div className={`${styles.componentInstance} ${styles.buttonGroup}`}>
            <StyledButton variant="primary" onClick={() => alert('Primary Clicked!')}>Primary Button</StyledButton>
            <StyledButton variant="secondary" onClick={() => alert('Secondary Clicked!')}>Secondary Button</StyledButton>
            <StyledButton variant="success" onClick={() => alert('Success Clicked!')}>Success Button</StyledButton>
            <StyledButton variant="danger" onClick={() => alert('Danger Clicked!')}>Danger Button</StyledButton>
            <StyledButton variant="warning" onClick={() => alert('Warning Clicked!')}>Warning Button</StyledButton>
            <StyledButton variant="info" onClick={() => alert('Info Clicked!')}>Info Button</StyledButton>
            <StyledButton variant="light" onClick={() => alert('Light Clicked!')}>Light Button</StyledButton>
            <StyledButton variant="dark" onClick={() => alert('Dark Clicked!')}>Dark Button</StyledButton>
            <StyledButton variant="link" onClick={() => alert('Link Clicked!')}>Link Button</StyledButton>
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>StyledFormCheck</h3>
          <div className={styles.componentInstance}>
            <StyledFormCheck type="checkbox" id="example-checkbox" label="Checkbox Example" />
            <StyledFormCheck type="radio" name="example-radio" id="example-radio1" label="Radio 1" />
            <StyledFormCheck type="radio" name="example-radio" id="example-radio2" label="Radio 2" defaultChecked />
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>StyledFormControl</h3>
          <div className={styles.componentInstance}>
            <StyledFormLabel htmlFor="text-input">Text Input:</StyledFormLabel>
            <StyledFormControl type="text" id="text-input" placeholder="Enter text" />
            <StyledFormLabel htmlFor="email-input" className="mt-2">Email Input:</StyledFormLabel>
            <StyledFormControl type="email" id="email-input" placeholder="Enter email" />
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>StyledFormLabel</h3>
          <div className={styles.componentInstance}>
            <StyledFormLabel>This is a StyledFormLabel.</StyledFormLabel>
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>StyledFormSelect</h3>
          <div className={styles.componentInstance}>
            <StyledFormLabel htmlFor="select-example">Select Example:</StyledFormLabel>
            <StyledFormSelect id="select-example">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </StyledFormSelect>
          </div>
        </div>
      </section>

      {/* Molecule Components Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Molecule Components</h2>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>FileUploadDropzone</h3>
          <div className={styles.componentInstance}>
            <FileUploadDropzone onFilesAccepted={(files) => console.log('Files accepted:', files)} />
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>FormField</h3>
          <div className={`${styles.componentInstance} ${styles.formElementGroup}`}>
            <FormField
              label="Name (Text Input)"
              type="text"
              placeholder="Enter your name"
              name="name"
              value=""
              onChange={() => {}}
            />
            <FormField
              label="Category (Select)"
              type="select"
              name="category"
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'Choose...' },
                { value: 'cat1', label: 'Category 1' },
                { value: 'cat2', label: 'Category 2' },
              ]}
            />
          </div>
           <div className={`${styles.componentInstance} ${styles.formElementGroup}`}>
            <FormField
                label="Is Active (Checkbox)"
                type="checkbox"
                name="isActive"
                checked={true}
                onChange={() => {}}
                className="mt-2" // Example of passing className
            />
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3 className={styles.componentName}>ProductTableRow (Removed)</h3>
          <div className={styles.componentInstance}>
            <p className={styles.notes}>
              The ProductTableRow component has been removed from the project.
            </p>
            {/* 
            <p className={styles.notes}>
              ProductTableRow is designed to work within a specific table structure (e.g., part of a <code>&lt;tbody&gt;</code>)
              and requires several props and handlers from a parent component, typically for managing a list of products.
              Below is a simplified rendering attempt with mock data and handlers.
              See <code>AddEditForm.js</code> for a more complete usage example.
            </p>
            <div style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '10px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <ProductTableRow
                    rowId="mock1"
                    productValue="Sample Product A"
                    quantityValue="2"
                    totalValue="100.00"
                    onProductChange={mockProductChange}
                    onQuantityChange={(id, val) => mockProductChange(id, 'quantity', val)}
                    onRemoveProduct={mockRemoveProduct}
                    productOptions={[
                        { value: 'Sample Product A', label: 'Sample Product A' },
                        { value: 'Sample Product B', label: 'Sample Product B' },
                    ]}
                  />
                   <ProductTableRow
                    rowId="mock2"
                    productValue="Sample Product B"
                    quantityValue="1"
                    totalValue="50.00"
                    onProductChange={mockProductChange}
                    onQuantityChange={(id, val) => mockProductChange(id, 'quantity', val)}
                    onRemoveProduct={mockRemoveProduct}
                    productOptions={[
                        { value: 'Sample Product A', label: 'Sample Product A' },
                        { value: 'Sample Product B', label: 'Sample Product B' },
                    ]}
                    isFirstRow={false} // Assuming this prop might exist or be useful
                  />
                </tbody>
              </table>
            </div>
            */}
          </div>
        </div>
      </section>
    </StyledContainer>
  );
};

export default ComponentPreviewPage;
