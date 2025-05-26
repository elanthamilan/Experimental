// Helper to parse hex color string to an array of [r, g, b] values
const hexToRgbArray = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) { // #RGB format
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) { // #RRGGBB format
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return [r, g, b];
};

// Helper to convert hex color to rgba string
const hexToRgba = (hex, opacity) => {
  const [r, g, b] = hexToRgbArray(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper to calculate luminance from a hex color
const getLuminance = (hex) => {
  const [r_srgb, g_srgb, b_srgb] = hexToRgbArray(hex);
  const mapColorComponent = (c) => {
    const srgb = c / 255;
    return (srgb <= 0.03928) ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  const r = mapColorComponent(r_srgb);
  const g = mapColorComponent(g_srgb);
  const b = mapColorComponent(b_srgb);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Helper to calculate contrast ratio between two hex colors
const getContrast = (hex1, hex2) => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

// Helper to get an accessible "On" color
const getAccessibleOnColor = (backgroundHex, darkColorOption = '#1C1B1F', lightColorOption = '#FFFFFF', minContrast = 4.5) => {
  if (!backgroundHex || typeof backgroundHex !== 'string' || !backgroundHex.startsWith('#')) {
    // Default to lightColorOption if backgroundHex is invalid, as it's safer on unknown backgrounds
    return lightColorOption;
  }
  const contrastWithDark = getContrast(backgroundHex, darkColorOption);
  const contrastWithLight = getContrast(backgroundHex, lightColorOption);

  // If both options meet minimum contrast
  if (contrastWithLight >= minContrast && contrastWithDark >= minContrast) {
    const bgLuminance = getLuminance(backgroundHex);
    // Prefer light text on dark backgrounds and dark text on light backgrounds
    // If background is dark (lower luminance), light text is generally preferred if contrast is similar
    if (bgLuminance < 0.5) {
      return contrastWithLight >= contrastWithDark ? lightColorOption : darkColorOption;
    } else { // If background is light (higher luminance), dark text is generally preferred
      return contrastWithDark >= contrastWithLight ? darkColorOption : lightColorOption;
    }
  }
  // If only one option meets minimum contrast
  if (contrastWithLight >= minContrast) return lightColorOption;
  if (contrastWithDark >= minContrast) return darkColorOption;

  // If neither meets minimum contrast, fallback based on background luminance
  // This is a less ideal scenario, aiming for the better of two poor options or a safe default
  const bgLuminance = getLuminance(backgroundHex);
    if (bgLuminance < 0.5) { // Dark background
      return lightColorOption; // Default to light text
    } else { // Light background
      return darkColorOption; // Default to dark text
    }
};

// Helper function to adjust hex color brightness (simulates M3 tones by approximation)
// Positive factor makes it lighter, negative factor makes it darker.
// Factor of 0.6 aims for a very light shade (like M3 tone 90 from tone 40)
// Factor of -0.1 makes it slightly darker.
const adjustHexBrightness = (hex, factor) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
    let [r, g, b] = hexToRgbArray(hex);

    // For making colors lighter (positive factor), we approach white (255)
    // For making colors darker (negative factor), we approach black (0)
    if (factor > 0) {
        r = Math.min(255, Math.max(0, Math.round(r + (255 - r) * factor)));
        g = Math.min(255, Math.max(0, Math.round(g + (255 - g) * factor)));
        b = Math.min(255, Math.max(0, Math.round(b + (255 - b) * factor)));
    } else {
        r = Math.min(255, Math.max(0, Math.round(r * (1 + factor)))); // factor is negative
        g = Math.min(255, Math.max(0, Math.round(g * (1 + factor))));
        b = Math.min(255, Math.max(0, Math.round(b * (1 + factor))));
    }
    const toHex = c => ('0'+c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Mix two colors together with a given ratio
const mixColors = (color1, color2, ratio) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

    const toHex = c => ('0'+c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const generateThemeColors = (primary, secondary, tertiary, isDark = false) => {
  // Material 3 fixed values (Light Theme Defaults)
  const m3Error = '#B3261E';
  const m3OnError = '#FFFFFF';

  // Generate theme-based background and surface colors instead of fixed MD3 values
  // Create backgrounds that are tinted with the primary color for better theme integration
  const baseBackground = isDark ? '#1C1B1F' : '#FFFBFE';
  const baseSurface = isDark ? '#1C1B1F' : '#FFFBFE';

  // Tint backgrounds with primary color for better theme integration
  const m3Background = isDark
    ? adjustHexBrightness(mixColors(baseBackground, primary, 0.05), 0) // Subtle primary tint in dark mode
    : adjustHexBrightness(mixColors(baseBackground, primary, 0.02), 0); // Very subtle primary tint in light mode

  const m3Surface = isDark
    ? adjustHexBrightness(mixColors(baseSurface, primary, 0.08), 0) // Slightly more primary tint for surfaces
    : adjustHexBrightness(mixColors(baseSurface, primary, 0.03), 0);

  const m3OnBackground = isDark ? '#E6E1E5' : '#1C1B1F';
  const m3OnSurface = isDark ? '#E6E1E5' : '#1C1B1F';

  // Create surface variants with more pronounced theme colors
  const m3SurfaceVariant = isDark
    ? adjustHexBrightness(mixColors(m3Surface, secondary, 0.1), 0.05)
    : adjustHexBrightness(mixColors(m3Surface, secondary, 0.05), -0.02);

  const m3OnSurfaceVariant = isDark ? '#CAC4D0' : '#49454F';
  const m3Outline = isDark ? '#938F99' : '#79747E';
  const m3OutlineVariant = isDark ? '#49454F' : '#CAC4D0';
  // Inverse colors for light theme (dark on light)
  const m3InverseSurface = isDark ? '#E6E1E5' : '#313033'; // Darker for light theme
  const m3InverseOnSurface = isDark ? '#313033' : '#F4EFF4'; // Lighter for light theme
  const m3InversePrimarySeed = primary; // Use primary seed for inverse primary generation

  // Calculate "On" colors
  const onPrimary = getAccessibleOnColor(primary);
  const onSecondary = getAccessibleOnColor(secondary);
  const onTertiary = getAccessibleOnColor(tertiary);

  // Calculate Container colors (approximating M3 Tone 90 for light themes)
  const primaryContainerFactor = isDark ? -0.6 : 0.75; // Darker for dark, much lighter for light
  const secondaryContainerFactor = isDark ? -0.6 : 0.75;
  const tertiaryContainerFactor = isDark ? -0.6 : 0.75;
  const errorContainerFactor = isDark ? -0.6 : 0.85; // Error container is often very light (Tone 90)

  const primaryContainer = adjustHexBrightness(primary, primaryContainerFactor);
  const onPrimaryContainer = getAccessibleOnColor(primaryContainer);
  const secondaryContainer = adjustHexBrightness(secondary, secondaryContainerFactor);
  const onSecondaryContainer = getAccessibleOnColor(secondaryContainer);
  const tertiaryContainer = adjustHexBrightness(tertiary, tertiaryContainerFactor);
  const onTertiaryContainer = getAccessibleOnColor(tertiaryContainer);
  const errorContainer = adjustHexBrightness(m3Error, errorContainerFactor);
  const onErrorContainer = getAccessibleOnColor(errorContainer, '#FFFFFF', '#141211'); // Specific dark option for error container

  // Inverse Primary (approximating M3 Tone 80 for light themes on dark inverse surface)
  const inversePrimary = adjustHexBrightness(m3InversePrimarySeed, isDark ? 0.6 : 0.3); // Lighter for light theme, even lighter for dark theme (as seed is darker)
  const onInversePrimary = getAccessibleOnColor(inversePrimary);


  return {
    '--theme-primary': primary,
    '--theme-on-primary': onPrimary,
    '--theme-primary-container': primaryContainer,
    '--theme-on-primary-container': onPrimaryContainer,

    '--theme-secondary': secondary,
    '--theme-on-secondary': onSecondary,
    '--theme-secondary-container': secondaryContainer,
    '--theme-on-secondary-container': onSecondaryContainer,

    '--theme-tertiary': tertiary,
    '--theme-on-tertiary': onTertiary,
    '--theme-tertiary-container': tertiaryContainer,
    '--theme-on-tertiary-container': onTertiaryContainer,

    '--theme-error': m3Error,
    '--theme-on-error': m3OnError,
    '--theme-error-container': errorContainer,
    '--theme-on-error-container': onErrorContainer,

    '--theme-background': m3Background,
    '--theme-on-background': m3OnBackground,
    '--theme-surface': m3Surface,
    '--theme-on-surface': m3OnSurface,
    '--theme-surface-variant': m3SurfaceVariant,
    '--theme-on-surface-variant': m3OnSurfaceVariant,

    '--theme-surface-tint': primary, // Surface tint is the same as primary

    '--theme-outline': m3Outline,
    '--theme-outline-variant': m3OutlineVariant,

    '--theme-inverse-primary': inversePrimary,
    '--theme-inverse-on-primary': onInversePrimary, // Placeholder, usually derived from inversePrimary
    '--theme-inverse-surface': m3InverseSurface,
    '--theme-inverse-on-surface': m3InverseOnSurface,

    // Additional useful variables from previous setup, mapped to new M3 if possible or kept if distinct
    '--theme-text-color-primary': m3OnSurface, // Usually onSurface
    '--theme-text-color-secondary': m3OnSurfaceVariant, // Usually onSurfaceVariant
    '--theme-text-color-link': primary, // Links are often primary color

    // Specific UI element backgrounds - these might need more context or could use surface/background variants
    // For simplicity, using surface variants or background. Re-evaluate if specific colors are needed.
    '--theme-sidebar-background': adjustHexBrightness(mixColors(m3Surface, secondary, 0.03), isDark ? 0.02 : -0.01), // Slightly off from main surface with secondary tint
    '--theme-search-criteria-form-bg': adjustHexBrightness(mixColors(m3Surface, tertiary, 0.02), isDark ? 0.03 : -0.02),
    '--theme-input-bg': m3Surface, // Inputs on main surface
    '--theme-dropdown-bg': adjustHexBrightness(mixColors(m3Surface, primary, 0.02), isDark ? 0.05 : -0.03), // Dropdowns slightly different with primary tint

    // Additional theme variables for better coverage with enhanced theme integration
    '--theme-app-background': m3Background, // Main app background (now theme-tinted)
    '--theme-content-background': m3Surface, // Content area background (now theme-tinted)
    '--theme-table-header-bg': adjustHexBrightness(mixColors(m3Surface, primary, 0.05), isDark ? 0.04 : -0.02), // Table headers with primary tint
    '--theme-table-hover-bg': adjustHexBrightness(primary, isDark ? 0.85 : 0.95), // Table row hover
    '--theme-table-stripe-bg': adjustHexBrightness(mixColors(m3Surface, secondary, 0.01), isDark ? 0.02 : -0.01), // Table striped rows with subtle secondary tint
    '--theme-border-color': m3Outline, // General borders
    '--theme-text-color': m3OnSurface, // General text
    '--theme-text-muted': m3OnSurfaceVariant, // Muted text
    '--theme-navbar-bg': adjustHexBrightness(mixColors(m3Surface, primary, 0.03), isDark ? 0.01 : -0.005), // Navigation bar background with primary tint
    '--theme-toolbar-bg': adjustHexBrightness(mixColors(m3Surface, secondary, 0.02), isDark ? 0.015 : -0.008), // Toolbar background with secondary tint

    // Hover and Active states - these should ideally use rgba over existing colors for subtlety
    '--theme-background-hover': hexToRgba(primary, 0.08), // M3 state layer opacity for hover
    '--theme-background-active': hexToRgba(primary, 0.12), // M3 state layer opacity for active/focus
  };
};

export const themes = [
  // Category 1: Vibrant & Energetic
  {
    id: "vibrant-electric-blue",
    name: "Electric Blue",
    seedColors: { primary: "#0066FF", secondary: "#FF6B35", tertiary: "#FFD23F" },
    fonts: { display: "Inter", body: "Roboto" },
    vibe: "Electric, modern, and high-energy."
  },
  {
    id: "vibrant-sunset-orange",
    name: "Sunset Orange",
    seedColors: { primary: "#FF4500", secondary: "#8A2BE2", tertiary: "#00CED1" },
    fonts: { display: "Raleway", body: "Open Sans" },
    vibe: "Warm, energetic, and creative."
  },
  {
    id: "vibrant-emerald-green",
    name: "Emerald Green",
    seedColors: { primary: "#00C851", secondary: "#FF3547", tertiary: "#007BFF" },
    fonts: { display: "IBM Plex Sans", body: "IBM Plex Serif" },
    vibe: "Fresh, natural, and vibrant."
  },
  {
    id: "vibrant-royal-purple",
    name: "Royal Purple",
    seedColors: { primary: "#6A1B9A", secondary: "#FF9800", tertiary: "#4CAF50" },
    fonts: { display: "Source Sans Pro", body: "Source Serif Pro" },
    vibe: "Regal, luxurious, and bold."
  },
  {
    id: "vibrant-hot-pink",
    name: "Hot Pink",
    seedColors: { primary: "#E91E63", secondary: "#00BCD4", tertiary: "#8BC34A" },
    fonts: { display: "Merriweather", body: "Lato" },
    vibe: "Playful, modern, and attention-grabbing."
  },

  // Category 2: Ocean & Sky
  {
    id: "ocean-deep-blue",
    name: "Ocean Deep",
    seedColors: { primary: "#003F7F", secondary: "#00D4AA", tertiary: "#FFB74D" },
    fonts: { display: "Montserrat", body: "Noto Sans" },
    vibe: "Deep, calming, and professional."
  },
  {
    id: "ocean-turquoise",
    name: "Turquoise Wave",
    seedColors: { primary: "#00ACC1", secondary: "#FF7043", tertiary: "#9C27B0" },
    fonts: { display: "Quicksand", body: "Roboto" },
    vibe: "Refreshing, tropical, and modern."
  },
  {
    id: "ocean-navy-coral",
    name: "Navy & Coral",
    seedColors: { primary: "#1A237E", secondary: "#FF5722", tertiary: "#FFEB3B" },
    fonts: { display: "Work Sans", body: "Open Sans" },
    vibe: "Classic nautical with warm accents."
  },
  {
    id: "sky-azure",
    name: "Azure Sky",
    seedColors: { primary: "#2196F3", secondary: "#FF9800", tertiary: "#E91E63" },
    fonts: { display: "Nunito Sans", body: "Lora" },
    vibe: "Bright, optimistic, and airy."
  },
  {
    id: "sky-sunset",
    name: "Sunset Sky",
    seedColors: { primary: "#FF5722", secondary: "#673AB7", tertiary: "#00BCD4" },
    fonts: { display: "Rubik", body: "PT Sans" },
    vibe: "Warm, dramatic, and inspiring."
  },

  // Category 3: Nature & Earth
  {
    id: "nature-forest-green",
    name: "Forest Green",
    seedColors: { primary: "#2E7D32", secondary: "#D84315", tertiary: "#F57C00" },
    fonts: { display: "Playfair Display", body: "Libre Baskerville" },
    vibe: "Natural, grounded, and organic."
  },
  {
    id: "nature-autumn-red",
    name: "Autumn Red",
    seedColors: { primary: "#C62828", secondary: "#FF8F00", tertiary: "#388E3C" },
    fonts: { display: "Cinzel", body: "Crimson Pro" },
    vibe: "Warm, seasonal, and rich."
  },
  {
    id: "nature-earth-brown",
    name: "Earth Brown",
    seedColors: { primary: "#5D4037", secondary: "#FF6F00", tertiary: "#1976D2" },
    fonts: { display: "Cormorant Garamond", body: "Lato" },
    vibe: "Earthy, stable, and natural."
  },
  {
    id: "nature-sage-green",
    name: "Sage Green",
    seedColors: { primary: "#689F38", secondary: "#E65100", tertiary: "#7B1FA2" },
    fonts: { display: "Source Serif Pro", body: "Source Sans Pro" },
    vibe: "Calming, herbal, and peaceful."
  },
  {
    id: "nature-golden-yellow",
    name: "Golden Yellow",
    seedColors: { primary: "#F57F17", secondary: "#1565C0", tertiary: "#C2185B" },
    fonts: { display: "Fira Sans", body: "Roboto Serif" },
    vibe: "Sunny, optimistic, and energizing."
  },

  // Category 4: Neon & Tech
  {
    id: "neon-cyber-green",
    name: "Cyber Green",
    seedColors: { primary: "#00FF41", secondary: "#FF0080", tertiary: "#0080FF" },
    fonts: { display: "Oswald", body: "Roboto Condensed" },
    vibe: "Futuristic, high-tech, and electric."
  },
  {
    id: "neon-electric-purple",
    name: "Electric Purple",
    seedColors: { primary: "#8A2BE2", secondary: "#00FFFF", tertiary: "#FF4500" },
    fonts: { display: "Anton", body: "Montserrat" },
    vibe: "Bold, digital, and striking."
  },
  {
    id: "neon-laser-red",
    name: "Laser Red",
    seedColors: { primary: "#FF073A", secondary: "#39FF14", tertiary: "#1B03A3" },
    fonts: { display: "Poppins", body: "Open Sans" },
    vibe: "Intense, gaming, and energetic."
  },
  {
    id: "neon-matrix-blue",
    name: "Matrix Blue",
    seedColors: { primary: "#0099FF", secondary: "#FF6600", tertiary: "#CC00FF" },
    fonts: { display: "Raleway", body: "Inter" },
    vibe: "Digital, modern, and sleek."
  },
  {
    id: "neon-synthwave",
    name: "Synthwave",
    seedColors: { primary: "#FF00FF", secondary: "#00FFFF", tertiary: "#FFFF00" },
    fonts: { display: "Fredoka", body: "Nunito Sans" },
    vibe: "Retro-futuristic, vibrant, and nostalgic."
  },

  // Category 5: Pastel & Soft
  {
    id: "pastel-lavender",
    name: "Lavender Dreams",
    seedColors: { primary: "#9C88FF", secondary: "#FFB3BA", tertiary: "#BAFFC9" },
    fonts: { display: "Noto Serif Display", body: "Noto Sans" },
    vibe: "Soft, dreamy, and gentle."
  },
  {
    id: "pastel-mint",
    name: "Mint Fresh",
    seedColors: { primary: "#98FB98", secondary: "#FFB6C1", tertiary: "#DDA0DD" },
    fonts: { display: "Lora", body: "Open Sans" },
    vibe: "Fresh, clean, and soothing."
  },
  {
    id: "pastel-peach",
    name: "Peach Sunset",
    seedColors: { primary: "#FFCBA4", secondary: "#B4A7D6", tertiary: "#A8E6CF" },
    fonts: { display: "Arvo", body: "Cabin" },
    vibe: "Warm, comforting, and peaceful."
  },
  {
    id: "pastel-sky",
    name: "Sky Blue",
    seedColors: { primary: "#87CEEB", secondary: "#F0E68C", tertiary: "#DDA0DD" },
    fonts: { display: "Bitter", body: "EB Garamond" },
    vibe: "Airy, light, and calming."
  },
  {
    id: "pastel-rose",
    name: "Rose Garden",
    seedColors: { primary: "#FFB6C1", secondary: "#98FB98", tertiary: "#F0E68C" },
    fonts: { display: "Comfortaa", body: "Lato" },
    vibe: "Romantic, soft, and elegant."
  },

  // Category 6: Dark & Dramatic
  {
    id: "dark-midnight",
    name: "Midnight Black",
    seedColors: { primary: "#000000", secondary: "#FF6B35", tertiary: "#00D4AA" },
    fonts: { display: "Inter", body: "Source Sans Pro" },
    vibe: "Bold, dramatic, and sophisticated."
  },
  {
    id: "dark-charcoal",
    name: "Charcoal Storm",
    seedColors: { primary: "#36454F", secondary: "#FF4081", tertiary: "#FFD700" },
    fonts: { display: "Lora", body: "Open Sans" },
    vibe: "Strong, modern, and impactful."
  },
  {
    id: "dark-burgundy",
    name: "Burgundy Wine",
    seedColors: { primary: "#800020", secondary: "#FFD700", tertiary: "#00CED1" },
    fonts: { display: "Roboto", body: "Noto Sans" },
    vibe: "Rich, luxurious, and elegant."
  },
  {
    id: "dark-forest",
    name: "Dark Forest",
    seedColors: { primary: "#013220", secondary: "#FF8C00", tertiary: "#DA70D6" },
    fonts: { display: "Merriweather Sans", body: "Merriweather" },
    vibe: "Mysterious, natural, and deep."
  },
  {
    id: "dark-royal",
    name: "Royal Navy",
    seedColors: { primary: "#002147", secondary: "#FFD700", tertiary: "#DC143C" },
    fonts: { display: "Raleway", body: "Montserrat" },
    vibe: "Regal, authoritative, and classic."
  }
];

// Font weight options for theme customization
export const fontWeightOptions = [
  { value: 'light', label: 'Light', cssValue: '300' },
  { value: 'normal', label: 'Normal', cssValue: '400' },
  { value: 'medium', label: 'Medium', cssValue: '500' },
  { value: 'semibold', label: 'Semi Bold', cssValue: '600' },
  { value: 'bold', label: 'Bold', cssValue: '700' },
  { value: 'extrabold', label: 'Extra Bold', cssValue: '800' }
];

// Font size options for header and body text
export const fontSizeOptions = [
  { value: 'xs', label: 'Extra Small', cssValue: '0.75rem' },
  { value: 'sm', label: 'Small', cssValue: '0.875rem' },
  { value: 'base', label: 'Base', cssValue: '1rem' },
  { value: 'lg', label: 'Large', cssValue: '1.125rem' },
  { value: 'xl', label: 'Extra Large', cssValue: '1.25rem' },
  { value: '2xl', label: '2X Large', cssValue: '1.5rem' },
  { value: '3xl', label: '3X Large', cssValue: '1.875rem' }
];

export const applyTheme = (themeId, isDark = false) => { // Added isDark parameter with a default
  const selectedTheme = themes.find(t => t.id === themeId) || themes[0];

  if (selectedTheme && selectedTheme.seedColors) {
    const { primary, secondary, tertiary } = selectedTheme.seedColors;
    // isDark is now passed as a parameter
    const fullPalette = generateThemeColors(primary, secondary, tertiary, isDark);

    for (const colorVar in fullPalette) {
      document.documentElement.style.setProperty(colorVar, fullPalette[colorVar]);
    }
  }

  if (selectedTheme && selectedTheme.fonts) {
    document.documentElement.style.setProperty('--theme-font-display', `"${selectedTheme.fonts.display}", sans-serif`);
    document.documentElement.style.setProperty('--theme-font-body', `"${selectedTheme.fonts.body}", sans-serif`);
  }
};
