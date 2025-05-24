import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { themes, applyTheme } from './themes'; 
import SearchCriteria from './components/SearchCriteria';
import SummaryStats from './components/SummaryStats';
import ResultsTable from './components/ResultsTable';
import LeftSidebar from './components/LeftSidebar';
import AddEditForm from './components/AddEditForm';
import { Button, Offcanvas, OverlayTrigger, Tooltip, Modal, Form } from 'react-bootstrap';
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
// Course Detail Page Import
import CourseDetailPage from './pages/academic/CourseDetailPage';

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

// Font weight options
const fontWeightOptions = [
  { label: 'Normal', value: 'normal', cssValue: '400' },
  { label: 'Bold', value: 'bold', cssValue: '700' },
  { label: 'Extra Bold', value: 'xbold', cssValue: '800' }, // Common value for extra-bold
];

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
  const { currentTheme, setTheme, globalFontWeight, setGlobalFontWeight, currentUserRole, setCurrentUserRole, USER_ROLES } = useTheme();
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
        <Form.Select
          value={currentUserRole}
          onChange={(e) => setCurrentUserRole(e.target.value)}
          aria-label="Select User Role"
          className={styles.roleSelectorDropdown}
          bsPrefix="form-select-sm" // Use Bootstrap's small select
        >
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.TEACHER}>Teacher</option>
          <option value={USER_ROLES.STUDENT}>Student</option>
        </Form.Select>
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
          <Form>
            {themes.map(theme => (
              <Form.Check
                type="radio"
                key={theme.id}
                id={`theme-radio-${theme.id}`}
                name="themeSelection"
                label={theme.name}
                value={theme.id}
                checked={currentTheme === theme.id}
                onChange={() => { 
                  setTheme(theme.id); 
                  setShowThemeModal(false); 
                }}
                className={styles.themeRadioItem} // Custom class for styling radio items
              />
            ))}
          </Form>

          <hr className={styles.modalDivider} />
          <Modal.Title as="h6" className={styles.modalSectionTitle}>Global Font Weight</Modal.Title>
          <Form>
            {fontWeightOptions.map(fw => (
              <Form.Check
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
          </Form>
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

  useEffect(() => {
    applyTheme(currentTheme); // Applies color and font-family variables
  }, [currentTheme]);
  
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
      USER_ROLES // Expose USER_ROLES if needed by consumers
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
               <Button variant="light" onClick={() => setShowMobileMenu(true)}>
                 <span className="material-symbols-outlined">menu</span>
               </Button>
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
            </Routes>
          </main>
        </div>
        {!isMobile && <UtilitySidebar />} 
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
