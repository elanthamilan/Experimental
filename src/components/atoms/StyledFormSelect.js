import React from 'react';
import styles from './StyledFormSelect.module.scss';

/**
 * Atom for a styled Form Select dropdown.
 * Applies consistent styling from SCSS module.
 * Renders as a native <select> element.
 */
const StyledFormSelect = ({ className = '', children, size, isInvalid, ...props }) => {
  let combinedClassName = styles.formSelect;
  if (className) {
    combinedClassName = `${combinedClassName} ${className}`;
  }
  if (size === 'sm') {
    combinedClassName = `${combinedClassName} ${styles.formSelectSm}`;
  }
  if (isInvalid) {
    combinedClassName = `${combinedClassName} ${styles.isInvalid}`;
  }

  return (
    <select className={combinedClassName.trim()} {...props}>
      {children}
    </select>
  );
};

export default StyledFormSelect;
