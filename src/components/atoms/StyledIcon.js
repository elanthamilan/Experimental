import React from 'react';
import styles from './StyledIcon.module.scss';

/**
 * A reusable styled icon component for Material Symbols.
 *
 * Props:
 * - name: string - The name of the Material Symbol (e.g., 'settings', 'home').
 * - size: 'sm' | 'md' | 'lg' | 'xl' | string - Predefined or custom font size for the icon.
 * - color: string - Custom color for the icon (CSS color value).
 * - className: string - Additional CSS classes.
 * - onClick: function - Optional click handler if the icon is made interactive (though typically wrap with StyledButton for interactivity).
 * - other props are passed down to the underlying <span> element.
 */
const StyledIcon = ({
  name,
  size = 'md', // Default size
  color,
  className = '',
  onClick,
  ...props
}) => {
  const sizeClass = styles[`icon-size-${size}`] || '';
  const iconStyle = {
    fontSize: !sizeClass && typeof size === 'string' ? size : undefined, // Custom size if not a predefined class
    color: color,
  };

  return (
    <span
      className={`material-symbols-outlined ${styles.iconBase} ${sizeClass} ${className}`.trim()}
      style={iconStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined} // Add button role if clickable, consider focusability too
      tabIndex={onClick ? 0 : undefined}   // Make focusable if clickable
      aria-hidden={!onClick && !props['aria-label'] && !props['aria-labelledby']} // Decorative if not clickable and no explicit label
      {...props}
    >
      {name}
    </span>
  );
};

export default StyledIcon;
