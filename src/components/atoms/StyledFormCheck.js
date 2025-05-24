import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './StyledFormCheck.module.scss';

/**
 * Atom for a styled Form Check (checkbox, radio, switch).
 * Applies consistent styling from SCSS module.
 */
const StyledFormCheck = ({ className = '', type, label, id, ...props }) => {
  // Switches might need a different base class if styling differs significantly
  const baseClass = type === 'switch' ? styles.formSwitch : styles.formCheck;

  return (
    <Form.Check
      type={type}
      id={id || `check-${Math.random()}`} // Ensure unique ID if not provided
      className={`${baseClass} ${className}`}
      {...props}
      // Render label separately if needed for more complex layouts or styling
      label={<span className={styles.checkLabel}>{label}</span>}
    />
  );
};

export default StyledFormCheck;
