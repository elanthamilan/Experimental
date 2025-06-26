import React from 'react';
import StyledFormControl from '../atoms/StyledFormControl';
import styles from './SearchInput.module.scss';

/**
 * A reusable search input molecule component.
 * Provides consistent search functionality across the application.
 *
 * Props:
 * - placeholder: string - Placeholder text (default: 'Search...')
 * - value: string - Current search value
 * - onChange: function - Change handler
 * - onClear: function - Clear handler (optional)
 * - icon: string - Material icon name (default: 'search')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - variant: 'default', 'outlined', 'filled' (default: 'default')
 * - disabled: boolean - Whether input is disabled
 * - className: Additional CSS classes
 */
const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  icon = 'search',
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
  ariaLabel, // New prop for accessibility
  ...props
}) => {
  const inputClass = styles[`search-${variant}`] || styles['search-default'];
  const sizeClass = styles[`size-${size}`] || styles['size-md'];

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`${styles.searchContainer} ${inputClass} ${sizeClass} ${className}`}>
      <div className={styles.inputWrapper}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>{icon}</span>

        <StyledFormControl
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={styles.searchInput}
          aria-label={ariaLabel || placeholder} // Apply aria-label
          {...props}
        />

        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
