import React from 'react';
import styles from './StyledDivider.module.scss';

/**
 * A reusable styled divider component.
 * Renders as an <hr> element with optional orientation and styling.
 *
 * Props:
 * - orientation: 'horizontal' | 'vertical' (default: 'horizontal')
 * - variant: 'default' | 'strong' | 'dashed' (default: 'default')
 * - className: string - Additional CSS classes.
 * - Other props are passed down to the underlying <hr> element.
 */
const StyledDivider = ({
  orientation = 'horizontal',
  variant = 'default',
  className = '',
  ...props
}) => {
  const dividerClasses = [
    styles.dividerBase,
    styles[`orientation-${orientation}`],
    styles[`variant-${variant}`] || styles['variant-default'],
    className,
  ].filter(Boolean).join(' ');

  // For vertical dividers, role="separator" and aria-orientation="vertical" are good for accessibility.
  // <hr> defaults to horizontal.
  const accessibilityProps = orientation === 'vertical'
    ? { role: 'separator', 'aria-orientation': 'vertical' }
    : { role: 'separator' }; // <hr> already has implicit separator role unless overridden (e.g. presentation)

  return (
    <hr
      className={dividerClasses}
      {...accessibilityProps}
      {...props}
    />
  );
};

export default StyledDivider;
