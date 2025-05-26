import React from 'react';
import styles from './StyledFormGroup.module.scss';

const StyledFormGroup = ({
  children,
  className,
  controlId, // Passed through, but not directly used by this component's rendering logic
  as: Component = 'div',
  ...rest
}) => {
  const classNames = [
    styles.styledFormGroup,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default StyledFormGroup;
