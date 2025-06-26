import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import StyledButton from '../atoms/StyledButton';
import styles from './StyledOffcanvas.module.scss';

const OffcanvasHeader = ({ children, onClose, titleId }) => (
  <div className={styles.offcanvasHeader}>
    {children && <h5 id={titleId} className={styles.offcanvasTitle}>{children}</h5>}
    <StyledButton
      variant="link" // Assuming a link-like variant for close button
      onClick={onClose}
      className={styles.closeButton}
      aria-label="Close"
    >
      <span className="material-symbols-outlined">close</span>
    </StyledButton>
  </div>
);

OffcanvasHeader.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  titleId: PropTypes.string.isRequired,
};

const OffcanvasBody = ({ children }) => (
  <div className={styles.offcanvasBody}>
    {children}
  </div>
);

OffcanvasBody.propTypes = {
  children: PropTypes.node,
};

const StyledOffcanvas = ({
  show,
  onHide,
  placement = 'start',
  title,
  children,
  className = '',
  backdrop = true,
  keyboard = true,
  titleId = 'offcanvasTitle', // Default ID, can be overridden
  bodyId = 'offcanvasBody',   // Default ID, can be overridden
}) => {
  const offcanvasRef = useRef(null);
  const triggerRef = useRef(null); // To store the element that opened the offcanvas

  useEffect(() => {
    if (show) {
      triggerRef.current = document.activeElement; // Save focus
      offcanvasRef.current?.focus(); // Focus the offcanvas panel itself
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = '';
      triggerRef.current?.focus(); // Restore focus
    }
    return () => {
      document.body.style.overflow = ''; // Ensure cleanup
    };
  }, [show]);

  const handleKeyDown = useCallback(
    (event) => {
      if (keyboard && event.key === 'Escape' && show) {
        onHide();
      }
    },
    [keyboard, onHide, show]
  );

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, handleKeyDown]);

  const handleBackdropClick = () => {
    if (backdrop && show) {
      onHide();
    }
  };

  // Add a small delay for the exit animation before removing from DOM (optional)
  // For simplicity, we'll rely on CSS transitions on `show` class for now.
  // If `show` is false, the component won't render the panel, so transitions might need careful handling.
  // A common pattern is to have an internal state for "visible" that lags behind `show` for transitions.
  // For now, let's keep it simpler: the panel is either rendered or not.

  if (!show) {
    return null;
  }

  const placementClass = styles[`placement${placement.charAt(0).toUpperCase() + placement.slice(1)}`];

  return (
    <>
      {backdrop && <div className={`${styles.offcanvasBackdrop} ${show ? styles.show : ''}`} onClick={handleBackdropClick} />}
      <div
        ref={offcanvasRef}
        className={`${styles.offcanvasPanel} ${placementClass} ${show ? styles.show : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={bodyId} // Assuming body content is main description
        tabIndex={-1} // Make it focusable
      >
        {title && <OffcanvasHeader onClose={onHide} titleId={titleId}>{title}</OffcanvasHeader>}
        <OffcanvasBody>{children}</OffcanvasBody>
      </div>
    </>
  );
};

StyledOffcanvas.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  placement: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
  title: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  backdrop: PropTypes.bool,
  keyboard: PropTypes.bool,
  titleId: PropTypes.string,
  bodyId: PropTypes.string,
};

// Expose sub-components if needed, though they are simple enough to be internal
StyledOffcanvas.Header = OffcanvasHeader;
StyledOffcanvas.Body = OffcanvasBody;

export default StyledOffcanvas;
