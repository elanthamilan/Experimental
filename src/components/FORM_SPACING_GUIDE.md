# Form Spacing Guide - Design System Implementation

This guide explains how to use the new form spacing system that implements consistent spacing according to our design system.

## 🎯 Overview

The form spacing system provides consistent, theme-aware spacing for all form elements using design system variables. It supports multiple spacing densities and is fully responsive.

## 📏 Spacing Scale

### Form Field Spacing
- `xs`: 8px (0.5rem) - Tight spacing for compact forms
- `sm`: 12px (0.75rem) - Small spacing for dense layouts
- `md`: 16px (1rem) - **Default** - Standard spacing for most forms
- `lg`: 24px (1.5rem) - Large spacing for spacious layouts
- `xl`: 32px (2rem) - Extra large spacing for emphasis

### Form Row Spacing
- `sm`: 16px (1rem) - Compact row spacing
- `md`: 24px (1.5rem) - **Default** - Standard row spacing
- `lg`: 32px (2rem) - Spacious row spacing

### Form Section Spacing
- `sm`: 24px (1.5rem) - Compact section spacing
- `md`: 32px (2rem) - **Default** - Standard section spacing
- `lg`: 40px (2.5rem) - Spacious section spacing

## 🧩 Components

### FormField
Enhanced with spacing control:

```jsx
import { FormField } from '../components';

// Default spacing (16px)
<FormField 
  label="Name" 
  type="text" 
/>

// Custom spacing
<FormField 
  label="Email" 
  type="email" 
  spacing="sm" // 12px spacing
/>

// Tight spacing for compact forms
<FormField 
  label="Phone" 
  type="tel" 
  spacing="xs" // 8px spacing
/>
```

### FormRow
For consistent spacing between form rows:

```jsx
import { FormRow, FormField } from '../components';

<FormRow spacing="md">
  <StyledCol md={6}>
    <FormField label="First Name" spacing="sm" />
  </StyledCol>
  <StyledCol md={6}>
    <FormField label="Last Name" spacing="sm" />
  </StyledCol>
</FormRow>
```

### FormSection
For consistent spacing between form sections:

```jsx
import { FormSection, FormField } from '../components';

<FormSection 
  title="Personal Information"
  description="Enter your personal details"
  spacing="md"
>
  <FormField label="Name" spacing="md" />
  <FormField label="Email" spacing="md" />
</FormSection>
```

## 🎨 Usage Patterns

### Standard Form Layout
```jsx
<FormSection title="Basic Information" spacing="md">
  <FormRow spacing="md">
    <StyledCol md={6}>
      <FormField label="First Name" spacing="sm" />
    </StyledCol>
    <StyledCol md={6}>
      <FormField label="Last Name" spacing="sm" />
    </StyledCol>
  </FormRow>
  
  <FormField label="Email" spacing="md" />
  <FormField label="Phone" spacing="md" />
</FormSection>
```

### Compact Form Layout
```jsx
<FormSection title="Quick Entry" spacing="sm">
  <FormRow spacing="sm">
    <StyledCol md={4}>
      <FormField label="Code" spacing="xs" />
    </StyledCol>
    <StyledCol md={8}>
      <FormField label="Description" spacing="xs" />
    </StyledCol>
  </FormRow>
</FormSection>
```

### Spacious Form Layout
```jsx
<FormSection title="Detailed Information" spacing="lg">
  <FormRow spacing="lg">
    <StyledCol md={12}>
      <FormField label="Description" as="textarea" spacing="lg" />
    </StyledCol>
  </FormRow>
  
  <FormField label="Additional Notes" as="textarea" spacing="xl" />
</FormSection>
```

## 🎛️ Theme Integration

All spacing values are theme-aware and can be customized:

```css
:root {
  --theme-form-field-spacing-md: 1.2rem; /* Custom spacing */
  --theme-form-row-spacing-md: 1.8rem;
  --theme-form-section-spacing-md: 2.4rem;
}
```

## 📱 Responsive Behavior

Spacing automatically adapts to different screen sizes while maintaining proportional relationships.

## ✅ Best Practices

1. **Use consistent spacing** within the same form section
2. **Start with defaults** (`md` spacing) and adjust as needed
3. **Use smaller spacing** (`xs`, `sm`) for compact forms or dense data entry
4. **Use larger spacing** (`lg`, `xl`) for important forms or better readability
5. **Group related fields** with FormRow and consistent spacing
6. **Separate sections** with FormSection for logical organization

## 🔄 Migration from Old System

### Before (Manual spacing)
```jsx
<FormField label="Name" className="mb-3" />
<FormField label="Email" className="mb-2" />
```

### After (Design system spacing)
```jsx
<FormField label="Name" spacing="md" />
<FormField label="Email" spacing="sm" />
```

This ensures consistent, theme-aware spacing that adapts to different themes and screen sizes.
