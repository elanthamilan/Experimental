import React, { useState, useContext } from 'react';
import { Dropdown, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StyledButton from '../atoms/StyledButton';
import StyledFormSelect from '../atoms/StyledFormSelect';
import { ThemeContext } from '../../App';
import { themes, fontWeightOptions, fontSizeOptions } from '../../themes';
import styles from './Toolbar.module.scss';

/**
 * Toolbar Component - Top toolbar with user controls and comprehensive theme settings
 * Contains user profile, theme settings, logout, and enhanced customization options
 */
const Toolbar = ({
  className = ''
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const {
    currentTheme,
    setTheme,
    globalFontWeight,
    setGlobalFontWeight,
    isDarkMode,
    setIsDarkMode,
    savedCustomThemes,
    deleteCustomTheme,
    // Font customization from context
    headerFontSize,
    setHeaderFontSize,
    bodyFontSize,
    setBodyFontSize,
    headerFontWeight,
    setHeaderFontWeight,
    bodyFontWeight,
    setBodyFontWeight
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

  return (
    <div className={`${styles.toolbar} ${className}`}>
      <div className={styles.toolbarContent}>
        {/* Left side - could include breadcrumbs or page actions */}
        <div className={styles.toolbarLeft}>
          {/* Space for future toolbar items */}
        </div>

        {/* Right side - user controls and theme settings */}
        <div className={styles.toolbarRight}>
          {/* Theme Settings Dropdown */}
          <Dropdown
            show={showThemeDropdown}
            onToggle={setShowThemeDropdown}
            align="end"
          >
            <Dropdown.Toggle
              as="div"
              className={styles.themeDropdownToggle}
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            >
              <StyledButton
                variant="ghost"
                size="sm"
                className={styles.themeToggle}
                title="Theme & Font Settings"
              >
                <span className="material-symbols-outlined">palette</span>
              </StyledButton>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.themeDropdownMenu}>
              <div className={styles.themeDropdownHeader}>
                <h6 className={styles.dropdownTitle}>
                  <span className="material-symbols-outlined">palette</span>
                  Theme & Font Settings
                </h6>
              </div>

              {/* Theme Selection */}
              <Card className={styles.themeSection}>
                <Card.Header>
                  <h6 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">color_lens</span>
                    Themes
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className={styles.themeGrid}>
                    {themes.slice(0, 6).map((theme) => (
                      <div
                        key={theme.id}
                        className={`${styles.themeCard} ${currentTheme === theme.id ? styles.activeTheme : ''}`}
                        onClick={() => setTheme(theme.id)}
                        title={theme.name}
                      >
                        <div className={styles.colorSwatches}>
                          <div
                            className={styles.colorSwatch}
                            style={{ backgroundColor: theme.seedColors.primary }}
                          />
                          <div
                            className={styles.colorSwatch}
                            style={{ backgroundColor: theme.seedColors.secondary }}
                          />
                          <div
                            className={styles.colorSwatch}
                            style={{ backgroundColor: theme.seedColors.tertiary }}
                          />
                        </div>
                        <div className={styles.themeName}>{theme.name}</div>
                        {currentTheme === theme.id && (
                          <div className={styles.activeIndicator}>
                            <span className="material-symbols-outlined">check_circle</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Font Settings */}
              <Card className={styles.themeSection}>
                <Card.Header>
                  <h6 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">text_fields</span>
                    Typography
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-2">
                    <Col xs={6}>
                      <label className={styles.fontLabel}>Header Size</label>
                      <StyledFormSelect
                        size="sm"
                        value={headerFontSize}
                        onChange={(e) => setHeaderFontSize(e.target.value)}
                      >
                        {fontSizeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </StyledFormSelect>
                    </Col>
                    <Col xs={6}>
                      <label className={styles.fontLabel}>Header Weight</label>
                      <StyledFormSelect
                        size="sm"
                        value={headerFontWeight}
                        onChange={(e) => setHeaderFontWeight(e.target.value)}
                      >
                        {fontWeightOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </StyledFormSelect>
                    </Col>
                    <Col xs={6}>
                      <label className={styles.fontLabel}>Body Size</label>
                      <StyledFormSelect
                        size="sm"
                        value={bodyFontSize}
                        onChange={(e) => setBodyFontSize(e.target.value)}
                      >
                        {fontSizeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </StyledFormSelect>
                    </Col>
                    <Col xs={6}>
                      <label className={styles.fontLabel}>Body Weight</label>
                      <StyledFormSelect
                        size="sm"
                        value={bodyFontWeight}
                        onChange={(e) => setBodyFontWeight(e.target.value)}
                      >
                        {fontWeightOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </StyledFormSelect>
                    </Col>
                  </Row>

                  {/* Dark Mode Toggle */}
                  <div className={styles.darkModeToggle}>
                    <label className={styles.switchLabel}>
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        className={styles.switchInput}
                      />
                      <span className={styles.switchSlider}></span>
                      <span className={styles.switchText}>Dark Mode</span>
                    </label>
                  </div>
                </Card.Body>
              </Card>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Dropdown */}
          <Dropdown
            show={showUserDropdown}
            onToggle={setShowUserDropdown}
            align="end"
          >
            <Dropdown.Toggle
              as="div"
              className={styles.userDropdownToggle}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
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
                </div>
                <span className={`material-symbols-outlined ${styles.dropdownIcon}`}>
                  expand_more
                </span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.userDropdownMenu}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.userEmail}>{currentUser.email}</div>
              </div>

              <Dropdown.Divider />

              <Dropdown.Item as={Link} to="/profile" className={styles.dropdownItem}>
                <span className="material-symbols-outlined">account_circle</span>
                User Profile
              </Dropdown.Item>

              <Dropdown.Item as={Link} to="/settings" className={styles.dropdownItem}>
                <span className="material-symbols-outlined">settings</span>
                Settings
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                onClick={handleLogout}
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
