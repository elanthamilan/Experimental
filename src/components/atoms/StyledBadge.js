import React from 'react';
import { Badge } from 'react-bootstrap';
import styles from './StyledBadge.module.scss';

/**
 * A reusable styled badge component based on React-Bootstrap Badge.
 * Provides consistent styling and behavior across the application.
 *
 * Props:
 * - variant: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark' (default: 'primary')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - pill: boolean - makes badge pill-shaped (default: false)
 * - children: Badge content
 * - className: Additional CSS classes
 * - Other props are passed down to the underlying React-Bootstrap Badge
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

  return (
    <Badge 
      className={`${styles.badgeBase} ${badgeClass} ${sizeClass} ${pillClass} ${className}`}
      {...props}
    >
      {children}
    </Badge>
  );
};

export default StyledBadge;
