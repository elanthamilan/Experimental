import React, { useState, useEffect, createContext, useContext } from 'react';
import { themes, applyTheme, defaultSpacingValues } from './themes'; // Import defaultSpacingValues

import LeftSidebar from './components/organisms/LeftSidebar';
import AddEditForm from './components/organisms/AddEditForm';
// React Bootstrap components removed: Offcanvas, OverlayTrigger, Tooltip, Dropdown
import StyledButton from './components/atoms/StyledButton';
import StyledOffcanvas from './components/molecules/StyledOffcanvas';
import StyledDropdown from './components/molecules/StyledDropdown';
import { Routes, Route } from 'react-router-dom';

// Import SIS Page Placeholders
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/admin/StudentListPage';
import AddEditStudentPage from './pages/admin/AddEditStudentPage';
import StaffListPage from './pages/admin/StaffListPage';
import AddEditStaffPage from './pages/admin/AddEditStaffPage';
import CourseListPage from './pages/academic/CourseListPage';
import AddEditCoursePage from './pages/academic/AddEditCoursePage';
import GradebookPage from './pages/academic/GradebookPage';
// Removed unused imports: AdmissionsPage, BillingPage, ReportsPage, UserProfilePage
// Faculty Management Page Imports
import FacultyListPage from './pages/admin/FacultyListPage';
import AddEditFacultyPage from './pages/admin/AddEditFacultyPage';
import FacultyProfilePage from './pages/user/FacultyProfilePage';
// Program Management Page Imports
import ProgramListPage from './pages/admin/ProgramListPage';
import AddEditProgramPage from './pages/admin/AddEditProgramPage';
// Semester Management Page Imports
import SemesterListPage from './pages/admin/SemesterListPage';
import AddEditSemesterPage from './pages/admin/AddEditSemesterPage';
// Department Management Page Imports
import DepartmentListPage from './pages/admin/DepartmentListPage';
import AddEditDepartmentPage from './pages/admin/AddEditDepartmentPage';
// Financial Year Management Page Imports
import FinancialYearListPage from './pages/admin/FinancialYearListPage';
import AddEditFinancialYearPage from './pages/admin/AddEditFinancialYearPage';
// Application Form Field Management Page Imports
import AppFormFieldListPage from './pages/admin/AppFormFieldListPage';
import AddEditAppFormFieldPage from './pages/admin/AddEditAppFormFieldPage';
// Application Submission Tracking Page Imports
import ApplicationListPage from './pages/admissions/ApplicationListPage';
import ViewApplicationPage from './pages/admissions/ViewApplicationPage';
// Organizational Hierarchy Management Page Imports
import OrgHierarchyPage from './pages/admin/OrgHierarchyPage';
import AddEditOrgHierarchyNodePage from './pages/admin/AddEditOrgHierarchyNodePage';
// Examination Schedule Management Page Imports
import ExamScheduleListPage from './pages/academic/ExamScheduleListPage';
import AddEditExamSchedulePage from './pages/academic/AddEditExamSchedulePage';
// Course Detail Page Import
import CourseDetailPage from './pages/academic/CourseDetailPage';
// Attendance Page Import
import AttendancePage from './pages/academic/AttendancePage';
// Component Preview Page Import
import ComponentPreviewPage from './pages/ComponentPreviewPage';
// Settings Page Import
import SettingsPage from './pages/SettingsPage';
// Sub-Institution Management Page Imports
import SubInstitutionListPage from './pages/admin/SubInstitutionListPage';
import AddEditSubInstitutionPage from './pages/admin/AddEditSubInstitutionPage';
import { fontWeightOptions } from './data/fonts'; // Import fontWeightOptions
import { fontSizeOptions } from './themes'; // Import fontSizeOptions from themes
import { Link } from 'react-router-dom';

import styles from './App.module.scss';
import './App.css';

// Create Theme Context
const ThemeContext = createContext();
export { ThemeContext }; // Export ThemeContext for use in other components
// Updated useTheme to include role management - this export might be better placed where ThemeContext is defined if it were in a separate file.
export const useTheme = () => useContext(ThemeContext);

// User Roles
const USER_ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

