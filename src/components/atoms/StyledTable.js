import React from 'react';
import styles from './StyledTable.module.scss';

/**
 * A reusable styled table component. Renders as a native <table>.
 * Provides consistent styling and behavior across the application.
 *
 * Props:
 * - variant: 'default', 'striped', 'bordered', 'hover', 'compact' (default: 'default')
 * - responsive: boolean - makes table scroll horizontally on small screens (default: true)
 * - children: Table content (thead, tbody, etc.)
 * - className: Additional CSS classes
 * - Other valid HTML attributes for a <table> are passed down.
 */
const StyledTable = ({
  variant = 'default',
  responsive = true,
  children,
  className = '',
  // Destructure and filter out react-bootstrap specific props that are now handled by variants/CSS
  striped,
  bordered,
  hover,
  size,
  bsPrefix,
  // Keep other props to pass to the native table element
  ...nativeTableProps
}) => {
  const tableClassByVariant = styles[`table-${variant}`] || styles['table-default'];
  const combinedClassName = `${styles.tableBase} ${tableClassByVariant} ${className}`.trim();

  const tableElement = (
    <table
      className={combinedClassName}
      {...nativeTableProps} // Spread only valid HTML attributes
    >
      {children}
    </table>
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
