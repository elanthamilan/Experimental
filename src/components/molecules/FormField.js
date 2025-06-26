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
  const helpTextId = helpText ? `${controlId}-help` : null;
  const feedbackId = feedback ? `${controlId}-feedback` : null;

  // Build aria-describedby from multiple sources
  const describedByIds = [
    helpTextId,
    feedbackId,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  const renderControl = () => {
    const controlProps = {
      id: controlId,
      type: type === 'checkbox' || type === 'radio' ? undefined : type, // type not needed for check/radio
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      onInvalid,
      as: as === 'select' ? undefined : as, // as='select' is handled by StyledFormSelect
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
      // Label is handled differently for checks/radios
      return (
        <StyledFormCheck
          type={type}
          id={controlId}
          label={label} // Pass label directly to StyledFormCheck
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          isInvalid={isInvalid}
          feedback={feedback}
          feedbackType={feedbackType}
          {...props}
        />
      );
    } else {
       controlElement = <StyledFormControl {...controlProps} />;
    }

    // Wrap with InputGroup if needed
    if (inputGroupPrepend || inputGroupAppend) {
      return (
        <>
          <StyledInputGroup prepend={inputGroupPrepend} append={inputGroupAppend}>
            {controlElement}
          </StyledInputGroup>
          {/* Feedback for input groups is now outside */}
          {feedback && <StyledFormControlFeedback type={feedbackType}>{feedback}</StyledFormControlFeedback>}
        </>
      );
    }

    // For controls NOT in an input group
    return (
      <>
        {controlElement}
        {/* Feedback for non-grouped, non-check/radio controls */}
        {!(type === 'checkbox' || type === 'radio') && feedback && <StyledFormControlFeedback type={feedbackType}>{feedback}</StyledFormControlFeedback>}
      </>
    );
  };

  // Don't render the external label for checkbox/radio as it's part of StyledFormCheck
  const showExternalLabel = type !== 'checkbox' && type !== 'radio';

  return (
    <StyledFormGroup
      className={className}
      controlId={controlId}
      style={style}
      spacing={spacing}
    >
      {showExternalLabel && label && (
        <StyledFormLabel htmlFor={controlId}>
          {label}
          {required && <span aria-hidden="true" className="text-danger ms-1">*</span>}
        </StyledFormLabel>
      )}

      {/* Help text */}
      {helpText && (
        <div id={helpTextId} className="form-text text-muted small mb-2">
          {helpText}
        </div>
      )}

      {renderControl()}

      {/* Enhanced feedback with proper ID for aria-describedby */}
      {feedback && feedbackId && (
        <div
          id={feedbackId}
          className={`form-feedback ${feedbackType === 'valid' ? 'valid-feedback' : 'invalid-feedback'}`}
          role={feedbackType === 'invalid' ? 'alert' : undefined}
          aria-live={feedbackType === 'invalid' ? 'polite' : undefined}
        >
          {feedback}
        </div>
      )}
    </StyledFormGroup>
  );
};

export default FormField;
