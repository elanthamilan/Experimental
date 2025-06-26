import React from 'react';
import styles from './StyledFormLabel.module.scss';

/**
 * Atom for a styled Form Label.
 * Applies consistent styling from SCSS module.
 * Renders as a native <label> element.
 */
const StyledFormLabel = ({ children, className = '', ...props }) => {
  const combinedClassName = `${styles.formLabel} ${className || ''}`.trim();

  return (
    <label className={combinedClassName} {...props}>
      {children}
    </label>
  );
};

export default StyledFormLabel;
