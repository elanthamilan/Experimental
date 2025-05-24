import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './StyledFormLabel.module.scss';

/**
 * Atom for a styled Form Label.
 * Applies consistent styling from SCSS module.
 */
const StyledFormLabel = ({ children, className = '', ...props }) => {
  return (
    <Form.Label className={`${styles.formLabel} ${className}`} {...props}>
      {children}
    </Form.Label>
  );
};

export default StyledFormLabel;
