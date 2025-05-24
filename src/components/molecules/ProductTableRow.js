import React from 'react';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import StyledFormControl from '../atoms/StyledFormControl';
// Assuming styles for table rows might be needed, though much comes from parent table context
// import styles from './ProductTableRow.module.scss';

/**
 * Molecule representing a single row in the product table within AddEditForm.
 */
const ProductTableRow = ({
  rowId,
  productValue,
  quantityValue,
  totalValue, // Calculated value, likely read-only display
  onProductChange,
  onQuantityChange,
  onRemoveRow,
  productPlaceholder = "Search product",
  quantityPlaceholder = "Qty",
}) => {

  // Handlers that call the props passed down, including the rowId
  const handleProductInputChange = (e) => {
    onProductChange(rowId, e.target.value);
  };

  const handleQuantityInputChange = (e) => {
    onQuantityChange(rowId, e.target.value);
  };

  const handleRemoveClick = () => {
    onRemoveRow(rowId);
  };

  return (
    <Row className="mb-2 align-items-center">
      <Col md={6}>
        <StyledFormControl
          type="text"
          placeholder={productPlaceholder}
          value={productValue}
          onChange={handleProductInputChange}
          size="sm" // Use small size consistent with AddEditForm
          aria-label={`Product name for row ${rowId}`}
        />
      </Col>
      <Col md={3}>
        <StyledFormControl
          type="number"
          placeholder={quantityPlaceholder}
          value={quantityValue}
          onChange={handleQuantityInputChange}
          size="sm"
          className="text-center" // Center quantity as in AddEditForm
          aria-label={`Quantity for row ${rowId}`}
          min="0" // Optional: prevent negative quantity
        />
      </Col>
      <Col md={2} className="text-end">
        {/* Display calculated total - assuming passed as prop or calculated here */}
        {totalValue !== undefined ? totalValue : '-'}
      </Col>
      <Col md={1} className="text-end">
        {/* Using BootstrapButton directly for specific icon-only style */}
        {/* Consider creating an IconButton atom if this pattern repeats */}
        <BootstrapButton
          variant="link"
          size="sm"
          className="text-danger p-0"
          onClick={handleRemoveClick}
          aria-label={`Remove row ${rowId}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle' }}>
            remove_circle_outline
          </span>
        </BootstrapButton>
      </Col>
    </Row>
  );
};

export default ProductTableRow;
