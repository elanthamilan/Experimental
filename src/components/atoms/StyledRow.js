import React from 'react';
import styles from './StyledRow.module.scss';

const StyledRow = ({ children, className, as: Component = 'div', ...rest }) => {
  const combinedClassName = [
    styles.styledRow,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClassName} {...rest}>
      {children}
    </Component>
  );
};

export default StyledRow;
