import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styles from './StyledLink.module.scss';

/**
 * A reusable styled link component.
 * Renders as a react-router Link if 'to' prop is provided, otherwise a standard <a> tag.
 *
 * Props:
 * - to: string - Path for react-router Link.
 * - href: string - URL for standard <a> tag.
 * - children: Node - The content of the link.
 * - variant: 'default' | 'subtle' | 'monochrome' - Visual variants. (default: 'default')
 * - className: string - Additional CSS classes.
 * - disabled: boolean - If true, makes the link non-interactive and visually disabled.
 * - Other props are passed down to the underlying <a> or Link element.
 */
const StyledLink = React.forwardRef((
  { to, href, children, variant = 'default', className = '', disabled, ...props },
  ref
) => {
  const linkClasses = [
    styles.linkBase,
    styles[`link-${variant}`] || styles['link-default'],
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  const commonProps = {
    ref,
    className: linkClasses,
    ...(disabled && { 'aria-disabled': true }), // tabIndex will be implicitly -1 on <a> if href is missing. For span, it's not focusable.
    ...props,
  };

  // If disabled, render a non-interactive span that looks like a link
  // Clicks are prevented by pointer-events: none in CSS
  if (disabled) {
    return (
      <span {...commonProps} role="link" aria-disabled="true">
        {children}
      </span>
    );
  }

  if (to) {
    return (
      <RouterLink to={to} {...commonProps}>
        {children}
      </RouterLink>
    );
  }

  return (
    // Ensure href is present for <a> to be valid, or provide a fallback if necessary.
    // If href can be undefined, it might not be focusable or behave as expected.
    // For this component, we assume href will be provided if 'to' is not.
    <a href={href || '#'} {...commonProps}> {/* Added fallback href='#' for non-interactive links if href is missing */}
      {children}
    </a>
  );
});

export default StyledLink;
