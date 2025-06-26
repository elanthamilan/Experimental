import React from 'react';
import StyledBreadcrumb from './StyledBreadcrumb'; // Assuming this atom/molecule exists
import styles from './PageHeader.module.scss';

/**
 * PageHeader Molecule
 * Displays the page title, optional breadcrumbs, and an optional slot for page-level actions.
 *
 * Props:
 * - title: string | Node - The main title of the page.
 * - breadcrumbItems: Array - Array of items for StyledBreadcrumb (e.g., [{ label: 'Home', path: '/' }]).
 * - actions: Node - React node containing action buttons (e.g., an <ActionBar />).
 * - className: string - Additional CSS classes for the main header container.
 * - titleAs: 'h1' | 'h2' | 'h3' ... (default: 'h1') - Semantic heading level for the title.
 */
const PageHeader = ({
  title,
  breadcrumbItems,
  actions,
  className = '',
  titleAs: TitleComponent = 'h1', // Default to h1 for page titles
  ...props
}) => {
  const headerClasses = [
    styles.pageHeaderBase,
    className,
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} {...props}>
      <div className={styles.titleSection}>
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <StyledBreadcrumb items={breadcrumbItems} className={styles.breadcrumbs} />
        )}
        {title && <TitleComponent className={styles.title}>{title}</TitleComponent>}
      </div>
      {actions && <div className={styles.actionsSection}>{actions}</div>}
    </header>
  );
};

export default PageHeader;
