import React from 'react';
import styles from './StyledContainer.module.scss';

/**
 * A reusable styled container component. Renders as a <div>.
 * Provides consistent spacing and layout across the application.
 *
 * Props:
 * - variant: 'default', 'fluid', 'page', 'section' (default: 'default')
 * - spacing: 'none', 'sm', 'md', 'lg', 'xl' (default: 'md')
 * - children: Container content
 * - className: Additional CSS classes
 * - fluid: boolean - makes container fluid (default: false). If true, overrides 'variant' for fluid behavior.
 * - Other props are passed down to the underlying <div> element.
 */
const StyledContainer = ({
  variant = 'default',
  spacing = 'md',
  children,
  className = '',
  fluid = false,
  ...props
}) => {
  let determinedVariant = variant;
  if (fluid && variant !== 'fluid') {
    // If fluid prop is true, it forces the container to be fluid,
    // potentially overriding other variant styles if they conflict with fluid width.
    // The SCSS should define `container-fluid` to handle max-width: 100%.
    determinedVariant = 'fluid';
  } else if (variant === 'fluid') {
    determinedVariant = 'fluid'; // Explicitly set for clarity if variant is 'fluid'
  }
  // If neither fluid=true nor variant='fluid', determinedVariant remains the initially passed variant.

  const containerClass = styles[`container-${determinedVariant}`] || styles['container-default'];
  const spacingClass = styles[`spacing-${spacing}`] || styles['spacing-md'];

  const combinedClassName = `${styles.containerBase} ${containerClass} ${spacingClass} ${className}`.trim();

  return (
    <div
      className={combinedClassName}
      {...props}
    >
      {children}
    </div>
  );
};

export default StyledContainer;
