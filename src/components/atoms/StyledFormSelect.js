import React from 'react';
import styles from './StyledFormSelect.module.scss';

/**
 * Atom for a styled Form Select dropdown.
 * Applies consistent styling from SCSS module.
 * Renders as a native <select> element.
 */
const StyledFormSelect = ({ className = '', children, size, ...props }) => {
  let combinedClassName = styles.formSelect;
  if (className) {
    combinedClassName = `${combinedClassName} ${className}`;
  }
  if (size === 'sm') {
    combinedClassName = `${combinedClassName} ${styles.formSelectSm}`;
  }

  return (
    <select className={combinedClassName.trim()} {...props}>
      {children}
    </select>
  );
};

export default StyledFormSelect;
