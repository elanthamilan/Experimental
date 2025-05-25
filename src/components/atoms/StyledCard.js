import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './StyledCard.module.scss';

/**
 * A reusable styled card component based on React-Bootstrap Card.
 * Provides consistent styling and behavior across the application.
 *
 * Props:
 * - variant: 'default', 'stats', 'elevated', 'bordered' (default: 'default')
 * - children: Card content
 * - className: Additional CSS classes
 * - header: Optional header content (when used as prop)
 * - footer: Optional footer content (when used as prop)
 * - Other props are passed down to the underlying React-Bootstrap Card
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

  // If header/footer props are provided, use the prop-based approach
  if (header || footer) {
    return (
      <Card className={`${styles.cardBase} ${cardClass} ${className}`} {...props}>
        {header && (
          <Card.Header className={styles.cardHeader}>
            {header}
          </Card.Header>
        )}
        <Card.Body className={styles.cardBody}>
          {children}
        </Card.Body>
        {footer && (
          <Card.Footer className={styles.cardFooter}>
            {footer}
          </Card.Footer>
        )}
      </Card>
    );
  }

  // Otherwise, use the sub-component approach
  return (
    <Card className={`${styles.cardBase} ${cardClass} ${className}`} {...props}>
      {children}
    </Card>
  );
};

// Sub-components for flexible usage
StyledCard.Header = ({ children, className = '', ...props }) => (
  <Card.Header className={`${styles.cardHeader} ${className}`} {...props}>
    {children}
  </Card.Header>
);

StyledCard.Body = ({ children, className = '', ...props }) => (
  <Card.Body className={`${styles.cardBody} ${className}`} {...props}>
    {children}
  </Card.Body>
);

StyledCard.Footer = ({ children, className = '', ...props }) => (
  <Card.Footer className={`${styles.cardFooter} ${className}`} {...props}>
    {children}
  </Card.Footer>
);

StyledCard.Title = ({ children, className = '', ...props }) => (
  <Card.Title className={`${styles.cardTitle} ${className}`} {...props}>
    {children}
  </Card.Title>
);

StyledCard.Text = ({ children, className = '', ...props }) => (
  <Card.Text className={`${styles.cardText} ${className}`} {...props}>
    {children}
  </Card.Text>
);

export default StyledCard;
