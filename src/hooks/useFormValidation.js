import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for form validation with accessibility support
 * Implements modern validation patterns with proper error handling
 */
const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  // Ref to track if we should show inline validation
  const showInlineValidation = useRef(false);

  // Validation function
  const validateField = useCallback((name, value, rules = validationRules[name]) => {
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.required === true 
        ? `${name} is required` 
        : rules.required;
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }

    // Email validation
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Pattern validation
    if (rules.pattern && value) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        return rules.patternMessage || 'Invalid format';
      }
    }

    // Custom validation function
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, values);
    }

    return null;
  }, [validationRules, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  // Handle field change
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Inline validation after submit attempt or if field was touched
    if (submitAttempted || touched[name] || showInlineValidation.current) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField, submitAttempted, touched]);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const { name, value } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Show validation error on blur if field has been modified
    if (value !== initialValues[name]) {
      showInlineValidation.current = true;
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField, initialValues]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return async (event) => {
      event.preventDefault();
      setSubmitAttempted(true);
      setIsSubmitting(true);

      const isValid = validateForm();

      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      } else {
        // Focus first invalid field for accessibility
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField);
          if (element) {
            element.focus();
          }
        }
      }

      setIsSubmitting(false);
    };
  }, [validateForm, values, errors]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitAttempted(false);
    showInlineValidation.current = false;
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Get field props for easy integration with FormField
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    isInvalid: !!(errors[name] && (touched[name] || submitAttempted)),
    feedback: errors[name] && (touched[name] || submitAttempted) ? errors[name] : undefined,
    required: validationRules[name]?.required || false,
  }), [values, handleChange, handleBlur, errors, touched, submitAttempted, validationRules]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitAttempted,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    getFieldProps,
    isValid: Object.keys(errors).length === 0,
  };
};

export default useFormValidation;
