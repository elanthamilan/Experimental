import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { StyledFormSelect, StyledButton } from '../index';
import styles from './ThemeDrawer.module.scss';

/**
 * Theme Drawer Component - A side panel for theme selection without overlay
 * Allows users to preview themes in real-time while keeping the drawer open
 */
const ThemeDrawer = ({
  isOpen,
  onClose,
  themes = [],
  currentTheme,
  onThemeChange,
  fontWeightOptions = [],
  globalFontWeight,
  onFontWeightChange,
  savedCustomThemes = [],
  onDeleteCustomTheme,
  className = ''
}) => {
  const predefinedThemes = themes.filter(theme => !theme.isCustom);

  return (
    <div className={`${styles.themeDrawer} ${isOpen ? styles.open : ''} ${className}`}>
      <div className={styles.drawerContent}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>
            <span className="material-symbols-outlined">palette</span>
            Theme & Font Settings
          </h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close theme drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Font Weight Selection */}
        <Card className={styles.section}>
          <Card.Header>
            <h4 className={styles.sectionTitle}>
              <span className="material-symbols-outlined">text_fields</span>
              Header Font Weight
            </h4>
          </Card.Header>
          <Card.Body>
            <StyledFormSelect
              value={globalFontWeight}
              onChange={(e) => onFontWeightChange(e.target.value)}
              className={styles.fontWeightSelect}
            >
              {fontWeightOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StyledFormSelect>
          </Card.Body>
        </Card>

        {/* Predefined Themes */}
        <Card className={styles.section}>
          <Card.Header>
            <h4 className={styles.sectionTitle}>
              <span className="material-symbols-outlined">color_lens</span>
              Predefined Themes
            </h4>
          </Card.Header>
          <Card.Body className={styles.themeGrid}>
            {predefinedThemes.map((theme) => {
              const currentGlobalFontWeightValue = fontWeightOptions.find(fw => fw.value === globalFontWeight)?.cssValue || '400';
              return (
                <div
                  key={theme.id}
                  className={`${styles.themeCard} ${currentTheme === theme.id ? styles.activeTheme : ''}`}
                  onClick={() => onThemeChange(theme.id)}
                >
                  <div className={styles.themePreview}>
                    <div className={styles.colorSwatches}>
                      <div
                        className={styles.colorSwatch}
                        style={{ backgroundColor: theme.seedColors.primary }}
                        title={`Primary: ${theme.seedColors.primary}`}
                      />
                      <div
                        className={styles.colorSwatch}
                        style={{ backgroundColor: theme.seedColors.secondary }}
                        title={`Secondary: ${theme.seedColors.secondary}`}
                      />
                      <div
                        className={styles.colorSwatch}
                        style={{ backgroundColor: theme.seedColors.tertiary }}
                        title={`Tertiary: ${theme.seedColors.tertiary}`}
                      />
                    </div>
                    <div
                      className={styles.fontPreview}
                      style={{
                        fontFamily: `"${theme.fonts.body}", sans-serif`,
                        fontWeight: currentGlobalFontWeightValue
                      }}
                    >
                      Aa
                    </div>
                  </div>
                  <div className={styles.themeName}>{theme.name}</div>
                  {currentTheme === theme.id && (
                    <div className={styles.activeIndicator}>
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                  )}
                </div>
              );
            })}
          </Card.Body>
        </Card>

        {/* Custom Themes */}
        {savedCustomThemes.length > 0 && (
          <Card className={styles.section}>
            <Card.Header>
              <h4 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">brush</span>
                Custom Themes
              </h4>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {savedCustomThemes.map((theme) => (
                  <ListGroup.Item
                    key={theme.id}
                    className={`${styles.customThemeItem} ${currentTheme === theme.id ? styles.activeCustomTheme : ''}`}
                  >
                    <div className={styles.customThemeInfo} onClick={() => onThemeChange(theme.id)}>
                      <div className={styles.customThemeName}>{theme.name}</div>
                      <div className={styles.colorSwatches}>
                        <div className={styles.colorSwatch} style={{ backgroundColor: theme.seedColors.primary }} />
                        <div className={styles.colorSwatch} style={{ backgroundColor: theme.seedColors.secondary }} />
                        <div className={styles.colorSwatch} style={{ backgroundColor: theme.seedColors.tertiary }} />
                      </div>
                    </div>
                    <StyledButton
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomTheme(theme.id);
                      }}
                      className={styles.deleteButton}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </StyledButton>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThemeDrawer;
