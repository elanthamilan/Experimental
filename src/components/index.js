/**
 * Centralized Design System Component Library
 *
 * This file exports all reusable components following atomic design principles.
 * Import components from this file to ensure consistency across the application.
 *
 * Usage:
 * import { StyledButton, StyledCard, FormField } from '../components';
 */

// ===== ATOMS =====
// Basic building blocks of the design system

// Form Components
export { default as StyledButton } from './atoms/StyledButton';
export { default as StyledFormControl } from './atoms/StyledFormControl';
export { default as StyledFormSelect } from './atoms/StyledFormSelect';
export { default as StyledFormLabel } from './atoms/StyledFormLabel';
export { default as StyledFormCheck } from './atoms/StyledFormCheck';
export { default as StyledFormGroup } from './atoms/StyledFormGroup';
export { default as StyledInputGroup } from './atoms/StyledInputGroup';
// StyledInputGroupText is not created as a separate component.
export { default as StyledFormControlFeedback } from './atoms/StyledFormControlFeedback';

// Layout Components
export { default as StyledCard } from './atoms/StyledCard';
export { default as StyledTable } from './atoms/StyledTable';
export { default as StyledContainer } from './atoms/StyledContainer';
export { default as StyledRow } from './atoms/StyledRow';
export { default as StyledCol } from './atoms/StyledCol';

// Display Components
export { default as StyledBadge } from './atoms/StyledBadge';
export { default as StyledPagination } from './atoms/StyledPagination';
export { default as StyledListGroup } from './atoms/StyledListGroup';
export { default as StyledListGroupItem } from './atoms/StyledListGroupItem';
export { default as StyledAlert } from './atoms/StyledAlert';
export { default as StyledImage } from './atoms/StyledImage';

// ===== MOLECULES =====
// Combinations of atoms that function together as a unit

// Form Molecules
export { default as FormField } from './molecules/FormField';
export { default as SearchInput } from './molecules/SearchInput';
export { default as FileUploadDropzone } from './molecules/FileUploadDropzone';

// Display Molecules
export { default as StatsCard } from './molecules/StatsCard';
export { default as StyledDropdown } from './molecules/StyledDropdown';
export { default as StyledOffcanvas } from './molecules/StyledOffcanvas';
export { default as StyledBreadcrumb } from './molecules/StyledBreadcrumb'; // Added StyledBreadcrumb
// export { default as ThemeDrawer } from './molecules/ThemeDrawer'; // Removed as unused
// export { default as Toolbar } from './molecules/Toolbar'; // Removed as unused
// export { default as ProductTableRow } from './molecules/ProductTableRow'; // Removed as unused
export { default as ListControlsToolbar } from './molecules/ListControlsToolbar'; // Added ListControlsToolbar

// ===== ORGANISMS =====
// Complex components made of molecules and atoms

// Navigation
export { default as LeftSidebar } from './organisms/LeftSidebar';

// Data Display
export { default as ResultsTable } from './organisms/ResultsTable';
export { default as SummaryStats } from './organisms/SummaryStats';

// Forms
export { default as AddEditForm } from './organisms/AddEditForm';
// export { default as DataInputForm } from './molecules/DataInputForm'; // Removed as unused
export { default as SearchCriteria } from './organisms/SearchCriteria';

// ===== DESIGN TOKENS =====
// Export design tokens and utilities

export const designTokens = {
  // Colors
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  // Typography
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Border radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    pill: '50rem',
    circle: '50%',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },

  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};

// ===== COMPONENT VARIANTS =====
// Standardized component variants

export const componentVariants = {
  button: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary', 'link'],
  card: ['default', 'stats', 'elevated', 'bordered'],
  table: ['default', 'striped', 'bordered', 'hover', 'compact'],
  badge: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
  container: ['default', 'fluid', 'page', 'section'],
  formField: ['text', 'email', 'password', 'number', 'select', 'textarea', 'checkbox', 'radio'],
};

// ===== UTILITY FUNCTIONS =====
// Helper functions for consistent styling

export const utils = {
  // Generate consistent class names
  cn: (...classes) => classes.filter(Boolean).join(' '),

  // Get design token value
  getToken: (category, key) => designTokens[category]?.[key],

  // Responsive helper
  responsive: (base, breakpoints = {}) => ({
    base,
    ...breakpoints,
  }),
};

// ===== COMPONENT COMPOSITION HELPERS =====
// Helpers for building complex components

export const compositions = {
  // Note: These are helper functions that can be used to create consistent layouts
  // They should be used by importing the required components directly in your pages

  // Example usage:
  // import { StyledContainer } from '../components';
  // const MyPage = () => (
  //   <StyledContainer variant="page">
  //     <h1>Page Title</h1>
  //     {content}
  //   </StyledContainer>
  // );
};

// ===== LAYOUT PATTERNS =====
// Common layout patterns for consistent page structure

export const layoutPatterns = {
  pageLayout: {
    container: { variant: "page", spacing: "lg" },
    header: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }
    }
  },

  sectionLayout: {
    container: { variant: "section", spacing: "md" },
    header: { style: { marginBottom: '1.5rem' } }
  }
};
