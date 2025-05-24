import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './StyledButton.module.scss'; // We'll create this next

/**
 * A reusable styled button component based on React-Bootstrap Button.
 * Applies consistent styling based on variants defined in SCSS.
 *
 * Props:
 * - variant: 'primary', 'secondary', 'outline-secondary', 'link', 'icon-secondary' (default: 'primary')
 * - tooltipText: Text to display in a tooltip on hover.
 * - tooltipPlacement: Placement for the tooltip (default: 'top').
 * - children: Button content (text, icons, etc.).
 * - className: Additional CSS classes.
 * - Other props are passed down to the underlying React-Bootstrap Button.
 */
const StyledButton = ({
  variant = 'primary',
  tooltipText,
  tooltipPlacement = 'top',
  children,
  className = '',
  ...props
}) => {
  const buttonClass = styles[`button-${variant}`] || styles['button-primary'];

  const buttonElement = (
    <Button
      variant={variant.startsWith('outline') ? variant : 'custom'} // Use 'custom' to avoid default bootstrap styles unless it's an outline
      className={`${styles.buttonBase} ${buttonClass} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );

  if (tooltipText) {
    return (
      <OverlayTrigger
        placement={tooltipPlacement}
        overlay={
          <Tooltip id={`tooltip-${variant}-${Math.random()}`}>{tooltipText}</Tooltip>
        }
      >
        {buttonElement}
      </OverlayTrigger>
    );
  }

  return buttonElement;
};

export default StyledButton;
