import React from 'react';
// import { Form as BootstrapForm, InputGroup } from 'react-bootstrap'; // Removed
import StyledFormLabel from '../atoms/StyledFormLabel';
import StyledFormControl from '../atoms/StyledFormControl';
import StyledFormGroup from '../atoms/StyledFormGroup'; // Added
import StyledInputGroup from '../atoms/StyledInputGroup'; // Added
import StyledFormControlFeedback from '../atoms/StyledFormControlFeedback'; // Added
import StyledFormSelect from '../atoms/StyledFormSelect';
import StyledFormCheck from '../atoms/StyledFormCheck';

/**
 * A molecule component that combines a label and a form control.
 * It supports text inputs, textareas, selects, checkboxes, and radio buttons.
 */
const FormField = ({
  controlId,
  label,
  type = 'text', // text, textarea, select, checkbox, radio, number, email, password, file, etc.
  placeholder,
  value,
  onChange,
  as, // Use 'textarea' for textarea, 'select' for select
  rows, // For textarea
  options, // For select [{value: 'val', label: 'Label'}, ...]
  name, // For radio buttons
  checked, // For checkbox/radio
  defaultChecked, // For checkbox/radio
  inputGroupPrepend, // Text/element to prepend in an InputGroup
  inputGroupAppend, // Text/element to append in an InputGroup
  className, // Additional classes for the StyledFormGroup
  style, // Inline styles for the StyledFormGroup
  isInvalid, // For validation state
  feedback, // Validation feedback message
  feedbackType = 'invalid', // 'valid' or 'invalid'
  spacing = 'md', // xs, sm, md, lg, xl - controls spacing between form fields

  // Enhanced accessibility and validation props
  required = false, // Use aria-required instead of HTML required
  helpText, // Additional help text (aria-describedby)
  autoComplete, // HTML autocomplete attribute
  pattern, // HTML pattern for validation
  minLength, // Minimum length
  maxLength, // Maximum length
  min, // Minimum value for numbers/dates
  max, // Maximum value for numbers/dates
  step, // Step for number inputs
  inputMode, // Input mode for mobile keyboards
  autoFocus = false, // Auto focus on mount
  onBlur, // Blur event handler
  onFocus, // Focus event handler
  onInvalid, // Invalid event handler
  'aria-label': ariaLabel, // Custom aria-label
  'aria-labelledby': ariaLabelledBy, // Custom aria-labelledby
  'aria-describedby': ariaDescribedBy, // Custom aria-describedby

  ...props // Spread any other props to the underlying control (e.g., disabled)
}) => {
  // Generate unique IDs for accessibility
  const baseControlId = controlId || React.useId(); // Ensure controlId is always present
  const helpTextId = helpText ? `${baseControlId}-help` : undefined;
  const feedbackMessageId = feedback ? `${baseControlId}-feedback` : undefined;

  // Build aria-describedby from multiple sources
  const describedByIds = [
    helpTextId,
    feedbackMessageId, // This ID will be on the StyledFormControlFeedback
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  const controlProps = {
    id: baseControlId, // Use baseControlId for the input itself
    type: (type === 'checkbox' || type === 'radio' || as === 'select') ? undefined : type,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    onInvalid,
    as: (as === 'select' || type === 'checkbox' || type === 'radio') ? undefined : as,
    rows,
    name,
    checked,
    defaultChecked,
    isInvalid,
    autoComplete,
    pattern,
    minLength,
    maxLength,
    min,
    max,
    step,
    inputMode,
    autoFocus,
    'aria-required': required || undefined,
    'aria-invalid': isInvalid || undefined,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': describedByIds,
    ...props,
  };

  let controlElement;

  if (as === 'select') {
    controlElement = (
      <StyledFormSelect {...controlProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options && options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledFormSelect>
    );
  } else if (type === 'checkbox' || type === 'radio') {
    // For checkbox/radio, StyledFormCheck handles its own label and feedback association internally if needed
    // The main FormField label is still useful for grouping, but StyledFormCheck's label is the direct one.
    // We pass necessary aria attributes if they are not meant for the check/radio's own label.
    controlElement = (
      <StyledFormCheck
        type={type}
        id={baseControlId}
        label={label} // StyledFormCheck will create its own label element
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        isInvalid={isInvalid}
        // Feedback for StyledFormCheck is usually handled by its own structure or a wrapping error message.
        // For simplicity, FormField's main feedback will describe it.
        aria-describedby={describedByIds} // Allow FormField's help/error text to describe it
        aria-required={required || undefined}
        aria-invalid={isInvalid || undefined}
        // aria-label and aria-labelledby would typically be for the StyledFormCheck's own label if it's visually hidden
        ...(props || {})
      />
    );
  } else {
     controlElement = <StyledFormControl {...controlProps} />;
  }

  // Wrap with InputGroup if needed
  if (inputGroupPrepend || inputGroupAppend) {
    controlElement = (
      <StyledInputGroup prepend={inputGroupPrepend} append={inputGroupAppend}>
        {controlElement}
      </StyledInputGroup>
    );
  }

  // Don't render the external FormField label for checkbox/radio if StyledFormCheck handles its own label
  const showExternalFieldLabel = (type !== 'checkbox' && type !== 'radio') && label;

  return (
    <StyledFormGroup
      className={className}
      controlId={baseControlId} // StyledFormGroup might use this for its own purposes
      style={style}
      spacing={spacing}
    >
      {showExternalFieldLabel && (
        <StyledFormLabel htmlFor={baseControlId}>
          {label}
          {required && <span aria-hidden="true" className="text-danger ms-1">*</span>}
        </StyledFormLabel>
      )}

      {helpText && (
        <div id={helpTextId} className="form-text text-muted small mb-1 mt-1"> {/* Adjusted margins */}
          {helpText}
        </div>
      )}

      {controlElement}

      {feedback && feedbackMessageId && (
        <StyledFormControlFeedback
          id={feedbackMessageId}
          type={feedbackType}
          // Pass ARIA roles for assertive feedback if invalid
          role={isInvalid && feedbackType === 'invalid' ? 'alert' : undefined}
          aria-live={isInvalid && feedbackType === 'invalid' ? 'polite' : undefined}
          className="mt-1" // Add some top margin
        >
          {feedback}
        </StyledFormControlFeedback>
      )}
    </StyledFormGroup>
  );
};

export default FormField;
