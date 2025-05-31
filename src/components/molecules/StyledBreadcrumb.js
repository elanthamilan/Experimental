import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './StyledBreadcrumb.module.scss';

const StyledBreadcrumb = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className={`${styles.breadcrumbNav} ${className}`.trim()}>
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`${styles.breadcrumbItem} ${item.isActive ? styles.active : ''}`.trim()}
            aria-current={item.isActive ? 'page' : undefined}
          >
            {item.isActive || !item.path ? (
              <span>{item.label}</span>
            ) : (
              <Link to={item.path} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

StyledBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string, // Optional, not present for the active item or non-link items
      isActive: PropTypes.bool,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default StyledBreadcrumb;
