import React from 'react';
import { Container } from 'react-bootstrap';
import styles from './StyledContainer.module.scss';

/**
 * A reusable styled container component based on React-Bootstrap Container.
 * Provides consistent spacing and layout across the application.
 *
 * Props:
 * - variant: 'default', 'fluid', 'page', 'section' (default: 'default')
 * - spacing: 'none', 'sm', 'md', 'lg', 'xl' (default: 'md')
 * - children: Container content
 * - className: Additional CSS classes
 * - fluid: boolean - makes container fluid (default: false)
 * - Other props are passed down to the underlying React-Bootstrap Container
 */
const StyledContainer = ({
  variant = 'default',
  spacing = 'md',
  children,
  className = '',
  fluid = false,
  ...props
}) => {
  const containerClass = styles[`container-${variant}`] || styles['container-default'];
  const spacingClass = styles[`spacing-${spacing}`] || styles['spacing-md'];

  return (
    <Container 
      fluid={fluid || variant === 'fluid'}
      className={`${styles.containerBase} ${containerClass} ${spacingClass} ${className}`}
      {...props}
    >
      {children}
    </Container>
  );
};

export default StyledContainer;
