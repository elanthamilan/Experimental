import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import styles from './StyledProgressBar.module.scss';

/**
 * StyledProgressBar component
 * A styled wrapper around React Bootstrap's ProgressBar
 */
const StyledProgressBar = ({
  now = 0,
  min = 0,
  max = 100,
  label,
  variant = 'primary',
  striped = false,
  animated = false,
  className,
  ...props
}) => {
  const classNames = [
    styles.styledProgressBar,
    variant && styles[`variant-${variant}`],
    striped && styles.striped,
    animated && styles.animated,
    className,
  ].filter(Boolean).join(' ');

  return (
    <ProgressBar
      now={now}
      min={min}
      max={max}
      label={label}
      variant={variant}
      striped={striped}
      animated={animated}
      className={classNames}
      {...props}
    />
  );
};

export default StyledProgressBar;
