import React from 'react';
import PropTypes from 'prop-types';
import { FormField, StyledButton } from '../index'; // Assuming components are exported from here
import styles from './ListControlsToolbar.module.scss';

const ListControlsToolbar = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  filters,
  addAction,
  children,
}) => {
  return (
    <div className={styles.tableControls}>
      <div className={styles.filterSection}>
        {onSearchChange && ( // Conditionally render search field
          <div className={styles.searchFilterItem}>
            <FormField
              controlId="listSearchTerm"
              label={searchLabel || "Search"}
              type="text"
              placeholder={searchPlaceholder || "Enter search term..."}
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        )}
        {filters && filters.map((filter) => (
          <div className={styles.dropdownFilterItem} key={filter.controlId}>
            <FormField
              controlId={filter.controlId}
              label={filter.label}
              as={filter.type === 'select' ? 'select' : 'input'}
              type={filter.type === 'select' ? undefined : filter.type || 'text'} // input type if not select
              placeholder={filter.placeholder}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
            />
          </div>
        ))}
      </div>
      <div className={styles.actionsSection}>
        {addAction && (
          <StyledButton variant="primary" onClick={addAction.onClick} className={styles.addButton}>
            {addAction.icon && <span className={`material-symbols-outlined ${styles.buttonIcon}`}>{addAction.icon}</span>}
            {addAction.label}
          </StyledButton>
        )}
        {children} {/* For any additional custom buttons or elements */}
      </div>
    </div>
  );
};

ListControlsToolbar.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  searchLabel: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      controlId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      placeholder: PropTypes.string,
      type: PropTypes.string, // text, select, date etc.
    })
  ),
  addAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string, // Material symbols icon name
  }),
  children: PropTypes.node,
};

export default ListControlsToolbar;
