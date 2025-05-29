import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../App'; // Corrected path
import { themes as predefinedThemes, generateThemeColors } from '../themes';
import { googleFonts, fontWeightOptions } from '../data/fonts';
// import { Form } from 'react-bootstrap'; // Form removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledFormGroup, // Added for Form.Group replacement
  StyledCard,
  StyledButton,
  StyledFormLabel,
  StyledFormCheck,
  FormField,
  StyledRow, 
  StyledCol,  
  StyledListGroup,      // Added
  StyledListGroupItem,  // Added
} from '../components';
import styles from './SettingsPage.module.scss';

const SettingsPage = () => {
  const { currentTheme, setTheme, isDarkMode, globalFontWeight, setGlobalFontWeight } = useTheme();

  // State for custom theme builder (colors)
  const [customPrimary, setCustomPrimary] = useState('#006C74');
  const [customSecondary, setCustomSecondary] = useState('#4C6268');
  const [customTertiary, setCustomTertiary] = useState('#6A5C78');
  const [generatedCustomPalette, setGeneratedCustomPalette] = useState(null);

  // State for custom font selection
  const [selectedHeaderFont, setSelectedHeaderFont] = useState("Inter, sans-serif");
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
      const headerFont = googleFonts.find(f => f.name === activeThemeData.fonts.display)?.value || `"${activeThemeData.fonts.display}", sans-serif`;
      const bodyFont = googleFonts.find(f => f.name === activeThemeData.fonts.body)?.value || `"${activeThemeData.fonts.body}", sans-serif`;
      setSelectedHeaderFont(headerFont);
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
  // Debounce is stable, applyCustomColorsLive is memoized. ESLint may not understand the stability of debounce's return value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedApplyCustomColors = useCallback(debounce(applyCustomColorsLive, 300), [applyCustomColorsLive]);

  useEffect(() => {
    if (customPrimary && customSecondary && customTertiary) {
      debouncedApplyCustomColors(customPrimary, customSecondary, customTertiary, isDarkMode);
    }
  }, [customPrimary, customSecondary, customTertiary, isDarkMode, debouncedApplyCustomColors]);

  // Apply custom fonts live
  useEffect(() => {
    if (selectedHeaderFont) {
      document.documentElement.style.setProperty('--theme-font-display', selectedHeaderFont);
    }
    if (selectedBodyFont) {
      document.documentElement.style.setProperty('--theme-font-body', selectedBodyFont);
    }
  }, [selectedHeaderFont, selectedBodyFont]);

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

    // Find header font name from googleFonts, fallback to the value itself
    const headerFontName = googleFonts.find(f => f.value === selectedHeaderFont)?.name || selectedHeaderFont;
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
        display: headerFontName,
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
    const headerFontValue = googleFonts.find(f => f.name === themeToApply.fonts.display)?.value || themeToApply.fonts.display;
    const bodyFontValue = googleFonts.find(f => f.name === themeToApply.fonts.body)?.value || themeToApply.fonts.body;
    setSelectedHeaderFont(headerFontValue);
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
    <StyledContainer fluid className={styles.settingsPageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Theme & Appearance Settings</h1>
        <p className={styles.pageDescription}>
          Customize your application's visual appearance with predefined themes or create your own custom theme.
        </p>
      </div>
      <StyledRow>
        <StyledCol className="col-lg-8 col-md-12 mb-4">
          {/* Predefined Themes Section */}
          <StyledCard className={styles.settingsSectionCard}>
            <StyledCard.Header>
              <div className={styles.sectionHeaderContent}>
                <h3>Predefined Themes</h3>
                <p>Choose from our curated collection of professionally designed themes</p>
              </div>
            </StyledCard.Header>
            <StyledCard.Body>
              <StyledListGroup variant="flush" className={styles.themeListContainer}>
                {predefinedThemes.map((theme) => (
                  <StyledListGroupItem
                    key={theme.id}
                    className={`${styles.themeListItem} ${currentTheme === theme.id && !savedCustomThemes.find(ct => ct.id === currentTheme) ? styles.activeTheme : ''}`}
                  >
                    <div className={styles.themeInfo}>
                      <h4>{theme.name}</h4>
                      <div className={styles.colorSwatches}>
                        <div className={styles.primarySwatch} style={{ backgroundColor: theme.seedColors.primary }} title={`Primary: ${theme.seedColors.primary}`} />
                        <div className={styles.secondarySwatch} style={{ backgroundColor: theme.seedColors.secondary }} title={`Secondary: ${theme.seedColors.secondary}`} />
                        <div className={styles.tertiarySwatch} style={{ backgroundColor: theme.seedColors.tertiary }} title={`Tertiary: ${theme.seedColors.tertiary}`} />
                      </div>
                      <p>Header: {theme.fonts.display}, Body: {theme.fonts.body}</p>
                      {theme.vibe && <p><em>Vibe: {theme.vibe}</em></p>}
                    </div>
                    <StyledButton
                      variant={currentTheme === theme.id ? 'success' : 'primary'}
                      size="sm"
                      onClick={() => handleApplyPredefinedTheme(theme.id)}
                      disabled={currentTheme === theme.id && !savedCustomThemes.find(ct => ct.id === currentTheme)}
                      className={styles.applyButton}
                    >
                      {currentTheme === theme.id && !savedCustomThemes.find(ct => ct.id === currentTheme) ? 'Applied' : 'Apply'}
                    </StyledButton>
                  </StyledListGroupItem>
                ))}
              </StyledListGroup>
            </StyledCard.Body>
          </StyledCard>

          {/* My Custom Themes Section */}
          {savedCustomThemes.length > 0 && (
            <StyledCard className={styles.settingsSectionCard}>
              <StyledCard.Header>
                <div className={styles.sectionHeaderContent}>
                  <h3>My Custom Themes</h3>
                  <p>Your saved custom theme configurations</p>
                </div>
              </StyledCard.Header>
              <StyledCard.Body>
                <StyledListGroup variant="flush" className={styles.myThemesListContainer}>
                  {savedCustomThemes.map((theme) => (
                    <StyledListGroupItem key={theme.id} className={styles.myThemeListItem}>
                      <div className={styles.myThemeInfo}>
                        <h4>{theme.name}</h4>
                        <div className={styles.colorSwatches}>
                          <div className={styles.primarySwatch} style={{ backgroundColor: theme.seedColors.primary }} title={`Primary: ${theme.seedColors.primary}`} />
                          <div className={styles.secondarySwatch} style={{ backgroundColor: theme.seedColors.secondary }} title={`Secondary: ${theme.seedColors.secondary}`} />
                          <div className={styles.tertiarySwatch} style={{ backgroundColor: theme.seedColors.tertiary }} title={`Tertiary: ${theme.seedColors.tertiary}`} />
                        </div>
                        <p>Header: {theme.fonts.display}, Body: {theme.fonts.body}</p>
                        <p>Base Size: {theme.baseFontSize}px, Weight: {fontWeightOptions.find(fw => fw.value === theme.globalFontWeight)?.label || theme.globalFontWeight}</p>
                      </div>
                      <div className={styles.themeActions}>
                        <StyledButton variant="outline-primary" size="sm" onClick={() => handleApplySavedTheme(theme)} className={styles.applyButton} action>Apply</StyledButton>
                        <StyledButton variant="outline-danger" size="sm" onClick={() => handleDeleteSavedTheme(theme.id)} className={styles.deleteThemeButton} action>Delete</StyledButton>
                      </div>
                    </StyledListGroupItem>
                  ))}
                </StyledListGroup>
              </StyledCard.Body>
            </StyledCard>
          )}
        </StyledCol>

        {/* Customization Column */}
        <StyledCol className="col-lg-4 col-md-12">
          <StyledCard className={styles.settingsSectionCard}>
            <StyledCard.Header>
              <div className={styles.sectionHeaderContent}>
                <h3>Theme Builder</h3>
                <p>Create and customize your own theme</p>
              </div>
            </StyledCard.Header>
            <StyledCard.Body>
              {/* Custom Color Builder */}
              <div className={styles.customThemeBuilderSection}>
                <h5>Colors</h5>
                <form> {/* Replaced Form with form */}
                  <FormField
                    controlId="customPrimaryColor"
                    label="Primary"
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    title="Primary Color"
                    className={styles.colorPickerGroup}
                  />
                  <FormField
                    controlId="customSecondaryColor"
                    label="Secondary"
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    title="Secondary Color"
                    className={styles.colorPickerGroup}
                  />
                  <FormField
                    controlId="customTertiaryColor"
                    label="Tertiary"
                    type="color"
                    value={customTertiary}
                    onChange={(e) => setCustomTertiary(e.target.value)}
                    title="Tertiary Color"
                    className={styles.colorPickerGroup}
                  />
                </form>
                {generatedCustomPalette && (
                  <div className={styles.generatedColorsPreview}>
                    <h6>Live Color Palette Preview:</h6>
                    {previewColorKeys.map(key => {
                      const colorValue = generatedCustomPalette[key];
                      if (!colorValue) return null;
                      const displayName = key.replace('--theme-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <div key={key} className={styles.colorPreviewItem}>
                          <div className={styles.colorValueSwatch} style={{ backgroundColor: colorValue }} />
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
                <form> {/* Replaced Form with form */}
                  <FormField
                    controlId="headerFontSelect"
                    label="Header Font"
                    as="select"
                    value={selectedHeaderFont}
                    onChange={(e) => setSelectedHeaderFont(e.target.value)}
                    options={googleFonts.map(font => ({ value: font.value, label: font.name }))}
                    className={styles.fontSelectorGroup}
                  />
                  <FormField
                    controlId="bodyFontSelect"
                    label="Body Font"
                    as="select"
                    value={selectedBodyFont}
                    onChange={(e) => setSelectedBodyFont(e.target.value)}
                    options={googleFonts.map(font => ({ value: font.value, label: font.name }))}
                    className={styles.fontSelectorGroup}
                  />
                </form>
              </div>
              <hr/>
              {/* Global Typography Settings */}
              <div>
                <h5>Global Typography</h5>
                <form> {/* Replaced Form with form */}
                  <FormField
                    controlId="baseFontSize"
                    label="Base Size (px)"
                    type="number"
                    value={baseFontSize}
                    onChange={(e) => setBaseFontSize(Math.max(10, Math.min(24, Number(e.target.value))))}
                    min="10"
                    max="24"
                    className={styles.fontSizeControlGroup}
                  />
                  <StyledFormGroup controlId="globalFontWeight" className={styles.fontWeightSelectorGroup}> {/* Replaced Form.Group */}
                    <StyledFormLabel>Font Weight</StyledFormLabel>
                    <div className={styles.fontWeightRadioGroup}>
                      {fontWeightOptions.map(fw => (
                        <StyledFormCheck
                          type="radio"
                          key={fw.value}
                          id={`gfw-${fw.value}`}
                          name="gfw"
                          label={fw.label}
                          value={fw.value}
                          checked={globalFontWeight === fw.value}
                          onChange={() => setGlobalFontWeight(fw.value)}
                        />
                      ))}
                    </div>
                  </StyledFormGroup>
                </form>
              </div>
              <div className={styles.saveThemeSection}>
                <StyledButton variant="success" onClick={handleSaveCustomTheme} className={styles.saveThemeButton}>
                  💾 Save Custom Theme
                </StyledButton>
                <p className={styles.saveThemeNote}>
                  <strong>Note:</strong> Live previews are temporary. Save your theme to persist these custom settings.
                </p>
              </div>
            </StyledCard.Body>
          </StyledCard>
        </StyledCol>
      </StyledRow>
    </StyledContainer>
  );
};

export default SettingsPage;