// Custom hook to detect clicks outside an element - No longer needed for theme modal
// function useOutsideAlerter(ref, callback) {
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         callback();
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [ref, callback]);
// }

const UtilitySidebar = () => {
  // const [showUserDropdown, setShowUserDropdown] = useState(false); // StyledDropdown manages its own state
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const {
    setTheme,
    isDarkMode,
    setIsDarkMode,
    headerFontSize,
    setHeaderFontSize,
    setBodyFontSize
  } = useContext(ThemeContext);

  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    role: 'Administrator'
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleThemeChange = () => {
    const availableThemes = themes.slice(0, 6);
    const nextIndex = (currentThemeIndex + 1) % availableThemes.length;
    setCurrentThemeIndex(nextIndex);
    setTheme(availableThemes[nextIndex].id);
  };

  const handleFontSizeChange = () => {
    const currentHeaderIndex = fontSizeOptions.findIndex(option => option.value === headerFontSize);
    const startIndex = currentHeaderIndex === -1 ? 0 : currentHeaderIndex;
    const nextIndex = (startIndex + 1) % fontSizeOptions.length;
    setHeaderFontSize(fontSizeOptions[nextIndex].value);
    setBodyFontSize(fontSizeOptions[nextIndex].value);
  };

  // renderTooltip function removed

  return (
    <div className={styles.utilitySidebar}>
      {/* Tooltips now use data-tooltip and CSS classes from App.module.scss */}
      <div className={`${styles.squareIconButton} ${styles.tooltipLeft}`} data-tooltip="Apps">
        <span className="material-symbols-outlined">apps</span>
      </div>

      <hr className={styles.divider} />

      <div
        className={`${styles.circleIconButton} ${styles.tooltipLeft}`}
        data-tooltip="Cycle Themes"
        onClick={handleThemeChange}
      >
        <span className="material-symbols-outlined">palette</span>
      </div>

      <div
        className={`${styles.circleIconButton} ${styles.tooltipLeft}`}
        data-tooltip="Cycle Font Size"
        onClick={handleFontSizeChange}
      >
        <span className="material-symbols-outlined">text_fields</span>
      </div>

      <div
        className={`${styles.circleIconButton} ${styles.tooltipLeft}`}
        data-tooltip="Toggle Dark Mode"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        <span className="material-symbols-outlined">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </div>

      <Link to="/settings" className={`${styles.circleIconButton} ${styles.tooltipLeft}`} data-tooltip="Settings">
        <span className="material-symbols-outlined">settings</span>
      </Link>

      {/* User Profile Dropdown with StyledDropdown */}
      <StyledDropdown
        className={`${styles.userDropdownContainer} ${styles.tooltipLeft}`} // Added tooltipLeft for consistency if trigger needs it
        trigger={
          <div
            className={`${styles.circleIconButton} ${styles.tooltipLeft}`} // Apply tooltip to the trigger div
            data-tooltip="User Profile"
            // aria-expanded and aria-haspopup are handled by StyledDropdown on the trigger clone
          >
            <span className="material-symbols-outlined">account_circle</span>
          </div>
        }
        menuClassName={styles.utilityDropdownMenu} // Apply custom class for positioning if needed
      >
        <div className={styles.dropdownHeader}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <span className="material-symbols-outlined">account_circle</span>
              )}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{currentUser.name}</div>
              <div className={styles.userRole}>{currentUser.role}</div>
              <div className={styles.userEmail}>{currentUser.email}</div>
            </div>
          </div>
        </div>

        <StyledDropdown.Divider className={styles.dropdownDivider} />

        <StyledDropdown.Item as={Link} to="/profile" className={styles.dropdownItem}>
          <span className="material-symbols-outlined">account_circle</span>
          User Profile
        </StyledDropdown.Item>

        <StyledDropdown.Item as={Link} to="/settings" className={styles.dropdownItem}>
          <span className="material-symbols-outlined">settings</span>
          Settings
        </StyledDropdown.Item>

        <StyledDropdown.Divider className={styles.dropdownDivider} />

        <StyledDropdown.Item
          onClick={handleLogout}
          className={`${styles.dropdownItem} ${styles.logoutItem}`}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </StyledDropdown.Item>
      </StyledDropdown>

      <hr className={styles.divider} />

      <div className={`${styles.circleIconButton} ${styles.tooltipLeft}`} data-tooltip="Calendar">
         <span className="material-symbols-outlined">calendar_today</span>
      </div>
      <div className={`${styles.circleIconButton} ${styles.tooltipLeft}`} data-tooltip="Tasks">
         <span className="material-symbols-outlined">task_alt</span>
      </div>
      <div className={`${styles.circleIconButton} ${styles.tooltipLeft}`} data-tooltip="Notifications">
         <span className="material-symbols-outlined">notifications</span>
      </div>
    </div>
  );
}

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

