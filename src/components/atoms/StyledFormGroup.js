import React from 'react';
import styles from './StyledFormGroup.module.scss';

const StyledFormGroup = ({
  children,
  className,
  controlId, // Passed through, but not directly used by this component's rendering logic
  as: Component = 'div',
  spacing = 'md', // xs, sm, md, lg - controls margin-bottom spacing
  ...rest
}) => {
  const classNames = [
    styles.styledFormGroup,
    spacing && styles[`styledFormGroup-${spacing}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default StyledFormGroup;
