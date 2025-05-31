import React from 'react';
import styles from './StyledCol.module.scss';

/**
 * A styled column component. Renders as a div by default.
 * Column sizing and responsiveness are typically handled by passing utility classes
 * (e.g., Bootstrap's .col-md-4) via the `className` prop.
 *
 * Props:
 * - children: Content of the column.
 * - className: Additional CSS classes to apply.
 * - as: The HTML element to render as (default: 'div').
 * - Other props are passed down to the underlying HTML element.
 */
const StyledCol = ({ children, className, as: Component = 'div', ...rest }) => {
  // Basic class name construction
  let combinedClassName = styles.styledCol; // Base class from SCSS module

  if (className) {
    combinedClassName = `${combinedClassName} ${className}`;
  }

  // The `cols` prop and its illustrative logic have been removed.
  // Sizing is expected to be handled via `className` (e.g., "col-6", "col-md-4")
  // or by specific flex/grid properties applied through SCSS if not using a grid utility system.

  return (
    <Component className={combinedClassName.trim()} {...rest}>
      {children}
    </Component>
  );
};

export default StyledCol;
