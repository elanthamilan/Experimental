import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyledButton, StyledCard } from '../../components'; // Assuming StyledCard might be used for the menu
import styles from './StyledDropdown.module.scss';

const StyledDropdownItem = ({ children, onClick, href, disabled, className = '', ...props }) => {
  const commonProps = {
    role: 'menuitem',
    className: `${styles.item} ${className}`,
    disabled,
    ...props,
  };

  if (href && !disabled) {
    return (
      <a href={href} {...commonProps} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...commonProps} onClick={onClick}>
      {children}
    </button>
  );
};

const StyledDropdownDivider = ({ className = '' }) => (
  <div role="separator" aria-orientation="horizontal" className={`${styles.divider} ${className}`} />
);

const StyledDropdown = ({ trigger, children, className = '', menuClassName = '', onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef(null);
  const triggerRef = useRef(null); // Ref for the trigger element

  const toggleDropdown = useCallback(() => {
    setIsOpen(prevIsOpen => {
      const newIsOpen = !prevIsOpen;
      if (onOpenChange) {
        onOpenChange(newIsOpen);
      }
      return newIsOpen;
    });
  }, [onOpenChange]);

  const handleClickOutside = useCallback(
    (event) => {
      if (node.current && !node.current.contains(event.target)) {
        setIsOpen(false);
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    },
    [onOpenChange]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (isOpen) {
        if (event.key === 'Escape') {
          setIsOpen(false);
          if (onOpenChange) {
            onOpenChange(false);
          }
          triggerRef.current?.focus(); // Return focus to trigger
        } else if (event.key === 'Tab') {
          // Basic tab trapping, could be more complex for full accessibility
          const focusableElements = node.current?.querySelectorAll(
            'a[href], button:not([disabled]), input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      }
    },
    [isOpen, onOpenChange]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  // Assign a unique ID to the trigger for aria-labelledby
  const triggerId = trigger.props.id || `dropdown-trigger-${React.useId()}`;

  return (
    <div ref={node} className={`${styles.dropdown} ${className}`}>
      {React.cloneElement(trigger, {
        ref: triggerRef,
        id: triggerId,
        onClick: (e) => {
          toggleDropdown();
          if (trigger.props.onClick) trigger.props.onClick(e); // Call original onClick if it exists
        },
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu', // Changed from true to 'menu' for better semantics
        'aria-controls': isOpen ? `${triggerId}-menu` : undefined,
      })}
      {isOpen && (
        <div
          id={`${triggerId}-menu`}
          className={`${styles.menu} ${menuClassName}`}
          role="menu"
          aria-labelledby={triggerId}
          tabIndex={-1} // To allow programmatic focus on menu if needed
        >
          {/* Using StyledCard for menu appearance, can be customized */}
          <StyledCard className={styles.menuCard}>
            {React.Children.map(children, child => {
              if (child && child.type === StyledDropdownItem && child.props.autoFocus) {
                 return React.cloneElement(child, { ref: (el) => el && el.focus() });
              }
              return child;
            })}
          </StyledCard>
        </div>
      )}
    </div>
  );
};

StyledDropdown.Item = StyledDropdownItem;
StyledDropdown.Divider = StyledDropdownDivider;

export default StyledDropdown;
