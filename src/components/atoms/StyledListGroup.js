import React from 'react';
import styles from './StyledListGroup.module.scss';

const StyledListGroup = ({
  children,
  className,
  as: Component = 'ul',
  variant,
  ...rest
}) => {
  const classNames = [
    styles.styledListGroup,
    variant === 'flush' && styles.listGroupFlush,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default StyledListGroup;
