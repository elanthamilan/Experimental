import React, { useState, useEffect, createContext, useContext } from 'react';
import { themes, applyTheme } from './themes';

import LeftSidebar from './components/organisms/LeftSidebar';
import AddEditForm from './components/organisms/AddEditForm';
import { Offcanvas, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import StyledButton from './components/atoms/StyledButton';
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
import AdmissionsPage from './pages/admin/AdmissionsPage';
import BillingPage from './pages/finance/BillingPage';
import ReportsPage from './pages/admin/ReportsPage';
import UserProfilePage from './pages/user/UserProfilePage';
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
// Component Preview Page Import
import ComponentPreviewPage from './pages/ComponentPreviewPage';
// Settings Page Import
import SettingsPage from './pages/SettingsPage';
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const {
    setTheme,
    isDarkMode,
    setIsDarkMode,
    // Font customization from context
    headerFontSize,
    setHeaderFontSize,
    setBodyFontSize
  } = useContext(ThemeContext);

  // Mock user data - replace with actual user context
  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null, // URL to avatar image
    role: 'Administrator'
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  // Theme cycling function
  const handleThemeChange = () => {
    const availableThemes = themes.slice(0, 6); // Use first 6 themes
    const nextIndex = (currentThemeIndex + 1) % availableThemes.length;
    setCurrentThemeIndex(nextIndex);
    setTheme(availableThemes[nextIndex].id);
  };

  // Font size cycling function
  const handleFontSizeChange = () => {
    const currentHeaderIndex = fontSizeOptions.findIndex(option => option.value === headerFontSize);

    // If current font size is not found, start from the beginning
    const startIndex = currentHeaderIndex === -1 ? 0 : currentHeaderIndex;
    const nextIndex = (startIndex + 1) % fontSizeOptions.length;

    setHeaderFontSize(fontSizeOptions[nextIndex].value);
    setBodyFontSize(fontSizeOptions[nextIndex].value);
  };

  const renderTooltip = (props, text) => (
    <Tooltip id={`tooltip-${text.toLowerCase().replace(' ', '-')}`} {...props}>
      {text}
    </Tooltip>
  );

  return (
    <div className={styles.utilitySidebar}>
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Apps')}>
        <div className={styles.squareIconButton}>
          <span className="material-symbols-outlined">apps</span>
        </div>
      </OverlayTrigger>

      <hr className={styles.divider} />

      {/* Theme Settings - Direct Controls */}
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Cycle Themes')}>
        <div
          className={styles.circleIconButton}
          onClick={handleThemeChange}
        >
          <span className="material-symbols-outlined">palette</span>
        </div>
      </OverlayTrigger>

      {/* Font Size Controls */}
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Cycle Font Size')}>
        <div
          className={styles.circleIconButton}
          onClick={handleFontSizeChange}
        >
          <span className="material-symbols-outlined">text_fields</span>
        </div>
      </OverlayTrigger>

      {/* Dark Mode Toggle */}
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Toggle Dark Mode')}>
        <div
          className={styles.circleIconButton}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </div>
      </OverlayTrigger>

      {/* Settings Page Link */}
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Settings')}>
        <Link to="/settings" className={styles.circleIconButton}>
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </OverlayTrigger>

      {/* User Profile Dropdown */}
      <Dropdown
        show={showUserDropdown}
        onToggle={setShowUserDropdown}
        align="start"
        drop="start"
        style={{ position: 'static' }}
      >
        <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'User Profile')}>
          <Dropdown.Toggle
            as="div"
            className={styles.circleIconButton}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Dropdown.Toggle>
        </OverlayTrigger>

        <Dropdown.Menu
          className={styles.utilityDropdownMenu}
          style={{
            position: 'fixed',
            zIndex: 9999,
            right: '80px',
            top: '120px'
          }}
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

          <hr className={styles.dropdownDivider} />

          <Dropdown.Item as={Link} to="/profile" className={styles.dropdownItem}>
            <span className="material-symbols-outlined">account_circle</span>
            User Profile
          </Dropdown.Item>

          <Dropdown.Item as={Link} to="/settings" className={styles.dropdownItem}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Dropdown.Item>

          <hr className={styles.dropdownDivider} />

          <Dropdown.Item
            onClick={handleLogout}
            className={`${styles.dropdownItem} ${styles.logoutItem}`}
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <hr className={styles.divider} />

      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Calendar')}>
        <div className={styles.circleIconButton}>
           <span className="material-symbols-outlined">calendar_today</span>
        </div>
      </OverlayTrigger>
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Tasks')}>
        <div className={styles.circleIconButton}>
           <span className="material-symbols-outlined">task_alt</span>
        </div>
      </OverlayTrigger>
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Notifications')}>
        <div className={styles.circleIconButton}>
           <span className="material-symbols-outlined">notifications</span>
        </div>
      </OverlayTrigger>
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

  useEffect(() => {
    applyTheme(currentTheme, isDarkMode); // Applies color and font-family variables, now with isDarkMode
  }, [currentTheme, isDarkMode]); // Added isDarkMode to dependency array

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
      setBodyFontWeight
    }}>
      <div
        className={`${styles.appContainer} ${isMobile ? styles.mobile : ''}`}
        data-theme={isDarkMode ? 'dark' : 'light'}
      >
        {!isMobile ? (
           <LeftSidebar />
        ) : (
           <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="start">
             <Offcanvas.Header closeButton>
               <Offcanvas.Title>Menu</Offcanvas.Title>
             </Offcanvas.Header>
             <Offcanvas.Body className={styles.mobileOffcanvasBody}>
               <LeftSidebar />
             </Offcanvas.Body>
           </Offcanvas>
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
              <Route path="/grades" element={<GradebookPage />} />
              <Route path="/admissions" element={<AdmissionsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
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

              {/* Component Preview Page Route */}
              <Route path="/component-preview" element={<ComponentPreviewPage />} />

              {/* Additional utility routes */}
              <Route path="/feedback" element={<div>Feedback Page - Coming Soon</div>} />
              <Route path="/tutorial" element={<div>Tutorial Page - Coming Soon</div>} />
              <Route path="/manual" element={<div>User Manual Page - Coming Soon</div>} />
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
