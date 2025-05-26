import React from 'react';
import styles from './StyledListGroupItem.module.scss';

const StyledListGroupItem = ({
  children,
  className,
  as: Component = 'li',
  action,
  active,
  disabled,
  variant,
  ...rest
}) => {
  const classNames = [
    styles.styledListGroupItem,
    action && styles.action,
    active && styles.active,
    disabled && styles.disabled,
    variant && styles[`item-${variant}`], // e.g., item-success, item-danger
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default StyledListGroupItem;
