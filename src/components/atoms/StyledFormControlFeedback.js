import React from 'react';
import styles from './StyledFormControlFeedback.module.scss';

const StyledFormControlFeedback = ({
  children,
  className,
  type = 'invalid', // 'valid' or 'invalid'
  as: Component = 'div',
  ...rest
}) => {
  const classNames = [
    styles.formControlFeedback,
    type === 'invalid' && styles.invalidFeedback,
    type === 'valid' && styles.validFeedback,
    className,
  ].filter(Boolean).join(' ');

  if (!children) {
    return null;
  }

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default StyledFormControlFeedback;
