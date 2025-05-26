import React from 'react';
import { Table } from 'react-bootstrap';
import styles from './StyledTable.module.scss';

/**
 * A reusable styled table component based on React-Bootstrap Table.
 * Provides consistent styling and behavior across the application.
 *
 * Props:
 * - variant: 'default', 'striped', 'bordered', 'hover', 'compact' (default: 'default')
 * - responsive: boolean - makes table responsive (default: true)
 * - children: Table content (thead, tbody, etc.)
 * - className: Additional CSS classes
 * - Other props are passed down to the underlying React-Bootstrap Table
 */
const StyledTable = ({
  variant = 'default',
  responsive = true,
  children,
  className = '',
  ...props
}) => {
  const tableClass = styles[`table-${variant}`] || styles['table-default'];

  const tableElement = (
    <Table 
      className={`${styles.tableBase} ${tableClass} ${className}`} 
      {...props}
    >
      {children}
    </Table>
  );

  if (responsive) {
    return (
      <div className={styles.tableResponsive}>
        {tableElement}
      </div>
    );
  }

  return tableElement;
};

export default StyledTable;
