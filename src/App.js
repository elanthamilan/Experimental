import React, { useState, useEffect, createContext, useContext } from 'react';
import { themes, applyTheme } from './themes';
import SearchCriteria from './components/SearchCriteria';
import SummaryStats from './components/SummaryStats';
import ResultsTable from './components/ResultsTable';
import LeftSidebar from './components/LeftSidebar';
import AddEditForm from './components/AddEditForm';
import { Offcanvas, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import StyledButton from './components/atoms/StyledButton';
import StyledFormSelect from './components/atoms/StyledFormSelect';
import StyledFormCheck from './components/atoms/StyledFormCheck';
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

import styles from './App.module.scss';
import './App.css';

// Create Theme Context
const ThemeContext = createContext();
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
  const { currentTheme, setTheme, globalFontWeight, setGlobalFontWeight, currentUserRole, setCurrentUserRole, USER_ROLES, isDarkMode, setIsDarkMode } = useTheme(); // Added isDarkMode, setIsDarkMode
  const [showThemeModal, setShowThemeModal] = useState(false);
  // const themeMenuRef = useRef(null); // No longer needed
  // useOutsideAlerter(themeMenuRef, () => setShowThemeMenu(false)); // No longer needed


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

      {/* Role Selector */}
      <div className={styles.sidebarSection}>
        <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Switch User Role')}>
          <div className={styles.circleIconButton} style={{ marginBottom: '8px' }}> {/* Added style for spacing, or use SCSS */}
             <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
        </OverlayTrigger>
        <StyledFormSelect
          value={currentUserRole}
          onChange={(e) => setCurrentUserRole(e.target.value)}
          aria-label="Select User Role"
          className={styles.roleSelectorDropdown}
          size="sm"
        >
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.TEACHER}>Teacher</option>
          <option value={USER_ROLES.STUDENT}>Student</option>
        </StyledFormSelect>
      </div>

      {/* Theme Switcher Icon - Triggers Modal */}
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Change Theme')}>
        <div
          className={styles.circleIconButton}
          onClick={() => setShowThemeModal(true)}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowThemeModal(true);}}
        >
          <span className="material-symbols-outlined">palette</span>
        </div>
      </OverlayTrigger>

      {/* Theme Selection Modal */}
      <Modal show={showThemeModal} onHide={() => setShowThemeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Theme / Font Weight</Modal.Title> {/* Updated Title */}
        </Modal.Header>
        <Modal.Body className={styles.themeModalBody}>
          <div>
            {themes.map(theme => {
              const currentGlobalFontWeightValue = fontWeightOptions.find(fw => fw.value === globalFontWeight)?.cssValue || '400';
              return (
                <StyledFormCheck
                  type="radio"
                  key={theme.id}
                  id={`theme-radio-${theme.id}`}
                  name="themeSelection"
                  value={theme.id}
                  checked={currentTheme === theme.id}
                  onChange={() => {
                    setTheme(theme.id);
                    // setShowThemeModal(false); // Keep modal open to see changes
                  }}
                  className={styles.themeRadioItem}
                  label={
                    <div className={styles.themeOptionContainer}>
                      <span>{theme.name}</span>
                      <div className={styles.themePreviewPalette}>
                        <div className={styles.themeColorSwatch} style={{ backgroundColor: theme.seedColors.primary }}></div>
                        <div className={styles.themeColorSwatch} style={{ backgroundColor: theme.seedColors.secondary }}></div>
                        <div className={styles.themeColorSwatch} style={{ backgroundColor: theme.seedColors.tertiary }}></div>
                      </div>
                      <div className={styles.themeFontPreview} style={{ fontFamily: `"${theme.fonts.body}", sans-serif`, fontWeight: currentGlobalFontWeightValue }}>
                        Aa Bb Cc
                      </div>
                    </div>
                  }
                />
              );
            })}
          </div>

          <hr className={styles.modalDivider} />
          <Modal.Title as="h6" className={styles.modalSectionTitle}>Global Font Weight</Modal.Title>
          <div>
            {fontWeightOptions.map(fw => (
              <StyledFormCheck
                type="radio"
                key={fw.value}
                id={`fontweight-radio-${fw.value}`}
                name="fontWeightSelection"
                label={fw.label}
                value={fw.value}
                checked={globalFontWeight === fw.value}
                onChange={() => {
                  setGlobalFontWeight(fw.value);
                  // Optionally close modal, or keep it open for further changes
                  // setShowThemeModal(false);
                }}
                className={styles.themeRadioItem}
              />
            ))}
          </div>

          <hr className={styles.modalDivider} />
          <Modal.Title as="h6" className={styles.modalSectionTitle}>Appearance</Modal.Title>
          <div>
            <StyledFormCheck
              type="switch"
              id="dark-mode-switch"
              label="Dark Mode"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className={styles.themeRadioItem} // Re-use style for consistent appearance
            />
          </div>
        </Modal.Body>
      </Modal>

       <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Logout')}>
        <div className={styles.circleIconButton}>
          <span className="material-symbols-outlined">logout</span>
        </div>
      </OverlayTrigger>

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
      <OverlayTrigger placement="left" overlay={(props) => renderTooltip(props, 'Profile')}>
        <div className={styles.circleIconButton}>
           <span className="material-symbols-outlined">lab_profile</span>
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
  const [globalFontWeight, setGlobalFontWeight] = useState(fontWeightOptions[0].value); // Default to 'normal'
  const [currentUserRole, setCurrentUserRole] = useState(USER_ROLES.ADMIN); // Default role
  const [isDarkMode, setIsDarkMode] = useState(false); // Added isDarkMode state

  useEffect(() => {
    applyTheme(currentTheme, isDarkMode); // Applies color and font-family variables, now with isDarkMode
  }, [currentTheme, isDarkMode]); // Added isDarkMode to dependency array

  useEffect(() => {
    const selectedWeight = fontWeightOptions.find(fw => fw.value === globalFontWeight);
    if (selectedWeight) {
      document.documentElement.style.setProperty('--theme-global-body-font-weight', selectedWeight.cssValue);
    }
  }, [globalFontWeight]);

  const setTheme = (themeId) => {
    setCurrentTheme(themeId);
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
      setIsDarkMode // Added setIsDarkMode to context
    }}>
      <div className={`${styles.appContainer} ${isMobile ? styles.mobile : ''}`}>
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
              <Route path="/" element={
                <>
                  <SearchCriteria />
                  <SummaryStats />
                  <ResultsTable />
                </>
              } />
              <Route path="/add" element={<AddEditForm />} />
              <Route path="/edit/:id" element={<AddEditForm />} />

              {/* SIS Page Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
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
