import React from 'react';
import styles from './ActionBar.module.scss';

/**
 * ActionBar Molecule
 * A container for grouping action buttons, typically at the end of a form or section.
 *
 * Props:
 * - children: Node - Expected to be StyledButton components or similar actions.
 * - alignment: 'start' | 'center' | 'end' (default: 'end') - Horizontal alignment of actions.
 * - className: string - Additional CSS classes for the container.
 * - spacing: 'sm' | 'md' | 'lg' (default: 'md') - Gap between action items.
 */
const ActionBar = ({
  children,
  alignment = 'end', // Default to right-aligning actions like Save/Cancel
  className = '',
  spacing = 'md',
  ...props
}) => {
  const containerClasses = [
    styles.actionBarBase,
    styles[`alignment-${alignment}`],
    styles[`spacing-${spacing}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default ActionBar;
