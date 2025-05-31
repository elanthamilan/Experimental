import React from 'react';
import styles from './StyledCard.module.scss';

/**
 * A reusable styled card component. Renders as a <div>.
 * Provides consistent styling and behavior across the application.
 *
 * Props:
 * - variant: 'default', 'stats', 'elevated', 'bordered' (default: 'default')
 * - children: Card content
 * - className: Additional CSS classes
 * - header: Optional header content (when used as prop)
 * - footer: Optional footer content (when used as prop)
 * - Other props are passed down to the underlying <div> element.
 *
 * Can be used in two ways:
 * 1. With header/footer props: <StyledCard header="Title">Content</StyledCard>
 * 2. With sub-components: <StyledCard><StyledCard.Header>Title</StyledCard.Header><StyledCard.Body>Content</StyledCard.Body></StyledCard>
 */
const StyledCard = ({
  variant = 'default',
  children,
  className = '',
  header,
  footer,
  ...props
}) => {
  const cardClass = styles[`card-${variant}`] || styles['card-default'];
  const combinedClassName = `${styles.cardBase} ${cardClass} ${className}`.trim();

  // If header/footer props are provided, use the prop-based approach
  if (header || footer) {
    return (
      <div className={combinedClassName} {...props}>
        {header && (
          <div className={styles.cardHeader}> {/* Rendered as a simple div by default */}
            {header}
          </div>
        )}
        <div className={styles.cardBody}> {/* Rendered as a simple div */}
          {children}
        </div>
        {footer && (
          <div className={styles.cardFooter}> {/* Rendered as a simple div */}
            {footer}
          </div>
        )}
      </div>
    );
  }

  // Otherwise, use the sub-component approach (children are expected to be StyledCard.Header, .Body, etc.)
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Sub-components for flexible usage
StyledCard.Header = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardHeader} ${className}`.trim()} {...props}>
    {children}
  </div>
);

StyledCard.Body = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardBody} ${className}`.trim()} {...props}>
    {children}
  </div>
);

StyledCard.Footer = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardFooter} ${className}`.trim()} {...props}>
    {children}
  </div>
);

StyledCard.Title = ({ children, className = '', as: Component = 'h5', ...props }) => (
  <Component className={`${styles.cardTitle} ${className}`.trim()} {...props}>
    {children}
  </Component>
);

StyledCard.Text = ({ children, className = '', as: Component = 'p', ...props }) => (
  <Component className={`${styles.cardText} ${className}`.trim()} {...props}>
    {children}
  </Component>
);

export default StyledCard;
