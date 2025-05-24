import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { themes, applyTheme } from './themes'; 
import SearchCriteria from './components/SearchCriteria';
import SummaryStats from './components/SummaryStats';
import ResultsTable from './components/ResultsTable';
import LeftSidebar from './components/LeftSidebar';
import AddEditForm from './components/AddEditForm';
import { Button, Offcanvas, OverlayTrigger, Tooltip, Modal, Form } from 'react-bootstrap'; 
import { Routes, Route } from 'react-router-dom';
import styles from './App.module.scss';
import './App.css';

// Create Theme Context
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

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
  const { currentTheme, setTheme, globalFontWeight, setGlobalFontWeight } = useTheme();
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
          <Modal.Title>Select Theme</Modal.Title>
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
    <ThemeContext.Provider value={{ currentTheme, setTheme, globalFontWeight, setGlobalFontWeight }}>
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
            </Routes>
          </main>
        </div>
        {!isMobile && <UtilitySidebar />} 
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
