import React from 'react';
import styles from './StyledFormControl.module.scss';

/**
 * Atom for a styled Form Control (input, textarea).
 * Applies consistent styling from SCSS module.
 * Renders as a native <input> or <textarea> element.
 */
const StyledFormControl = ({
  as,
  type,
  size,
  className = '',
  isInvalid,
  ...props
}) => {
  const ElementType = as === 'textarea' || type === 'textarea' ? 'textarea' : 'input';

  let combinedClasses = styles.formControl;
  if (className) {
    combinedClasses = `${combinedClasses} ${className}`;
  }
  if (ElementType === 'textarea') {
    combinedClasses = `${combinedClasses} ${styles.textareaControl}`;
  }
  if (size === 'sm') {
    combinedClasses = `${combinedClasses} ${styles.formControlSm}`;
  }
  // Note: Bootstrap's Form.Control automatically adds 'is-invalid' class.
  // Here, we are not adding it directly but relying on FormField to show feedback,
  // or specific isInvalid styling could be added to .formControl if needed.
  // For accessibility, aria-invalid is important.

  return (
    <ElementType
      className={combinedClasses.trim()}
      type={ElementType === 'input' ? type : undefined} // Only apply type if it's an input
      aria-invalid={isInvalid ? true : undefined}
      {...props} // value, onChange, placeholder, rows, disabled, readOnly, name, id etc.
    />
  );
};

export default StyledFormControl;
