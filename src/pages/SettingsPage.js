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
  const {
    currentTheme, setTheme, isDarkMode, globalFontWeight, setGlobalFontWeight,
    customLogoUrl, setCustomLogoUrl,
    baseBorderRadius, setBaseBorderRadius,
    inputBorderRadius, setInputBorderRadius,
    uiDensity, setUiDensity, 
    secondaryBtnBg, setSecondaryBtnBg,
    secondaryBtnText, setSecondaryBtnText,
    inputFocusBorder, setInputFocusBorder,
    navActiveItemBg, setNavActiveItemBg,
    navActiveItemText, setNavActiveItemText,
    // Typography context
    pageTitleSize, setPageTitleSize,
    pageTitleWeight, setPageTitleWeight,
    buttonTextSize, setButtonTextSize,
    buttonTextWeight, setButtonTextWeight,
    inputTextSize, setInputTextSize,
    inputTextWeight, setInputTextWeight
  } = useTheme();

  // State for custom theme builder (colors)
  const [customPrimary, setCustomPrimary] = useState('#006C74'); // Seed for derived colors
  const [customSecondary, setCustomSecondary] = useState('#4C6268'); // Seed for derived colors
  const [customTertiary, setCustomTertiary] = useState('#6A5C78'); // Seed for derived colors
  const [generatedCustomPalette, setGeneratedCustomPalette] = useState(null);

  // Local state for direct color overrides, initialized from context
  const [localSecondaryBtnBg, setLocalSecondaryBtnBg] = useState(secondaryBtnBg || '');
  const [localSecondaryBtnText, setLocalSecondaryBtnText] = useState(secondaryBtnText || '');
  const [localInputFocusBorder, setLocalInputFocusBorder] = useState(inputFocusBorder || '');
  const [localNavActiveItemBg, setLocalNavActiveItemBg] = useState(navActiveItemBg || '');
  const [localNavActiveItemText, setLocalNavActiveItemText] = useState(navActiveItemText || '');

  // State for custom font selection
  const [selectedHeaderFont, setSelectedHeaderFont] = useState("Inter, sans-serif");
  const [selectedBodyFont, setSelectedBodyFont] = useState("Roboto, sans-serif");

  const { baseFontSize: contextBaseFontSize, setBaseFontSize: setContextBaseFontSize } = useTheme();
  const [localBaseFontSize, setLocalBaseFontSize] = useState(contextBaseFontSize || 16);

  // Local state for new settings, initialized from context
  const [localCustomLogoUrl, setLocalCustomLogoUrl] = useState(customLogoUrl || '');
  const [localBaseBorderRadius, setLocalBaseBorderRadius] = useState(baseBorderRadius || '8px');
  const [localInputBorderRadius, setLocalInputBorderRadius] = useState(inputBorderRadius || '4px');

  // Local state for typography settings, initialized from context
  const [localPageTitleSize, setLocalPageTitleSize] = useState(pageTitleSize || '2.5rem');
  const [localPageTitleWeight, setLocalPageTitleWeight] = useState(pageTitleWeight || '700');
  const [localButtonTextSize, setLocalButtonTextSize] = useState(buttonTextSize || '0.875rem');
  const [localButtonTextWeight, setLocalButtonTextWeight] = useState(buttonTextWeight || '600');
  const [localInputTextSize, setLocalInputTextSize] = useState(inputTextSize || '0.875rem');
  const [localInputTextWeight, setLocalInputTextWeight] = useState(inputTextWeight || '400');

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
    if (activeThemeData && !activeThemeData.isCustom) { 
      setCustomPrimary(activeThemeData.seedColors.primary);
      setCustomSecondary(activeThemeData.seedColors.secondary);
      setCustomTertiary(activeThemeData.seedColors.tertiary);
      const headerFont = googleFonts.find(f => f.name === activeThemeData.fonts.display)?.value || `"${activeThemeData.fonts.display}", sans-serif`;
      const bodyFont = googleFonts.find(f => f.name === activeThemeData.fonts.body)?.value || `"${activeThemeData.fonts.body}", sans-serif`;
      setSelectedHeaderFont(headerFont);
      setSelectedBodyFont(bodyFont);
      // Initialize local new settings from predefined theme if applicable (though they don't store these yet)
      // For now, these will just reset to defaults or keep their current context values.
    setLocalCustomLogoUrl(customLogoUrl || ''); 
    setLocalBaseBorderRadius(baseBorderRadius || '8px'); 
    setLocalInputBorderRadius(inputBorderRadius || '4px'); 
    // Initialize local direct color overrides from context when theme changes
    setLocalSecondaryBtnBg(secondaryBtnBg || '');
    setLocalSecondaryBtnText(secondaryBtnText || '');
    setLocalInputFocusBorder(inputFocusBorder || '');
    setLocalNavActiveItemBg(navActiveItemBg || '');
    setLocalNavActiveItemText(navActiveItemText || '');
    // Initialize local typography from context
    setLocalPageTitleSize(pageTitleSize || '2.5rem');
    setLocalPageTitleWeight(pageTitleWeight || '700');
    setLocalButtonTextSize(buttonTextSize || '0.875rem');
    setLocalButtonTextWeight(buttonTextWeight || '600');
    setLocalInputTextSize(inputTextSize || '0.875rem');
    setLocalInputTextWeight(inputTextWeight || '400');
  }
  setLocalBaseFontSize(contextBaseFontSize || 16); 
}, [currentTheme, customLogoUrl, baseBorderRadius, inputBorderRadius, contextBaseFontSize, 
    secondaryBtnBg, secondaryBtnText, inputFocusBorder, navActiveItemBg, navActiveItemText,
    pageTitleSize, pageTitleWeight, buttonTextSize, buttonTextWeight, inputTextSize, inputTextWeight]);

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
    // document.documentElement.style.fontSize = `${baseFontSize}px`;
    // Live update for base font size now handled by App.js useEffect when setContextBaseFontSize is called
  }, []); // Removed baseFontSize dependency, App.js handles it.

  const previewColorKeys = [
    '--theme-primary', '--theme-on-primary', '--theme-primary-container', '--theme-on-primary-container',
    '--theme-secondary', '--theme-on-secondary', '--theme-secondary-container', '--theme-on-secondary-container',
    '--theme-tertiary', '--theme-on-tertiary', '--theme-tertiary-container', '--theme-on-tertiary-container',
    '--theme-background', '--theme-on-background', '--theme-surface', '--theme-on-surface',
    '--theme-surface-variant', '--theme-on-surface-variant', '--theme-outline',
    // Derived colors (can be overridden by direct below if set)
    '--theme-card-header-bg', '--theme-card-header-text',
    '--theme-table-header-bg', '--theme-table-header-text',
    // Direct override custom properties for preview
    '--theme-button-secondary-bg-direct', 
    '--theme-button-secondary-text-direct',
    '--theme-input-focus-border-direct',
    '--theme-nav-active-item-bg-direct',
    '--theme-nav-active-item-text-direct',
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
      baseFontSize: localBaseFontSize, // Use local state for saving
      globalFontWeight: globalFontWeight, 
      isCustom: true,
      // Save new settings
      customLogoUrl: localCustomLogoUrl,
      baseBorderRadius: localBaseBorderRadius,
      inputBorderRadius: localInputBorderRadius,
      uiDensity: uiDensity, 
      secondaryBtnBg_override: localSecondaryBtnBg, 
      secondaryBtnText_override: localSecondaryBtnText,
      inputFocusBorder_override: localInputFocusBorder,
      navActiveItemBg_override: localNavActiveItemBg,
      navActiveItemText_override: localNavActiveItemText,
      // Save new typography settings
      pageTitleSize: localPageTitleSize,
      pageTitleWeight: localPageTitleWeight,
      buttonTextSize: localButtonTextSize,
      buttonTextWeight: localButtonTextWeight,
      inputTextSize: localInputTextSize,
      inputTextWeight: localInputTextWeight,
    };
    setSavedCustomThemes(prevThemes => [...prevThemes, newCustomTheme]);
  };

  const handleApplySavedTheme = (themeToApply) => {
    // Apply seed colors for derivation
    setCustomPrimary(themeToApply.seedColors.primary);
    setCustomSecondary(themeToApply.seedColors.secondary);
    setCustomTertiary(themeToApply.seedColors.tertiary);

    // Apply direct color overrides via context
    setSecondaryBtnBg(themeToApply.secondaryBtnBg_override || '');
    setLocalSecondaryBtnBg(themeToApply.secondaryBtnBg_override || '');
    setSecondaryBtnText(themeToApply.secondaryBtnText_override || '');
    setLocalSecondaryBtnText(themeToApply.secondaryBtnText_override || '');
    setInputFocusBorder(themeToApply.inputFocusBorder_override || '');
    setLocalInputFocusBorder(themeToApply.inputFocusBorder_override || '');
    setNavActiveItemBg(themeToApply.navActiveItemBg_override || '');
    setLocalNavActiveItemBg(themeToApply.navActiveItemBg_override || '');
    setNavActiveItemText(themeToApply.navActiveItemText_override || '');
    setLocalNavActiveItemText(themeToApply.navActiveItemText_override || '');

    // Apply fonts
    const headerFontValue = googleFonts.find(f => f.name === themeToApply.fonts.display)?.value || themeToApply.fonts.display;
    const bodyFontValue = googleFonts.find(f => f.name === themeToApply.fonts.body)?.value || themeToApply.fonts.body;
    setSelectedHeaderFont(headerFontValue);
    setSelectedBodyFont(bodyFontValue);
    
    // Apply base font size via context
    setContextBaseFontSize(themeToApply.baseFontSize); 
    setLocalBaseFontSize(themeToApply.baseFontSize); // also update local state for UI

    // Apply global font weight via context
    setGlobalFontWeight(themeToApply.globalFontWeight);

    // Apply new settings via context
    setCustomLogoUrl(themeToApply.customLogoUrl || '');
    setLocalCustomLogoUrl(themeToApply.customLogoUrl || '');

    setBaseBorderRadius(themeToApply.baseBorderRadius || '8px');
    setLocalBaseBorderRadius(themeToApply.baseBorderRadius || '8px');

    setInputBorderRadius(themeToApply.inputBorderRadius || '4px');
    setLocalInputBorderRadius(themeToApply.inputBorderRadius || '4px');

    // Apply UI density
    setUiDensity(themeToApply.uiDensity || 'default');

    // Apply typography settings
    setPageTitleSize(themeToApply.pageTitleSize || '2.5rem');
    setLocalPageTitleSize(themeToApply.pageTitleSize || '2.5rem');
    setPageTitleWeight(themeToApply.pageTitleWeight || '700');
    setLocalPageTitleWeight(themeToApply.pageTitleWeight || '700');
    setButtonTextSize(themeToApply.buttonTextSize || '0.875rem');
    setLocalButtonTextSize(themeToApply.buttonTextSize || '0.875rem');
    setButtonTextWeight(themeToApply.buttonTextWeight || '600');
    setLocalButtonTextWeight(themeToApply.buttonTextWeight || '600');
    setInputTextSize(themeToApply.inputTextSize || '0.875rem');
    setLocalInputTextSize(themeToApply.inputTextSize || '0.875rem');
    setInputTextWeight(themeToApply.inputTextWeight || '400');
    setLocalInputTextWeight(themeToApply.inputTextWeight || '400');

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
                      <p>Fonts: H: {theme.fonts.display}, B: {theme.fonts.body}</p>
                      <p>Size: {theme.baseFontSize || 'N/A'}px, Weight: {fontWeightOptions.find(fw => fw.value === theme.globalFontWeight)?.label || theme.globalFontWeight}</p>
                      <p>Radii: Base: {theme.baseBorderRadius || 'N/A'}, Input: {theme.inputBorderRadius || 'N/A'}</p>
                      {theme.customLogoUrl && <p>Logo: <img src={theme.customLogoUrl} alt="custom logo preview" style={{height: '20px', verticalAlign: 'middle'}} /></p>}
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
                  {/* New Color Pickers for Direct Overrides */}
                  <FormField
                    controlId="secondaryBtnBg"
                    label="Sec. Button BG"
                    type="color"
                    value={localSecondaryBtnBg}
                    onChange={(e) => { setLocalSecondaryBtnBg(e.target.value); setSecondaryBtnBg(e.target.value); }}
                    title="Secondary Button Background Override"
                    className={styles.colorPickerGroup}
                  />
                  <FormField
                    controlId="secondaryBtnText"
                    label="Sec. Button Text"
                    type="color"
                    value={localSecondaryBtnText}
                    onChange={(e) => { setLocalSecondaryBtnText(e.target.value); setSecondaryBtnText(e.target.value); }}
                    title="Secondary Button Text Override"
                    className={styles.colorPickerGroup}
                  />
                  <FormField
                    controlId="inputFocusBorder"
                    label="Input Focus Border"
                    type="color"
                    value={localInputFocusBorder}
                    onChange={(e) => { setLocalInputFocusBorder(e.target.value); setInputFocusBorder(e.target.value); }}
                    title="Input Focus Border Override"
                    className={styles.colorPickerGroup}
                  />
                  <FormField
                    controlId="navActiveItemBg"
                    label="Nav Active BG"
                    type="color"
                    value={localNavActiveItemBg}
                    onChange={(e) => { setLocalNavActiveItemBg(e.target.value); setNavActiveItemBg(e.target.value); }}
                    title="Nav Active Item Background Override"
                    className={styles.colorPickerGroup}
                  />
                  <FormField
                    controlId="navActiveItemText"
                    label="Nav Active Text"
                    type="color"
                    value={localNavActiveItemText}
                    onChange={(e) => { setLocalNavActiveItemText(e.target.value); setNavActiveItemText(e.target.value); }}
                    title="Nav Active Item Text Override"
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
                <form>
                  {/* Base Font Size */}
                  <FormField
                    controlId="baseFontSize"
                    label="Base Size (px)"
                    type="number"
                    value={localBaseFontSize} // Use local state for input control
                    onChange={(e) => {
                      const newSize = Math.max(10, Math.min(24, Number(e.target.value)));
                      setLocalBaseFontSize(newSize);
                      setContextBaseFontSize(newSize); // Also update context for live preview via App.js
                    }}
                    min="10"
                    max="24"
                    className={styles.fontSizeControlGroup}
                  />
                  {/* Global Font Weight */}
                  <StyledFormGroup controlId="globalFontWeight" className={styles.fontWeightSelectorGroup}>
                    <StyledFormLabel>Global Body Weight</StyledFormLabel>
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

                  {/* Page Title Typography */}
                  <h6 className={styles.typographySubheading}>Page Titles</h6>
                  <FormField controlId="pageTitleSize" label="Size" type="text" placeholder="e.g., 2.5rem" value={localPageTitleSize} onChange={(e) => {setLocalPageTitleSize(e.target.value); setPageTitleSize(e.target.value);}} className={styles.textInputGroup} />
                  <FormField controlId="pageTitleWeight" label="Weight" as="select" value={localPageTitleWeight} onChange={(e) => {setLocalPageTitleWeight(e.target.value); setPageTitleWeight(e.target.value);}} options={fontWeightOptions} className={styles.fontSelectorGroup} />
                  
                  {/* Button Text Typography */}
                  <h6 className={styles.typographySubheading}>Button Text</h6>
                  <FormField controlId="buttonTextSize" label="Size" type="text" placeholder="e.g., 0.875rem" value={localButtonTextSize} onChange={(e) => {setLocalButtonTextSize(e.target.value); setButtonTextSize(e.target.value);}} className={styles.textInputGroup} />
                  <FormField controlId="buttonTextWeight" label="Weight" as="select" value={localButtonTextWeight} onChange={(e) => {setLocalButtonTextWeight(e.target.value); setButtonTextWeight(e.target.value);}} options={fontWeightOptions} className={styles.fontSelectorGroup} />

                  {/* Input Field Text Typography */}
                  <h6 className={styles.typographySubheading}>Input Field Text</h6>
                  <FormField controlId="inputTextSize" label="Size" type="text" placeholder="e.g., 0.875rem" value={localInputTextSize} onChange={(e) => {setLocalInputTextSize(e.target.value); setInputTextSize(e.target.value);}} className={styles.textInputGroup} />
                  <FormField controlId="inputTextWeight" label="Weight" as="select" value={localInputTextWeight} onChange={(e) => {setLocalInputTextWeight(e.target.value); setInputTextWeight(e.target.value);}} options={fontWeightOptions} className={styles.fontSelectorGroup} />
                </form>
              </div>
              <hr/>
              {/* Layout Density Section */}
              <div>
                <h5>Layout Density</h5>
                <StyledFormGroup controlId="uiDensityControl" className={styles.densitySelectorGroup}>
                  <StyledFormLabel>Density</StyledFormLabel>
                  <div className={styles.densityRadioGroup}>
                    {[
                      { label: 'Compact', value: 'compact' },
                      { label: 'Default', value: 'default' },
                      { label: 'Comfort', value: 'comfort' },
                    ].map(d => (
                      <StyledFormCheck
                        type="radio"
                        key={d.value}
                        id={`density-${d.value}`}
                        name="uiDensity"
                        label={d.label}
                        value={d.value}
                        checked={uiDensity === d.value}
                        onChange={() => setUiDensity(d.value)}
                      />
                    ))}
                  </div>
                </StyledFormGroup>
              </div>
              <hr />
              {/* Layout & Style Section */}
              <div>
                <h5>Branding & Borders</h5> {/* Renamed for clarity */}
                <form>
                  <FormField
                    controlId="customLogoUrl"
                    label="Custom Logo URL"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={localCustomLogoUrl}
                    onChange={(e) => {
                      setLocalCustomLogoUrl(e.target.value);
                      setCustomLogoUrl(e.target.value); // Live update via context
                    }}
                    className={styles.textInputGroup}
                  />
                  <FormField
                    controlId="baseBorderRadius"
                    label="Base Border Radius"
                    type="text" // Use text to allow '8px' or '0.5rem' etc.
                    placeholder="e.g., 8px or 0.5rem"
                    value={localBaseBorderRadius}
                    onChange={(e) => {
                      setLocalBaseBorderRadius(e.target.value);
                      setBaseBorderRadius(e.target.value); // Live update via context
                    }}
                    className={styles.textInputGroup}
                  />
                  <FormField
                    controlId="inputBorderRadius"
                    label="Input Border Radius"
                    type="text"
                    placeholder="e.g., 4px or 0.25rem"
                    value={localInputBorderRadius}
                    onChange={(e) => {
                      setLocalInputBorderRadius(e.target.value);
                      setInputBorderRadius(e.target.value); // Live update via context
                    }}
                    className={styles.textInputGroup}
                  />
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
