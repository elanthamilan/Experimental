# Design System Component Library

This directory contains a comprehensive, centralized design system following atomic design principles. All components are reusable, consistent, and follow established design patterns.

## 🏗️ Architecture

### Atomic Design Structure

```
src/components/
├── atoms/           # Basic building blocks
├── molecules/       # Combinations of atoms
├── organisms/       # Complex components
├── index.js         # Centralized exports
└── README.md        # This file
```

## 🔧 Usage

### Import from Central Index

**✅ Recommended:**
```javascript
import { StyledButton, StyledCard, FormField } from '../components';
```

**❌ Avoid:**
```javascript
import StyledButton from '../components/atoms/StyledButton';
import StyledCard from '../components/atoms/StyledCard';
```

### Component Categories

#### 🧱 Atoms (Basic Building Blocks)

| Component | Purpose | Variants |
|-----------|---------|----------|
| `StyledButton` | Consistent button styling | primary, secondary, success, danger, warning, info, light, dark, outline-* |
| `StyledCard` | Container component | default, stats, elevated, bordered |
| `StyledTable` | Data display | default, striped, bordered, hover, compact |
| `StyledBadge` | Status indicators | primary, secondary, success, danger, warning, info, light, dark |
| `StyledContainer` | Layout wrapper | default, fluid, page, section |
| `StyledFormControl` | Input fields | text, email, password, number, etc. |
| `StyledFormSelect` | Dropdown selects | - |
| `StyledFormLabel` | Form labels | - |
| `StyledFormCheck` | Checkboxes/radios | checkbox, radio |

#### 🧩 Molecules (Component Combinations)

| Component | Purpose | Use Case |
|-----------|---------|----------|
| `FormField` | Complete form field | Combines label + input + validation |
| `SearchInput` | Search functionality | Tables, filters, global search |
| `StatsCard` | Statistical display | Dashboards, metrics |
| `FileUploadDropzone` | File uploads | Forms, media management |

#### 🏢 Organisms (Complex Components)

| Component | Purpose | Features |
|-----------|---------|----------|
| `LeftSidebar` | Navigation | Multi-level menus, search, responsive |
| `ResultsTable` | Data tables | Pagination, sorting, filtering, actions |
| `SummaryStats` | Dashboard stats | Multiple stat cards in grid |
| `AddEditForm` | Form pages | Multi-section forms with validation |

## 🎨 Design Tokens

### Colors
```javascript
import { designTokens } from '../components';

const primaryColor = designTokens.colors.primary; // #007bff
```

### Spacing
```javascript
const spacing = designTokens.spacing.md; // 1rem
```

### Typography
```javascript
const fontSize = designTokens.typography.fontSizes.lg; // 1.25rem
```

## 📋 Component Standards

### Props Conventions

1. **Variant System**: All components use consistent variant names
2. **Size System**: `sm`, `md`, `lg` for sizing
3. **ClassName Support**: All components accept additional CSS classes
4. **Forwarded Props**: Unused props are forwarded to underlying components

### Example Component Usage

```javascript
// Basic usage
<StyledButton variant="primary" size="lg">
  Click Me
</StyledButton>

// With additional props
<StyledButton 
  variant="success" 
  size="sm"
  disabled
  onClick={handleClick}
  className="my-custom-class"
>
  Save
</StyledButton>

// Form field with validation
<FormField
  controlId="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  error={emailError}
  required
/>
```

## 🔄 Migration Guide

### From React Bootstrap to Design System

**Before:**
```javascript
import { Button, Card, Form } from 'react-bootstrap';

<Button variant="primary">Click</Button>
<Card>
  <Card.Body>Content</Card.Body>
</Card>
<Form.Group>
  <Form.Label>Label</Form.Label>
  <Form.Control type="text" />
</Form.Group>
```

**After:**
```javascript
import { StyledButton, StyledCard, FormField } from '../components';

<StyledButton variant="primary">Click</StyledButton>
<StyledCard>Content</StyledCard>
<FormField 
  label="Label" 
  type="text" 
/>
```

## 🎯 Benefits

### Consistency
- Unified design language across the application
- Standardized component behavior and styling
- Consistent prop interfaces

### Maintainability
- Centralized component logic
- Easy to update styling globally
- Single source of truth for components

### Developer Experience
- Autocomplete and TypeScript support
- Clear component documentation
- Reduced decision fatigue

### Performance
- Optimized component rendering
- Consistent bundle splitting
- Reduced CSS duplication

## 🚀 Best Practices

### 1. Always Use the Design System
```javascript
// ✅ Good
import { StyledButton } from '../components';

// ❌ Avoid
import { Button } from 'react-bootstrap';
```

### 2. Extend, Don't Override
```javascript
// ✅ Good - Extend with additional classes
<StyledButton className="my-special-button" variant="primary">
  Click
</StyledButton>

// ❌ Avoid - Overriding core styles
<StyledButton style={{backgroundColor: 'red'}} variant="primary">
  Click
</StyledButton>
```

### 3. Use Semantic Variants
```javascript
// ✅ Good - Semantic meaning
<StyledBadge variant="success">Active</StyledBadge>
<StyledBadge variant="danger">Inactive</StyledBadge>

// ❌ Avoid - Color-only meaning
<StyledBadge variant="green">Active</StyledBadge>
```

### 4. Compose Complex Components
```javascript
// ✅ Good - Use molecules for common patterns
<FormField 
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
/>

// ❌ Avoid - Rebuilding common patterns
<StyledFormLabel>Email</StyledFormLabel>
<StyledFormControl type="email" value={email} onChange={setEmail} />
{emailError && <div className="error">{emailError}</div>}
```

## 📚 Resources

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Design System Principles](https://designsystemsrepo.com/design-systems/)
- [Component API Documentation](./index.js)

## 🔄 Contributing

When adding new components:

1. Follow atomic design principles
2. Add to appropriate directory (atoms/molecules/organisms)
3. Export from `index.js`
4. Include comprehensive prop documentation
5. Support design tokens and variants
6. Add to this README
