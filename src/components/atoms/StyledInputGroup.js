import React from 'react';
import styles from './StyledInputGroup.module.scss';

const StyledInputGroup = ({
  children,
  className,
  size,
  prepend,
  append,
  ...rest
}) => {
  const classNames = [
    styles.styledInputGroup,
    size && styles[`inputGroup-${size}`], // e.g., styles['inputGroup-sm']
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...rest}>
      {prepend && <div className={styles.inputGroupPrepend}><span className={styles.inputGroupText}>{prepend}</span></div>}
      {children}
      {append && <div className={styles.inputGroupAppend}><span className={styles.inputGroupText}>{append}</span></div>}
    </div>
  );
};

export default StyledInputGroup;
