import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './StyledFormControl.module.scss';

/**
 * Atom for a styled Form Control (input, textarea).
 * Applies consistent styling from SCSS module.
 */
const StyledFormControl = ({ className = '', ...props }) => {
  return (
    <Form.Control className={`${styles.formControl} ${className}`} {...props} />
  );
};

export default StyledFormControl;
