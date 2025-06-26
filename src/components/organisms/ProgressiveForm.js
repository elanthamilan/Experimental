import React, { useState, useEffect } from 'react';
import StyledButton from '../atoms/StyledButton';
import StyledProgressBar from '../atoms/StyledProgressBar';
import FormSection from '../molecules/FormSection';
import styles from './ProgressiveForm.module.scss';

/**
 * Progressive Form Component
 * Implements multi-step forms with progress indicators and accessibility
 */
const ProgressiveForm = ({
  steps = [],
  onSubmit,
  onStepChange,
  className,
  showProgressBar = true,
  showStepNumbers = true,
  allowStepNavigation = false,
  validateOnStepChange = true,
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [stepErrors, setStepErrors] = useState({});

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Announce step changes to screen readers
  useEffect(() => {
    const announcement = `Step ${currentStep + 1} of ${totalSteps}: ${steps[currentStep]?.title || 'Form step'}`;
    
    // Create a live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = announcement;
    
    document.body.appendChild(liveRegion);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, [currentStep, totalSteps, steps]);

  const validateCurrentStep = async () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.validate && typeof currentStepData.validate === 'function') {
      try {
        const isValid = await currentStepData.validate();
        if (!isValid) {
          setStepErrors(prev => ({
            ...prev,
            [currentStep]: 'Please fix the errors in this step before continuing'
          }));
          return false;
        } else {
          setStepErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[currentStep];
            return newErrors;
          });
        }
      } catch (error) {
        setStepErrors(prev => ({
          ...prev,
          [currentStep]: error.message || 'Validation error'
        }));
        return false;
      }
    }
    return true;
  };

  const goToStep = async (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= totalSteps) return;

    // Validate current step if moving forward
    if (stepIndex > currentStep && validateOnStepChange) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
    }

    // Mark current step as completed if moving forward
    if (stepIndex > currentStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }

    setCurrentStep(stepIndex);
    
    if (onStepChange) {
      onStepChange(stepIndex, steps[stepIndex]);
    }

    // Focus the step content for accessibility
    setTimeout(() => {
      const stepContent = document.querySelector(`[data-step="${stepIndex}"]`);
      if (stepContent) {
        stepContent.focus();
      }
    }, 100);
  };

  const handleNext = () => {
    goToStep(currentStep + 1);
  };

  const handlePrevious = () => {
    goToStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validate current step before submission
    if (validateOnStepChange) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
    }

    // Mark final step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (onSubmit) {
      await onSubmit();
    }
  };

  const renderStepIndicator = () => {
    if (!showStepNumbers) return null;

    return (
      <div className={styles.stepIndicator} role="tablist" aria-label="Form progress">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const hasError = stepErrors[index];
          const isClickable = allowStepNavigation && (isCompleted || index <= currentStep);

          return (
            <div
              key={index}
              className={`${styles.stepItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${hasError ? styles.error : ''}`}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
            >
              {isClickable ? (
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() => goToStep(index)}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                >
                  <span className={styles.stepNumber}>
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  <span className={styles.stepTitle}>{step.title}</span>
                </button>
              ) : (
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber}>
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  <span className={styles.stepTitle}>{step.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderProgressBar = () => {
    if (!showProgressBar) return null;

    return (
      <div className={styles.progressContainer}>
        <StyledProgressBar
          now={progressPercentage}
          label={`${Math.round(progressPercentage)}% complete`}
          className={styles.progressBar}
        />
        <div className={styles.progressText} aria-live="polite">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={`${styles.progressiveForm} ${className || ''}`} {...props}>
      {renderStepIndicator()}
      {renderProgressBar()}

      <FormSection
        title={currentStepData?.title}
        description={currentStepData?.description}
        className={styles.stepContent}
      >
        <div
          data-step={currentStep}
          tabIndex="-1"
          className={styles.stepBody}
          role="tabpanel"
          aria-labelledby={`step-${currentStep}-title`}
        >
          {/* Step error message */}
          {stepErrors[currentStep] && (
            <div 
              className={styles.stepError}
              role="alert"
              aria-live="assertive"
            >
              {stepErrors[currentStep]}
            </div>
          )}

          {/* Render step content */}
          {currentStepData?.content}
        </div>

        {/* Navigation buttons */}
        <div className={styles.stepNavigation}>
          <div className={styles.navigationLeft}>
            {!isFirstStep && (
              <StyledButton
                variant="secondary"
                onClick={handlePrevious}
                type="button"
              >
                Previous
              </StyledButton>
            )}
          </div>

          <div className={styles.navigationRight}>
            {isLastStep ? (
              <StyledButton
                variant="primary"
                onClick={handleSubmit}
                type="button"
              >
                Submit
              </StyledButton>
            ) : (
              <StyledButton
                variant="primary"
                onClick={handleNext}
                type="button"
              >
                Next
              </StyledButton>
            )}
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default ProgressiveForm;
