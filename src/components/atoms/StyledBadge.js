import React from 'react';
import styles from './StyledBadge.module.scss';

/**
 * A reusable styled badge component.
 * Provides consistent styling and behavior across the application.
 * Renders as a <span> element.
 *
 * Props:
 * - variant: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark' (default: 'primary')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - pill: boolean - makes badge pill-shaped (default: false)
 * - children: Badge content
 * - className: Additional CSS classes
 * - Other props are passed down to the underlying <span> element.
 */
const StyledBadge = ({
  variant = 'primary',
  size = 'md',
  pill = false,
  children,
  className = '',
  ...props
}) => {
  const badgeClass = styles[`badge-${variant}`] || styles['badge-primary'];
  const sizeClass = styles[`badge-${size}`] || styles['badge-md'];
  const pillClass = pill ? styles['badge-pill'] : '';

  const combinedClassName = `${styles.badgeBase} ${badgeClass} ${sizeClass} ${pillClass} ${className}`.trim();

  return (
    <span
      className={combinedClassName}
      {...props} // Spread other valid HTML attributes for a span
    >
      {children}
    </span>
  );
};

export default StyledBadge;