function App() {
  const width = useWindowWidth();
  const isMobile = width < 992;
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themes[0].id);
  const [globalFontWeight, setGlobalFontWeight] = useState(fontWeightOptions[1].value); // Default to 'normal'
  const [currentUserRole, setCurrentUserRole] = useState(USER_ROLES.ADMIN); // Default role
  const [isDarkMode, setIsDarkMode] = useState(false); // Added isDarkMode state
  const [savedCustomThemes, setSavedCustomThemes] = useState([]); // Custom themes storage

  // Font customization states
  const [headerFontSize, setHeaderFontSize] = useState('xl');
  const [bodyFontSize, setBodyFontSize] = useState('base');
  const [headerFontWeight, setHeaderFontWeight] = useState('semibold');
  const [bodyFontWeight, setBodyFontWeight] = useState('normal');

  // New theme states for advanced white labeling
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [baseBorderRadius, setBaseBorderRadius] = useState('8px'); // Store as string with 'px' or handle conversion
  const [inputBorderRadius, setInputBorderRadius] = useState('4px'); // Store as string with 'px'
  const [cardHeaderBg, setCardHeaderBg] = useState(''); 
  const [cardHeaderText, setCardHeaderText] = useState(''); 
  const [tableHeaderText, setTableHeaderText] = useState(''); 
  const [uiDensity, setUiDensity] = useState('default'); 

  // New direct color override states
  const [secondaryBtnBg, setSecondaryBtnBg] = useState('');
  const [secondaryBtnText, setSecondaryBtnText] = useState('');
  const [inputFocusBorder, setInputFocusBorder] = useState('');
  const [navActiveItemBg, setNavActiveItemBg] = useState('');
  const [navActiveItemText, setNavActiveItemText] = useState('');

  // Typography states
  const [pageTitleSize, setPageTitleSize] = useState('2.5rem');
  const [pageTitleWeight, setPageTitleWeight] = useState('700');
  const [buttonTextSize, setButtonTextSize] = useState('0.875rem');
  const [buttonTextWeight, setButtonTextWeight] = useState('600');
  const [inputTextSize, setInputTextSize] = useState('0.875rem');
  const [inputTextWeight, setInputTextWeight] = useState('400');

  useEffect(() => {
    applyTheme(currentTheme, isDarkMode); // Applies base theme colors and derived values

    // Apply direct overrides if they exist
    if (secondaryBtnBg) document.documentElement.style.setProperty('--theme-button-secondary-bg-direct', secondaryBtnBg);
    else document.documentElement.style.removeProperty('--theme-button-secondary-bg-direct'); // Allow fallback to derived

    if (secondaryBtnText) document.documentElement.style.setProperty('--theme-button-secondary-text-direct', secondaryBtnText);
    else document.documentElement.style.removeProperty('--theme-button-secondary-text-direct');

    if (inputFocusBorder) document.documentElement.style.setProperty('--theme-input-focus-border-direct', inputFocusBorder);
    else document.documentElement.style.removeProperty('--theme-input-focus-border-direct');
    
    if (navActiveItemBg) document.documentElement.style.setProperty('--theme-nav-active-item-bg-direct', navActiveItemBg);
    else document.documentElement.style.removeProperty('--theme-nav-active-item-bg-direct');

    if (navActiveItemText) document.documentElement.style.setProperty('--theme-nav-active-item-text-direct', navActiveItemText);
    else document.documentElement.style.removeProperty('--theme-nav-active-item-text-direct');

    // Apply border radii directly
    if (baseBorderRadius.match(/^\d+px$/) || baseBorderRadius.match(/^\d+rem$/) || baseBorderRadius.match(/^\d+em$/) || baseBorderRadius === '0') {
      document.documentElement.style.setProperty('--theme-border-radius-base', baseBorderRadius);
    } else if (baseBorderRadius.match(/^\d+$/)) { 
      document.documentElement.style.setProperty('--theme-border-radius-base', `${baseBorderRadius}px`);
    }
    if (inputBorderRadius.match(/^\d+px$/) || inputBorderRadius.match(/^\d+rem$/) || inputBorderRadius.match(/^\d+em$/) || inputBorderRadius === '0') {
      document.documentElement.style.setProperty('--theme-border-radius-input', inputBorderRadius);
    } else if (inputBorderRadius.match(/^\d+$/)) { 
      document.documentElement.style.setProperty('--theme-border-radius-input', `${inputBorderRadius}px`);
    }

    // Apply new typography CSS variables
    document.documentElement.style.setProperty('--theme-font-pagetitle-size', pageTitleSize);
    document.documentElement.style.setProperty('--theme-font-pagetitle-weight', pageTitleWeight);
    document.documentElement.style.setProperty('--theme-font-button-size', buttonTextSize);
    document.documentElement.style.setProperty('--theme-font-button-weight', buttonTextWeight);
    document.documentElement.style.setProperty('--theme-font-input-size', inputTextSize);
    document.documentElement.style.setProperty('--theme-font-input-weight', inputTextWeight);

  }, [currentTheme, isDarkMode, baseBorderRadius, inputBorderRadius, secondaryBtnBg, secondaryBtnText, inputFocusBorder, navActiveItemBg, navActiveItemText, pageTitleSize, pageTitleWeight, buttonTextSize, buttonTextWeight, inputTextSize, inputTextWeight]);

  // useEffect for applying UI density
  useEffect(() => {
    const densityFactors = {
      compact: 0.8,
      default: 1.0,
      comfort: 1.2,
    };
    const factor = densityFactors[uiDensity] || 1.0;

    // Base values are defined in themes.js and set as CSS vars by applyTheme
    // We read the canonical default values, scale them, and then set them.
    for (const varName in defaultSpacingValues) {
      const baseValueStr = defaultSpacingValues[varName];
      if (baseValueStr) {
        const valueMatch = baseValueStr.match(/^(\d*\.?\d+)(px|rem|em)$/);
        if (valueMatch) {
          const num = parseFloat(valueMatch[1]);
          const unit = valueMatch[2];
          document.documentElement.style.setProperty(varName, `${num * factor}${unit}`);
        } else {
          // Handle non-numeric/non-unit values if any, or log warning
          // For now, assume all default spacings are numeric with units
          document.documentElement.style.setProperty(varName, baseValueStr); // Apply as is if not scalable
        }
      }
    }
  }, [uiDensity]); // Only re-run when uiDensity changes. Theme changes re-apply base values via applyTheme.

  useEffect(() => {
    const selectedWeight = fontWeightOptions.find(fw => fw.value === globalFontWeight);
    if (selectedWeight) {
      document.documentElement.style.setProperty('--theme-global-body-font-weight', selectedWeight.cssValue);
    }
  }, [globalFontWeight]);

  // Apply font sizes to CSS custom properties
  useEffect(() => {
    const headerSizeOption = fontSizeOptions.find(option => option.value === headerFontSize);
    const bodySizeOption = fontSizeOptions.find(option => option.value === bodyFontSize);

    if (headerSizeOption) {
      document.documentElement.style.setProperty('--theme-header-font-size', headerSizeOption.cssValue);
    }
    if (bodySizeOption) {
      document.documentElement.style.setProperty('--theme-body-font-size', bodySizeOption.cssValue);
    }
  }, [headerFontSize, bodyFontSize]);

  const setTheme = (themeId) => {
    setCurrentTheme(themeId);
  };

  const deleteCustomTheme = (themeId) => {
    setSavedCustomThemes(prev => prev.filter(theme => theme.id !== themeId));
    // If the deleted theme was currently selected, switch to default
    if (currentTheme === themeId) {
      setCurrentTheme(themes[0].id);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      globalFontWeight,
      setGlobalFontWeight,
      currentUserRole,
      setCurrentUserRole,
      USER_ROLES, // Expose USER_ROLES if needed by consumers
      isDarkMode, // Added isDarkMode to context
      setIsDarkMode, // Added setIsDarkMode to context
      savedCustomThemes, // Added custom themes
      deleteCustomTheme, // Added delete function
      // Font customization
      headerFontSize,
      setHeaderFontSize,
      bodyFontSize,
      setBodyFontSize,
      headerFontWeight,
      setHeaderFontWeight,
      bodyFontWeight,
      setBodyFontWeight,
      // Advanced white labeling
      customLogoUrl,
      setCustomLogoUrl,
      baseBorderRadius,
      setBaseBorderRadius,
      inputBorderRadius,
      setInputBorderRadius,
      cardHeaderBg, // Though applied by themes.js, pass for settings page
      setCardHeaderBg,
      cardHeaderText, // Though applied by themes.js, pass for settings page
      setCardHeaderText,
      tableHeaderText, 
      setTableHeaderText,
      uiDensity,
      setUiDensity,
      // New direct color overrides
      secondaryBtnBg, setSecondaryBtnBg,
      secondaryBtnText, setSecondaryBtnText,
      inputFocusBorder, setInputFocusBorder,
      navActiveItemBg, setNavActiveItemBg,
      navActiveItemText, setNavActiveItemText,
      // New typography controls
      pageTitleSize, setPageTitleSize,
      pageTitleWeight, setPageTitleWeight,
      buttonTextSize, setButtonTextSize,
      buttonTextWeight, setButtonTextWeight,
      inputTextSize, setInputTextSize,
      inputTextWeight, setInputTextWeight
    }}>
      <div
        className={`${styles.appContainer} ${isMobile ? styles.mobile : ''}`}
        data-theme={isDarkMode ? 'dark' : 'light'}
      >
        {!isMobile ? (
           <LeftSidebar />
        ) : (
          <StyledOffcanvas
            show={showMobileMenu}
            onHide={() => setShowMobileMenu(false)}
            placement="start"
            title="Menu"
            // className for StyledOffcanvas's panel can be added if needed
            // e.g. panelClassName={styles.mobileOffcanvasPanel}
          >
            {/* Pass LeftSidebar as children, specific body class might need to be handled by StyledOffcanvas or a wrapper div */}
            <div className={styles.mobileOffcanvasBody}> {/* Keep this wrapper if specific styling is needed beyond StyledOffcanvas.Body defaults */}
              <LeftSidebar />
            </div>
          </StyledOffcanvas>
        )}

        <div className={styles.appPage}>
           {/* Mobile header for mobile only */}
           {isMobile && (
             <div className={styles.mobileHeader}>
               <StyledButton variant="light" onClick={() => setShowMobileMenu(true)}>
                 <span className="material-symbols-outlined">menu</span>
               </StyledButton>
               <span>App Title</span>
             </div>
           )}
          <main className={styles.pageBody}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              {/* <Route path="/add" element={<AddEditForm />} /> */} {/* Removed orphaned route */}
              <Route path="/edit/:id" element={<AddEditForm />} />

              {/* SIS Page Routes */}
              <Route path="/students" element={<StudentListPage />} />
              <Route path="/students/new" element={<AddEditStudentPage />} />
              <Route path="/students/edit/:studentId" element={<AddEditStudentPage />} />
              <Route path="/staff" element={<StaffListPage />} />
              <Route path="/staff/new" element={<AddEditStaffPage />} />
              <Route path="/staff/edit/:staffId" element={<AddEditStaffPage />} />
              <Route path="/courses" element={<CourseListPage />} />
              <Route path="/courses/new" element={<AddEditCoursePage />} />
              <Route path="/courses/edit/:courseId" element={<AddEditCoursePage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} /> {/* Added this route */}
              <Route path="/academic/attendance" element={<AttendancePage />} /> {/* Added AttendancePage Route */}
              <Route path="/grades" element={<GradebookPage />} />
              {/* <Route path="/admissions" element={<AdmissionsPage />} /> */} {/* Route removed */}
              {/* <Route path="/billing" element={<BillingPage />} /> */} {/* Route removed */}
              {/* <Route path="/reports" element={<ReportsPage />} /> */} {/* Route removed */}
              {/* <Route path="/profile" element={<UserProfilePage />} /> */} {/* Route removed */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* Faculty Management Routes */}
              <Route path="/admin/faculty" element={<FacultyListPage />} />
              <Route path="/admin/faculty/new" element={<AddEditFacultyPage />} />
              <Route path="/admin/faculty/edit/:facultyId" element={<AddEditFacultyPage />} />
              <Route path="/faculty/:facultyId" element={<FacultyProfilePage />} />

              {/* Program Management Routes */}
              <Route path="/admin/programs" element={<ProgramListPage />} />
              <Route path="/admin/programs/new" element={<AddEditProgramPage />} />
              <Route path="/admin/programs/edit/:programId" element={<AddEditProgramPage />} />

              {/* Semester Management Routes */}
              <Route path="/admin/semesters" element={<SemesterListPage />} />
              <Route path="/admin/semesters/new" element={<AddEditSemesterPage />} />
              <Route path="/admin/semesters/edit/:semesterId" element={<AddEditSemesterPage />} />

              {/* Master Data Management Routes */}
              <Route path="/admin/masterdata/departments" element={<DepartmentListPage />} />
              <Route path="/admin/masterdata/departments/new" element={<AddEditDepartmentPage />} />
              <Route path="/admin/masterdata/departments/edit/:departmentId" element={<AddEditDepartmentPage />} />

              {/* Financial Year Management Routes */}
              <Route path="/admin/financialyears" element={<FinancialYearListPage />} />
              <Route path="/admin/financialyears/new" element={<AddEditFinancialYearPage />} />
              <Route path="/admin/financialyears/edit/:financialYearId" element={<AddEditFinancialYearPage />} />

              {/* Application Form Field Management Routes */}
              <Route path="/admin/admissions/formfields" element={<AppFormFieldListPage />} />
              <Route path="/admin/admissions/formfields/new" element={<AddEditAppFormFieldPage />} />
              <Route path="/admin/admissions/formfields/edit/:fieldId" element={<AddEditAppFormFieldPage />} />

              {/* Application Submission Tracking Routes */}
              <Route path="/admissions/applications" element={<ApplicationListPage />} />
              <Route path="/admissions/applications/view/:applicationId" element={<ViewApplicationPage />} />

              {/* Organizational Hierarchy Management Routes */}
              <Route path="/admin/organisation/hierarchy" element={<OrgHierarchyPage />} />
              <Route path="/admin/organisation/hierarchy/new" element={<AddEditOrgHierarchyNodePage />} />
              <Route path="/admin/organisation/hierarchy/edit/:nodeId" element={<AddEditOrgHierarchyNodePage />} />

              {/* Examination Schedule Management Routes */}
              <Route path="/academic/examschedules" element={<ExamScheduleListPage />} />
              <Route path="/academic/examschedules/new" element={<AddEditExamSchedulePage />} />
              <Route path="/academic/examschedules/edit/:scheduleId" element={<AddEditExamSchedulePage />} />

              {/* Sub-Institution Management Routes */}
              <Route path="/admin/sub-institutions" element={<SubInstitutionListPage />} />
              <Route path="/admin/sub-institutions/new" element={<AddEditSubInstitutionPage />} />
              <Route path="/admin/sub-institutions/edit/:subInstId" element={<AddEditSubInstitutionPage isEdit={true} />} />

              {/* Component Preview Page Route */}
              <Route path="/component-preview" element={<ComponentPreviewPage />} />

              {/* Additional utility routes */}
              {/* <Route path="/feedback" element={<div>Feedback Page - Coming Soon</div>} /> */} {/* Route removed */}
              {/* <Route path="/tutorial" element={<div>Tutorial Page - Coming Soon</div>} /> */} {/* Route removed */}
              {/* <Route path="/manual" element={<div>User Manual Page - Coming Soon</div>} /> */} {/* Route removed */}
              <Route path="/logout" element={<div>Logout Page - Coming Soon</div>} />
            </Routes>
          </main>
        </div>
        {!isMobile && <UtilitySidebar />}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
