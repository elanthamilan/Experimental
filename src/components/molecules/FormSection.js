import React from 'react';
import StyledCard from '../atoms/StyledCard';
import styles from './FormSection.module.scss';

/**
 * FormSection component for consistent spacing between form sections
 * Uses design system spacing variables
 */
const FormSection = ({
  children,
  title,
  description,
  className,
  spacing = 'md', // sm, md, lg - controls margin-bottom spacing
  variant = 'default',
  ...props
}) => {
  const classNames = [
    styles.formSection,
    spacing && styles[`formSection-${spacing}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <StyledCard variant={variant} className={classNames} {...props}>
      <StyledCard.Body>
        {(title || description) && (
          <div className={styles.sectionHeader}>
            {title && <StyledCard.Title className={styles.sectionTitle}>{title}</StyledCard.Title>}
            {description && <StyledCard.Text className={styles.sectionDescription}>{description}</StyledCard.Text>}
          </div>
        )}
        <div className={styles.sectionContent}>
          {children}
        </div>
      </StyledCard.Body>
    </StyledCard>
  );
};

export default FormSection;
