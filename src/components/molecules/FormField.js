import React from 'react';
import { Form as BootstrapForm, InputGroup } from 'react-bootstrap';
import StyledFormLabel from '../atoms/StyledFormLabel';
import StyledFormControl from '../atoms/StyledFormControl';
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
  className, // Additional classes for the Form.Group
  style, // Inline styles for the Form.Group
  isInvalid, // For validation state
  feedback, // Validation feedback message
  feedbackType = 'invalid', // 'valid' or 'invalid'
  ...props // Spread any other props to the underlying control (e.g., required, disabled)
}) => {

  const renderControl = () => {
    const controlProps = {
      id: controlId,
      type: type === 'checkbox' || type === 'radio' ? undefined : type, // type not needed for check/radio
      placeholder,
      value,
      onChange,
      as: as === 'select' ? undefined : as, // as='select' is handled by StyledFormSelect
      rows,
      name,
      checked,
      defaultChecked,
      isInvalid,
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
        <InputGroup hasValidation>
          {inputGroupPrepend && <InputGroup.Text>{inputGroupPrepend}</InputGroup.Text>}
          {controlElement}
          {inputGroupAppend && <InputGroup.Text>{inputGroupAppend}</InputGroup.Text>}
          {feedback && <BootstrapForm.Control.Feedback type={feedbackType}>{feedback}</BootstrapForm.Control.Feedback>}
        </InputGroup>
      );
    }

    return (
      <>
        {controlElement}
        {feedback && !(inputGroupPrepend || inputGroupAppend) && <BootstrapForm.Control.Feedback type={feedbackType}>{feedback}</BootstrapForm.Control.Feedback>}
      </>
    );
  };

  // Don't render the external label for checkbox/radio as it's part of StyledFormCheck
  const showExternalLabel = type !== 'checkbox' && type !== 'radio';

  return (
    <BootstrapForm.Group className={className} controlId={controlId} style={style}>
      {showExternalLabel && label && <StyledFormLabel>{label}</StyledFormLabel>}
      {renderControl()}
    </BootstrapForm.Group>
  );
};

export default FormField;
