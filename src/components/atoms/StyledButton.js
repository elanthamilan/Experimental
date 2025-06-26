import React from 'react'; // Add forwardRef
import styles from './StyledButton.module.scss';

/**
 * A reusable styled button component.
 * Applies consistent styling based on variants defined in SCSS.
 *
 * Props:
 * - variant: 'primary', 'secondary', 'outline-secondary', 'link', 'icon-secondary', etc. (default: 'primary')
 * - tooltipText: Text to display in a CSS-based tooltip on hover/focus.
 * - tooltipPlacement: Placement for the tooltip (default: 'top'). Possible values: 'top', 'bottom', 'left', 'right'.
 * - children: Button content (text, icons, etc.).
 * - className: Additional CSS classes.
 * - href: If provided, the component will render as an <a> tag.
 * - type: Button type attribute (e.g., 'button', 'submit', 'reset'), defaults to 'button' if not an <a> tag.
 * - Other props are passed down to the underlying HTML <button> or <a> element.
 */
const StyledButton = React.forwardRef(( // Wrap with React.forwardRef
  {
    variant = 'primary',
    tooltipText,
    tooltipPlacement = 'top',
    children,
    className = '',
    href,
    type,
    ...props
  },
  ref // Add ref as the second argument
) => {
  const buttonClass = styles[`button-${variant}`] || styles['button-primary'];
  const combinedClassName = `${styles.buttonBase} ${buttonClass} ${className}`.trim();

  const tooltipAttributes = tooltipText
    ? {
        'data-tooltip': tooltipText,
        className: `${combinedClassName} ${styles[`tooltip${tooltipPlacement.charAt(0).toUpperCase() + tooltipPlacement.slice(1)}`]}`,
      }
    : { className: combinedClassName };

  if (href) {
    // Render as an anchor tag if href is provided
    return (
      <a
        href={href}
        role="button" // Accessibility: indicate it's interactive like a button
        ref={ref} // Apply the ref to the anchor tag
        {...tooltipAttributes}
        {...props} // Spread other props like onClick, disabled, etc.
      >
        {children}
      </a>
    );
  }

  // Render as a button tag by default
  return (
    <button
      type={type || 'button'}
      ref={ref} // Apply the ref to the button tag
      {...tooltipAttributes}
      {...props} // Spread other props like onClick, disabled, etc.
    >
      {children}
    </button>
  );
});

export default StyledButton;
