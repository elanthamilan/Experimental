import React from 'react';
import { InputGroup } from 'react-bootstrap';
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
      <InputGroup>
        <InputGroup.Text className={styles.searchIcon}>
          <span className="material-symbols-outlined">{icon}</span>
        </InputGroup.Text>
        
        <StyledFormControl
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={styles.searchInput}
          {...props}
        />
        
        {value && (
          <InputGroup.Text 
            className={styles.clearButton}
            onClick={handleClear}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClear();
              }
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </InputGroup.Text>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchInput;
