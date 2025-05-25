import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../src/App'; // Corrected path
import { themes as predefinedThemes, generateThemeColors } from '../../src/themes';
import { googleFonts, fontWeightOptions } from '../../src/data/fonts';
import { Container, Row, Col, Card, Button, ListGroup, Form } from 'react-bootstrap';
import styles from './SettingsPage.module.scss';

const SettingsPage = () => {
  const { currentTheme, setTheme, isDarkMode, globalFontWeight, setGlobalFontWeight } = useTheme();

  // State for custom theme builder (colors)
  const [customPrimary, setCustomPrimary] = useState('#006C74');
  const [customSecondary, setCustomSecondary] = useState('#4C6268');
  const [customTertiary, setCustomTertiary] = useState('#6A5C78');
  const [generatedCustomPalette, setGeneratedCustomPalette] = useState(null);

  // State for custom font selection
  const [selectedDisplayFont, setSelectedDisplayFont] = useState("Inter, sans-serif");
  const [selectedBodyFont, setSelectedBodyFont] = useState("Roboto, sans-serif");

  // State for base font size
  const [baseFontSize, setBaseFontSize] = useState(16);

  // State for saved custom themes
  const [savedCustomThemes, setSavedCustomThemes] = useState([]);

  // Load saved themes from localStorage on mount
  useEffect(() => {
    const storedThemes = localStorage.getItem('customThemes');
    if (storedThemes) {
      setSavedCustomThemes(JSON.parse(storedThemes));
    }
  }, []);

  // Save themes to localStorage when savedCustomThemes changes
  useEffect(() => {
    localStorage.setItem('customThemes', JSON.stringify(savedCustomThemes));
  }, [savedCustomThemes]);


  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // Initialize custom pickers from currentTheme or defaults
  useEffect(() => {
    const activeThemeData = predefinedThemes.find(t => t.id === currentTheme);
    if (activeThemeData && !activeThemeData.isCustom) { // Do not reset pickers if currentTheme is a custom one being applied
      setCustomPrimary(activeThemeData.seedColors.primary);
      setCustomSecondary(activeThemeData.seedColors.secondary);
      setCustomTertiary(activeThemeData.seedColors.tertiary);
      const displayFont = googleFonts.find(f => f.name === activeThemeData.fonts.display)?.value || `"${activeThemeData.fonts.display}", sans-serif`;
      const bodyFont = googleFonts.find(f => f.name === activeThemeData.fonts.body)?.value || `"${activeThemeData.fonts.body}", sans-serif`;
      setSelectedDisplayFont(displayFont);
      setSelectedBodyFont(bodyFont);
      // Base font size and global font weight are global, not reset by predefined theme selection here
      // but rather controlled by their own UI elements or initial context values.
    }
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    setBaseFontSize(rootFontSize || 16);
  }, [currentTheme]);

  // Generate and apply custom theme palette (colors - debounced)
  const applyCustomColorsLive = useCallback(
    (primary, secondary, tertiary, dark) => {
      const newPalette = generateThemeColors(primary, secondary, tertiary, dark);
      setGeneratedCustomPalette(newPalette);
      for (const colorVar in newPalette) {
        document.documentElement.style.setProperty(colorVar, newPalette[colorVar]);
      }
    },
    []
  );
  const debouncedApplyCustomColors = useCallback(debounce(applyCustomColorsLive, 300), [applyCustomColorsLive]);

  useEffect(() => {
    if (customPrimary && customSecondary && customTertiary) {
      debouncedApplyCustomColors(customPrimary, customSecondary, customTertiary, isDarkMode);
    }
  }, [customPrimary, customSecondary, customTertiary, isDarkMode, debouncedApplyCustomColors]);

  // Apply custom fonts live
  useEffect(() => {
    if (selectedDisplayFont) {
      document.documentElement.style.setProperty('--theme-font-display', selectedDisplayFont);
    }
    if (selectedBodyFont) {
      document.documentElement.style.setProperty('--theme-font-body', selectedBodyFont);
    }
  }, [selectedDisplayFont, selectedBodyFont]);

  // Apply base font size live
  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  const previewColorKeys = [
    '--theme-primary', '--theme-on-primary', '--theme-primary-container', '--theme-on-primary-container',
    '--theme-secondary', '--theme-on-secondary',
    '--theme-background', '--theme-on-background', '--theme-surface', '--theme-on-surface',
  ];

  const handleApplyPredefinedTheme = (themeId) => {
    setTheme(themeId); // This also triggers the useEffect above to reset custom pickers
  };

  const handleSaveCustomTheme = () => {
    const themeName = window.prompt("Enter a name for your custom theme:", "My Custom Theme");
    if (!themeName) return;

    // Find display font name from googleFonts, fallback to the value itself
    const displayFontName = googleFonts.find(f => f.value === selectedDisplayFont)?.name || selectedDisplayFont;
    // Find body font name from googleFonts, fallback to the value itself
    const bodyFontName = googleFonts.find(f => f.value === selectedBodyFont)?.name || selectedBodyFont;

    const newCustomTheme = {
      id: `custom-${Date.now()}`,
      name: themeName,
      seedColors: {
        primary: customPrimary,
        secondary: customSecondary,
        tertiary: customTertiary,
      },
      fonts: { // Storing the name, not the full CSS value, for display consistency
        display: displayFontName,
        body: bodyFontName,
      },
      baseFontSize: baseFontSize,
      globalFontWeight: globalFontWeight, // From ThemeContext
      isCustom: true,
    };
    setSavedCustomThemes(prevThemes => [...prevThemes, newCustomTheme]);
  };

  const handleApplySavedTheme = (themeToApply) => {
    // Set color pickers
    setCustomPrimary(themeToApply.seedColors.primary);
    setCustomSecondary(themeToApply.seedColors.secondary);
    setCustomTertiary(themeToApply.seedColors.tertiary);

    // Set font selectors - find the value from googleFonts list using the stored name
    const displayFontValue = googleFonts.find(f => f.name === themeToApply.fonts.display)?.value || themeToApply.fonts.display;
    const bodyFontValue = googleFonts.find(f => f.name === themeToApply.fonts.body)?.value || themeToApply.fonts.body;
    setSelectedDisplayFont(displayFontValue);
    setSelectedBodyFont(bodyFontValue);
    
    // Set base font size
    setBaseFontSize(themeToApply.baseFontSize);
    
    // Set global font weight (this will trigger context update and App.js useEffect)
    setGlobalFontWeight(themeToApply.globalFontWeight);

    // Note: The individual useEffects for colors, fonts, baseFontSize will apply these settings live.
    // We don't call setTheme() here to avoid confusion with predefined themes unless specifically desired.
    // The current "active" theme in the predefined list will remain visually selected.
  };

  const handleDeleteSavedTheme = (themeIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this custom theme?")) {
      setSavedCustomThemes(prevThemes => prevThemes.filter(theme => theme.id !== themeIdToDelete));
    }
  };


  return (
    <Container fluid className={styles.settingsPageContainer}>
      <h1 className={styles.pageTitle}>Settings</h1>
      <Row>
        <Col lg={8} md={12} className="mb-4">
          {/* Predefined Themes Section */}
          <Card className={styles.settingsSectionCard}>
            <Card.Header>Predefined Themes</Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className={styles.themeListContainer}>
                {predefinedThemes.map((theme) => (
                  <ListGroup.Item
                    key={theme.id}
                    className={`${styles.themeListItem} ${currentTheme === theme.id && !savedCustomThemes.find(ct => ct.id === currentTheme) ? styles.activeTheme : ''}`}
                  >
                    <div className={styles.themeInfo}>
                      <h4>{theme.name}</h4>
                      <div className={styles.colorSwatches}>
                        <div className={styles.swatch} style={{ backgroundColor: theme.seedColors.primary }} title={`Primary: ${theme.seedColors.primary}`} />
                        <div className={styles.swatch} style={{ backgroundColor: theme.seedColors.secondary }} title={`Secondary: ${theme.seedColors.secondary}`} />
                        <div className={styles.swatch} style={{ backgroundColor: theme.seedColors.tertiary }} title={`Tertiary: ${theme.seedColors.tertiary}`} />
                      </div>
                      <p>Display: {theme.fonts.display}, Body: {theme.fonts.body}</p>
                      {theme.vibe && <p><em>Vibe: {theme.vibe}</em></p>}
                    </div>
                    <Button
                      variant={currentTheme === theme.id ? 'success' : 'primary'}
                      size="sm"
                      onClick={() => handleApplyPredefinedTheme(theme.id)}
                      disabled={currentTheme === theme.id && !savedCustomThemes.find(ct => ct.id === currentTheme)}
                      className={styles.applyButton}
                    >
                      {currentTheme === theme.id && !savedCustomThemes.find(ct => ct.id === currentTheme) ? 'Applied' : 'Apply'}
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* My Custom Themes Section */}
          {savedCustomThemes.length > 0 && (
            <Card className={styles.settingsSectionCard}>
              <Card.Header>My Custom Themes</Card.Header>
              <Card.Body>
                <ListGroup variant="flush" className={styles.myThemesListContainer}>
                  {savedCustomThemes.map((theme) => (
                    <ListGroup.Item key={theme.id} className={styles.myThemeListItem}>
                      <div className={styles.myThemeInfo}>
                        <h4>{theme.name}</h4>
                        <div className={styles.colorSwatches}>
                          <div className={styles.swatch} style={{ backgroundColor: theme.seedColors.primary }} title={`Primary: ${theme.seedColors.primary}`} />
                          <div className={styles.swatch} style={{ backgroundColor: theme.seedColors.secondary }} title={`Secondary: ${theme.seedColors.secondary}`} />
                          <div className={styles.swatch} style={{ backgroundColor: theme.seedColors.tertiary }} title={`Tertiary: ${theme.seedColors.tertiary}`} />
                        </div>
                        <p>Display: {theme.fonts.display}, Body: {theme.fonts.body}</p>
                        <p>Base Size: {theme.baseFontSize}px, Weight: {fontWeightOptions.find(fw => fw.value === theme.globalFontWeight)?.label || theme.globalFontWeight}</p>
                      </div>
                      <div className={styles.themeActions}>
                        <Button variant="outline-primary" size="sm" onClick={() => handleApplySavedTheme(theme)} className={styles.applyButton}>Apply</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteSavedTheme(theme.id)} className={styles.deleteThemeButton}>Delete</Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Customization Column */}
        <Col lg={4} md={12}>
          <Card className={styles.settingsSectionCard}>
            <Card.Header>Customize & Save Theme</Card.Header>
            <Card.Body>
              {/* Custom Color Builder */}
              <div className={styles.customThemeBuilderSection}>
                <h5>Colors</h5>
                <Form>
                  <Form.Group controlId="customPrimaryColor" className={styles.colorPickerGroup}>
                    <Form.Label>Primary</Form.Label>
                    <Form.Control type="color" value={customPrimary} onChange={(e) => setCustomPrimary(e.target.value)} title="Primary Color" />
                  </Form.Group>
                  {/* ... Secondary and Tertiary color pickers ... */}
                  <Form.Group controlId="customSecondaryColor" className={styles.colorPickerGroup}>
                    <Form.Label>Secondary</Form.Label>
                    <Form.Control type="color" value={customSecondary} onChange={(e) => setCustomSecondary(e.target.value)} title="Secondary Color" />
                  </Form.Group>
                  <Form.Group controlId="customTertiaryColor" className={styles.colorPickerGroup}>
                    <Form.Label>Tertiary</Form.Label>
                    <Form.Control type="color" value={customTertiary} onChange={(e) => setCustomTertiary(e.target.value)} title="Tertiary Color" />
                  </Form.Group>
                </Form>
                {generatedCustomPalette && (
                  <div className={styles.generatedColorsPreview}>
                    <h6>Live Color Palette Preview:</h6>
                    {previewColorKeys.map(key => {
                      const colorValue = generatedCustomPalette[key];
                      if (!colorValue) return null;
                      const displayName = key.replace('--theme-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <div key={key} className={styles.colorPreviewItem}>
                          <div className={styles.previewSwatch} style={{ backgroundColor: colorValue }} />
                          <span className={styles.colorName}>{displayName}:</span>
                          <span className={styles.colorValue}>{colorValue}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <hr/>
              {/* Custom Font Selection */}
              <div className={styles.customFontSelectorSection}>
                <h5>Fonts</h5>
                <Form>
                  <Form.Group controlId="displayFontSelect" className={styles.fontSelectorGroup}>
                    <Form.Label>Display Font</Form.Label>
                    <Form.Select value={selectedDisplayFont} onChange={(e) => setSelectedDisplayFont(e.target.value)}>
                      {googleFonts.map(font => (<option key={`display-${font.name}`} value={font.value}>{font.name}</option>))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="bodyFontSelect" className={styles.fontSelectorGroup}>
                    <Form.Label>Body Font</Form.Label>
                    <Form.Select value={selectedBodyFont} onChange={(e) => setSelectedBodyFont(e.target.value)}>
                      {googleFonts.map(font => (<option key={`body-${font.name}`} value={font.value}>{font.name}</option>))}
                    </Form.Select>
                  </Form.Group>
                </Form>
              </div>
              <hr/>
              {/* Global Typography Settings */}
              <div>
                <h5>Global Typography</h5>
                <Form>
                  <Form.Group controlId="baseFontSize" className={styles.fontSizeControlGroup}>
                    <Form.Label>Base Size (px)</Form.Label>
                    <Form.Control type="number" value={baseFontSize} onChange={(e) => setBaseFontSize(Math.max(10, Math.min(24, Number(e.target.value))))} min="10" max="24" />
                  </Form.Group>
                  <Form.Group controlId="globalFontWeight" className={styles.fontWeightSelectorGroup}>
                    <Form.Label>Font Weight</Form.Label>
                    <div className={styles.fontWeightRadioGroup}>
                      {fontWeightOptions.map(fw => (
                        <Form.Check type="radio" key={fw.value} id={`gfw-${fw.value}`} name="gfw" label={fw.label} value={fw.value} checked={globalFontWeight === fw.value} onChange={() => setGlobalFontWeight(fw.value)} />
                      ))}
                    </div>
                  </Form.Group>
                </Form>
              </div>
              <Button variant="success" onClick={handleSaveCustomTheme} className={styles.saveThemeButton}>
                Save Current Custom Theme
              </Button>
              <p className={styles.placeholderText} style={{marginTop: '1rem', fontSize: '0.8rem'}}>
                Live previews are temporary. Save to persist your custom settings.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
