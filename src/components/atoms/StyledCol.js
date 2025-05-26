import React from 'react';
import styles from './StyledCol.module.scss';

const StyledCol = ({ children, className, as: Component = 'div', cols, ...rest }) => {
  // Basic class name construction
  let combinedClassName = styles.styledCol;

  if (className) {
    combinedClassName = `${combinedClassName} ${className}`;
  }

  // Simple `cols` prop handling - this can be expanded later for responsiveness
  // This example assumes you might have classes like .col-6, .col-12 in your SCSS
  // or that `cols` directly maps to a utility class if you have a system for that.
  // For now, it's illustrative; the main power comes from the SCSS.
  if (cols) {
    // This is a simplistic way; a more robust solution would generate
    // specific classes or use CSS custom properties.
    // e.g., if cols="6", it might look for a class like styles['col-6']
    // For this iteration, we'll assume `className` will be used for Bootstrap-like sizing
    // or that the base .styledCol with flex properties is sufficient for many cases.
    // If you add .col-N classes to StyledCol.module.scss, you could do:
    // if (styles[`col-${cols}`]) {
    //   combinedClassName = `${combinedClassName} ${styles[`col-${cols}`]}`;
    // }
  }

  return (
    <Component className={combinedClassName.trim()} {...rest}>
      {children}
    </Component>
  );
};

export default StyledCol;
