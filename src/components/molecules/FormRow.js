import React from 'react';
import StyledRow from '../atoms/StyledRow';
import styles from './FormRow.module.scss';

/**
 * FormRow component for consistent spacing between form rows
 * Uses design system spacing variables
 */
const FormRow = ({
  children,
  className,
  spacing = 'md', // sm, md, lg - controls margin-bottom spacing
  align = 'start', // start, center, end, stretch
  justify = 'start', // start, center, end, between, around, evenly
  ...props
}) => {
  const classNames = [
    styles.formRow,
    spacing && styles[`formRow-${spacing}`],
    align && styles[`align-${align}`],
    justify && styles[`justify-${justify}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <StyledRow className={classNames} {...props}>
      {children}
    </StyledRow>
  );
};

export default FormRow;
