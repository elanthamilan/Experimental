import React, { useState } from 'react';
import StyledContainer from '../components/atoms/StyledContainer';
import StyledRow from '../components/atoms/StyledRow';
import StyledCol from '../components/atoms/StyledCol';
import StyledCard from '../components/atoms/StyledCard';
import StyledButton from '../components/atoms/StyledButton';
import StyledAlert from '../components/atoms/StyledAlert';
import FormField from '../components/molecules/FormField';
import FormRow from '../components/molecules/FormRow';
import FormSection from '../components/molecules/FormSection';
import ProgressiveForm from '../components/organisms/ProgressiveForm';
import useFormValidation from '../hooks/useFormValidation';

const FormBestPracticesPage = () => {
  const [activeDemo, setActiveDemo] = useState('basic');

  // Basic form validation rules
  const basicValidationRules = {
    firstName: {
      required: 'First name is required',
      minLength: 2
    },
    lastName: {
      required: 'Last name is required',
      minLength: 2
    },
    email: {
      required: 'Email is required',
      email: true
    },
    phone: {
      pattern: '^[\\d\\s\\-\\(\\)\\+]+$',
      patternMessage: 'Please enter a valid phone number'
    },
    password: {
      required: 'Password is required',
      minLength: 8,
      custom: (value) => {
        if (!value) return null;
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return null;
      }
    },
    confirmPassword: {
      required: 'Please confirm your password',
      custom: (value, values) => {
        if (value !== values.password) return 'Passwords do not match';
        return null;
      }
    }
  };

  const {
    handleSubmit,
    getFieldProps,
    resetForm
  } = useFormValidation({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    newsletter: false
  }, basicValidationRules);

  const handleFormSubmit = async (formData) => {
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  // Progressive form steps
  const progressiveSteps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      content: (
        <div>
          <FormRow spacing="md">
            <StyledCol md={6}>
              <FormField
                {...getFieldProps('firstName')}
                controlId="firstName"
                label="First Name"
                type="text"
                autoComplete="given-name"
                helpText="Enter your legal first name"
                placeholder="John"
              />
            </StyledCol>
            <StyledCol md={6}>
              <FormField
                {...getFieldProps('lastName')}
                controlId="lastName"
                label="Last Name"
                type="text"
                autoComplete="family-name"
                helpText="Enter your legal last name"
                placeholder="Doe"
              />
            </StyledCol>
          </FormRow>
          
          <FormField
            {...getFieldProps('email')}
            controlId="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            inputMode="email"
            helpText="We'll use this to send you important updates"
            placeholder="john.doe@example.com"
          />
        </div>
      ),
      validate: () => {
        return !getFieldProps('firstName').isInvalid && 
               !getFieldProps('lastName').isInvalid && 
               !getFieldProps('email').isInvalid;
      }
    },
    {
      title: 'Contact Details',
      description: 'How can we reach you?',
      content: (
        <div>
          <FormField
            {...getFieldProps('phone')}
            controlId="phone"
            label="Phone Number"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            helpText="Include country code if international"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      )
    },
    {
      title: 'Security',
      description: 'Create a secure password',
      content: (
        <div>
          <FormField
            {...getFieldProps('password')}
            controlId="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            helpText="Must be at least 8 characters with uppercase, lowercase, and number"
          />
          
          <FormField
            {...getFieldProps('confirmPassword')}
            controlId="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            helpText="Re-enter your password to confirm"
          />
        </div>
      ),
      validate: () => {
        return !getFieldProps('password').isInvalid && 
               !getFieldProps('confirmPassword').isInvalid;
      }
    }
  ];

  const renderBasicForm = () => (
    <FormSection 
      title="User Registration" 
      description="Create your account with proper validation and accessibility"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormRow spacing="md">
          <StyledCol md={6}>
            <FormField
              {...getFieldProps('firstName')}
              controlId="firstName"
              label="First Name"
              type="text"
              autoComplete="given-name"
              helpText="Enter your legal first name"
              placeholder="John"
            />
          </StyledCol>
          <StyledCol md={6}>
            <FormField
              {...getFieldProps('lastName')}
              controlId="lastName"
              label="Last Name"
              type="text"
              autoComplete="family-name"
              helpText="Enter your legal last name"
              placeholder="Doe"
            />
          </StyledCol>
        </FormRow>
        
        <FormField
          {...getFieldProps('email')}
          controlId="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          inputMode="email"
          helpText="We'll use this to send you important updates"
          placeholder="john.doe@example.com"
        />
        
        <FormField
          {...getFieldProps('phone')}
          controlId="phone"
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          helpText="Include country code if international (optional)"
          placeholder="+1 (555) 123-4567"
        />
        
        <FormRow spacing="md">
          <StyledCol md={6}>
            <FormField
              {...getFieldProps('password')}
              controlId="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              helpText="Must be at least 8 characters with uppercase, lowercase, and number"
            />
          </StyledCol>
          <StyledCol md={6}>
            <FormField
              {...getFieldProps('confirmPassword')}
              controlId="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              helpText="Re-enter your password to confirm"
            />
          </StyledCol>
        </FormRow>
        
        <FormField
          {...getFieldProps('newsletter')}
          controlId="newsletter"
          label="Subscribe to newsletter"
          type="checkbox"
          helpText="Receive updates about new features and promotions"
        />
        
        <div className="d-flex gap-3 mt-4">
          <StyledButton variant="secondary" type="button" onClick={resetForm}>
            Reset
          </StyledButton>
          <StyledButton variant="primary" type="submit">
            Create Account
          </StyledButton>
        </div>
      </form>
    </FormSection>
  );

  const renderProgressiveFormDemo = () => (
    <ProgressiveForm
      steps={progressiveSteps}
      onSubmit={handleFormSubmit}
      showProgressBar={true}
      showStepNumbers={true}
      allowStepNavigation={true}
      validateOnStepChange={true}
    />
  );

  return (
    <StyledContainer fluid className="py-4">
      <StyledRow>
        <StyledCol>
          <h1 className="mb-4">Form Best Practices Demo</h1>
          
          <StyledAlert variant="info" className="mb-4">
            <strong>Modern Form Implementation</strong><br />
            This page demonstrates current best practices for form design including accessibility, 
            validation patterns, progressive disclosure, and mobile-first design.
          </StyledAlert>
          
          {/* Demo Navigation */}
          <div className="mb-4">
            <StyledButton
              variant={activeDemo === 'basic' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveDemo('basic')}
              className="me-2"
            >
              Basic Form
            </StyledButton>
            <StyledButton
              variant={activeDemo === 'progressive' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveDemo('progressive')}
            >
              Progressive Form
            </StyledButton>
          </div>
          
          {/* Demo Content */}
          <StyledCard>
            <StyledCard.Body>
              {activeDemo === 'basic' && renderBasicForm()}
              {activeDemo === 'progressive' && renderProgressiveFormDemo()}
            </StyledCard.Body>
          </StyledCard>
          
          {/* Best Practices Summary */}
          <StyledCard className="mt-4">
            <StyledCard.Body>
              <StyledCard.Title>Implemented Best Practices</StyledCard.Title>
              <ul className="mb-0">
                <li><strong>Accessibility:</strong> ARIA labels, live regions, keyboard navigation</li>
                <li><strong>Validation:</strong> Just-in-time validation with clear error messages</li>
                <li><strong>Mobile-First:</strong> Appropriate input types and touch targets</li>
                <li><strong>Progressive Enhancement:</strong> Works without JavaScript</li>
                <li><strong>User Experience:</strong> Clear labels, help text, and forgiving formats</li>
                <li><strong>Design System:</strong> Consistent spacing and visual hierarchy</li>
              </ul>
            </StyledCard.Body>
          </StyledCard>
        </StyledCol>
      </StyledRow>
    </StyledContainer>
  );
};

export default FormBestPracticesPage;
