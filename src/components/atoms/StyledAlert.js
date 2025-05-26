import React, { useState } from 'react';
import styles from './StyledAlert.module.scss';

const StyledAlert = ({
  children,
  variant = 'primary',
  className,
  heading,
  dismissible = false,
  onClose,
  show: initialShow = true,
}) => {
  const [isVisible, setIsVisible] = useState(initialShow);

  React.useEffect(() => {
    setIsVisible(initialShow);
  }, [initialShow]);

  const handleClose = (e) => {
    if (onClose) {
      onClose(e);
    }
    // If onClose is provided, it's up to the parent to control visibility via the `show` prop.
    // If not, the component manages its own visibility.
    if (onClose === undefined) {
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  const alertClasses = [
    styles.styledAlert,
    styles[`alert-${variant}`], // e.g., styles['alert-primary']
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClasses} role="alert">
      {heading && <h4 className={styles.alertHeading}>{heading}</h4>}
      {children}
      {dismissible && (
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close"
          onClick={handleClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};

export default StyledAlert;
