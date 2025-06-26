import React, { useId } from 'react'; // Add forwardRef
import styles from './StyledFormCheck.module.scss';

/**
 * Atom for a styled Form Check (checkbox, radio, switch).
 * Applies consistent styling from SCSS module.
 * Renders as a native HTML structure.
 */
const StyledFormCheck = React.forwardRef(( // Wrap with React.forwardRef
  {
    className = '',
    type = 'checkbox', // Default to checkbox if no type is provided
    label,
    id,
    isInvalid,
    feedback,
    feedbackType,
    ...props
  },
  ref // Add ref as the second argument
) => {
  const generatedId = useId(); // React hook for generating unique IDs
  const finalId = id || generatedId;

  const actualInputType = type === 'switch' ? 'checkbox' : type;

  let wrapperClass = styles.formCheck; // Default for checkbox
  if (type === 'radio') {
    wrapperClass = styles.formRadio; // Or could be styles.formCheck if styling is similar enough and input[type=radio] is targeted
  } else if (type === 'switch') {
    wrapperClass = styles.formSwitch;
  }

  return (
    <div className={`${wrapperClass} ${className}`.trim()}>
      <input
        type={actualInputType}
        id={finalId}
        className={styles.formCheckInput}
        ref={ref} // Apply the ref to the input element
        {...props} // Spread other props like name, value, checked, onChange, disabled, etc.
      />
      {label && ( // Render label only if provided
        <label htmlFor={finalId} className={styles.formCheckLabel}>
          {/* The span with styles.checkLabel can be kept if specific text styling within the label is needed,
              otherwise, the label text can be directly here. For consistency with original, keeping it. */}
          <span className={styles.checkLabel}>{label}</span>
        </label>
      )}
      {/*
        Feedback element for isInvalid/feedback props:
        This component is an "atom". Typically, FormField (a "molecule") would handle feedback display.
        If StyledFormCheck MUST display its own feedback, it would be:
        {props.isInvalid && props.feedback && (
          <div className={styles.invalidFeedback}>{props.feedback}</div> // Assuming SCSS for .invalidFeedback
        )}
      */}
    </div>
  );
});

export default StyledFormCheck;
