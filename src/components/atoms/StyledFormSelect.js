import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './StyledFormSelect.module.scss';

/**
 * Atom for a styled Form Select dropdown.
 * Applies consistent styling from SCSS module.
 */
const StyledFormSelect = ({ className = '', children, ...props }) => {
  return (
    <Form.Select className={`${styles.formSelect} ${className}`} {...props}>
      {children}
    </Form.Select>
  );
};

export default StyledFormSelect;
