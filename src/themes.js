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

export const generateThemeColors = (primary, secondary, tertiary, isDark = false) => {
  // Material 3 fixed values (Light Theme Defaults)
  const m3Error = '#B3261E';
  const m3OnError = '#FFFFFF';
  const m3Background = isDark ? '#1C1B1F' : '#FFFBFE'; // Example dark mode background
  const m3OnBackground = isDark ? '#E6E1E5' : '#1C1B1F';
  const m3Surface = isDark ? '#1C1B1F' : '#FFFBFE'; // Example dark mode surface
  const m3OnSurface = isDark ? '#E6E1E5' : '#1C1B1F';
  const m3SurfaceVariant = isDark ? '#49454F' : '#E7E0EC';
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
    '--theme-sidebar-background': adjustHexBrightness(m3Surface, isDark ? 0.02 : -0.01), // Slightly off from main surface
    '--theme-search-criteria-form-bg': adjustHexBrightness(m3Surface, isDark ? 0.03 : -0.02),
    '--theme-input-bg': m3Surface, // Inputs on main surface
    '--theme-dropdown-bg': adjustHexBrightness(m3Surface, isDark ? 0.05 : -0.03), // Dropdowns slightly different

    // Hover and Active states - these should ideally use rgba over existing colors for subtlety
    '--theme-background-hover': hexToRgba(primary, 0.08), // M3 state layer opacity for hover
    '--theme-background-active': hexToRgba(primary, 0.12), // M3 state layer opacity for active/focus
  };
};

export const themes = [
  // Category 1: Corporate & Authoritative
  {
    id: "corporate-deep-teal",
    name: "Corporate - Deep Teal",
    seedColors: { primary: "#006C74", secondary: "#4C6268", tertiary: "#6A5C78" },
    fonts: { display: "Inter", body: "Roboto" },
    vibe: "Professional, trustworthy, and modern."
  },
  {
    id: "corporate-dark-cyan",
    name: "Corporate - Dark Cyan",
    seedColors: { primary: "#006874", secondary: "#516067", tertiary: "#7F5800" },
    fonts: { display: "Raleway", body: "Open Sans" },
    vibe: "Stable, dependable, and efficient."
  },
  {
    id: "corporate-deep-navy",
    name: "Corporate - Deep Navy",
    seedColors: { primary: "#3C4A6B", secondary: "#6C5D6F", tertiary: "#5C7C7F" },
    fonts: { display: "IBM Plex Sans", body: "IBM Plex Serif" },
    vibe: "Bold, structured, and high-tech."
  },
  {
    id: "corporate-dark-slate-gray",
    name: "Corporate - Dark Slate Gray",
    seedColors: { primary: "#2E3D4F", secondary: "#6C5E50", tertiary: "#5C6B67" },
    fonts: { display: "Source Sans Pro", body: "Source Serif Pro" },
    vibe: "Refined, strong, and composed."
  },
  {
    id: "corporate-forest-green",
    name: "Corporate - Forest Green",
    seedColors: { primary: "#006B5F", secondary: "#5F6260", tertiary: "#7C5700" },
    fonts: { display: "Merriweather", body: "Lato" },
    vibe: "Classic, formal, and highly readable."
  },

  // Category 2: Modern & Accessible
  {
    id: "modern-vivid-blue",
    name: "Modern - Vivid Blue",
    seedColors: { primary: "#006E88", secondary: "#526066", tertiary: "#7C5700" },
    fonts: { display: "Montserrat", body: "Noto Sans" },
    vibe: "Clean, approachable, and user-friendly."
  },
  {
    id: "modern-deep-purple",
    name: "Modern - Deep Purple",
    seedColors: { primary: "#6750A4", secondary: "#6C5D4B", tertiary: "#006B5C" },
    fonts: { display: "Quicksand", body: "Roboto" },
    vibe: "Bright, optimistic, and clear."
  },
  {
    id: "modern-emerald-green",
    name: "Modern - Emerald Green",
    seedColors: { primary: "#006D41", secondary: "#606259", tertiary: "#695E7C" },
    fonts: { display: "Work Sans", body: "Open Sans" },
    vibe: "Fresh, open, and efficient."
  },
  {
    id: "modern-olive-green",
    name: "Modern - Olive Green",
    seedColors: { primary: "#7A7200", secondary: "#6E5C4E", tertiary: "#5C615F" },
    fonts: { display: "Nunito Sans", body: "Lora" },
    vibe: "Soft, harmonious, and inviting."
  },
  {
    id: "modern-bright-orange",
    name: "Modern - Bright Orange",
    seedColors: { primary: "#C95200", secondary: "#6C615C", tertiary: "#006E5D" },
    fonts: { display: "Rubik", body: "PT Sans" },
    vibe: "Lively, modern, and engaging."
  },

  // Category 3: Elegant & Sophisticated
  {
    id: "elegant-deep-lavender",
    name: "Elegant - Deep Lavender",
    seedColors: { primary: "#6750A4", secondary: "#6C5D4B", tertiary: "#5C6466" },
    fonts: { display: "Playfair Display", body: "Libre Baskerville" },
    vibe: "Luxurious, classic, and refined."
  },
  {
    id: "elegant-deep-wine",
    name: "Elegant - Deep Wine",
    seedColors: { primary: "#6A0E3D", secondary: "#6C5D4B", tertiary: "#5C615D" },
    fonts: { display: "Cinzel", body: "Crimson Pro" },
    vibe: "Timeless, graceful, and artistic."
  },
  {
    id: "elegant-deep-cyan",
    name: "Elegant - Deep Cyan",
    seedColors: { primary: "#005C6B", secondary: "#665C59", tertiary: "#6C6A52" },
    fonts: { display: "Cormorant Garamond", body: "Lato" },
    vibe: "Minimalistic chic, airy, and sharp."
  },
  {
    id: "elegant-charcoal-gray",
    name: "Elegant - Charcoal Gray",
    seedColors: { primary: "#5B5B5B", secondary: "#6C5C50", tertiary: "#5C625A" },
    fonts: { display: "Source Serif Pro", body: "Source Sans Pro" },
    vibe: "Understated, poised, and professional."
  },
  {
    id: "elegant-indigo",
    name: "Elegant - Indigo",
    seedColors: { primary: "#303F9F", secondary: "#6D5D4B", tertiary: "#6C5D6F" },
    fonts: { display: "Fira Sans", body: "Roboto Serif" },
    vibe: "Regal, deep, and subtly opulent."
  },

  // Category 4: Dynamic & Impactful
  {
    id: "dynamic-vibrant-red",
    name: "Dynamic - Vibrant Red",
    seedColors: { primary: "#D32F2F", secondary: "#5E615D", tertiary: "#006C7A" },
    fonts: { display: "Oswald", body: "Roboto Condensed" },
    vibe: "Strong, energetic, and clear."
  },
  {
    id: "dynamic-dark-forest-green",
    name: "Dynamic - Dark Forest Green",
    seedColors: { primary: "#004D40", secondary: "#7C5200", tertiary: "#7F5E51" },
    fonts: { display: "Anton", body: "Montserrat" },
    vibe: "Edgy, urban, and assertive."
  },
  {
    id: "dynamic-deep-amethyst",
    name: "Dynamic - Deep Amethyst",
    seedColors: { primary: "#673AB7", secondary: "#C95200", tertiary: "#006D6B" },
    fonts: { display: "Poppins", body: "Open Sans" },
    vibe: "Expressive, vibrant, and engaging."
  },
  {
    id: "dynamic-off-black",
    name: "Dynamic - Off-Black",
    seedColors: { primary: "#212121", secondary: "#6C615C", tertiary: "#006C88" },
    fonts: { display: "Raleway", body: "Inter" },
    vibe: "Powerful, architectural, and striking."
  },
  {
    id: "dynamic-hot-pink",
    name: "Dynamic - Hot Pink",
    seedColors: { primary: "#FF4081", secondary: "#006C6A", tertiary: "#7C5200" },
    fonts: { display: "Fredoka", body: "Nunito Sans" },
    vibe: "Youthful, lively, and engaging."
  },

  // Category 5: Earthy & Organic
  {
    id: "earthy-bright-green",
    name: "Earthy - Bright Green",
    seedColors: { primary: "#4CAF50", secondary: "#5E615D", tertiary: "#6C5D4B" },
    fonts: { display: "Noto Serif Display", body: "Noto Sans" },
    vibe: "Tranquil, natural, and inviting."
  },
  {
    id: "earthy-sky-blue",
    name: "Earthy - Sky Blue",
    seedColors: { primary: "#2196F3", secondary: "#5E615D", tertiary: "#7A6A5E" },
    fonts: { display: "Lora", body: "Open Sans" },
    vibe: "Calm, oceanic, and refreshing."
  },
  {
    id: "earthy-burnt-sienna",
    name: "Earthy - Burnt Sienna",
    seedColors: { primary: "#E64A19", secondary: "#6C5D4B", tertiary: "#5C625A" },
    fonts: { display: "Arvo", body: "Cabin" },
    vibe: "Desert, warm, and grounded."
  },
  {
    id: "earthy-pine-green",
    name: "Earthy - Pine Green",
    seedColors: { primary: "#388E3C", secondary: "#6C5D4B", tertiary: "#6C6A52" },
    fonts: { display: "Bitter", body: "EB Garamond" },
    vibe: "Forest, deep, and harmonious."
  },
  {
    id: "earthy-cerulean-blue",
    name: "Earthy - Cerulean Blue",
    seedColors: { primary: "#0288D1", secondary: "#6C6A52", tertiary: "#7C5E00" },
    fonts: { display: "Comfortaa", body: "Lato" },
    vibe: "Sky, expansive, and hopeful."
  },

  // Category 6: Subtle & Sophisticated Neutrals
  {
    id: "neutral-muted-blue-gray",
    name: "Neutral - Muted Blue Gray",
    seedColors: { primary: "#5A6B70", secondary: "#6C5D4B", tertiary: "#7C5700" },
    fonts: { display: "Inter", body: "Source Sans Pro" },
    vibe: "Clean, minimalist, and adaptable."
  },
  {
    id: "neutral-warm-gray-brown",
    name: "Neutral - Warm Gray-Brown",
    seedColors: { primary: "#6F6260", secondary: "#5C6B67", tertiary: "#6C5D7D" },
    fonts: { display: "Lora", body: "Open Sans" },
    vibe: "Warm, inviting, and understated."
  },
  {
    id: "neutral-deep-cool-gray",
    name: "Neutral - Deep Cool Gray",
    seedColors: { primary: "#4D4F5A", secondary: "#6C615C", tertiary: "#006C74" },
    fonts: { display: "Roboto", body: "Noto Sans" },
    vibe: "Crisp, professional, and versatile."
  },
  {
    id: "neutral-olive-gray",
    name: "Neutral - Olive Gray",
    seedColors: { primary: "#625F56", secondary: "#526066", tertiary: "#7F5E00" },
    fonts: { display: "Merriweather Sans", body: "Merriweather" },
    vibe: "Earthy, grounded, and clean."
  },
  {
    id: "neutral-warm-gray",
    name: "Neutral - Warm Gray",
    seedColors: { primary: "#7A6A5E", secondary: "#5C6B67", tertiary: "#6C5D7D" },
    fonts: { display: "Raleway", body: "Montserrat" },
    vibe: "Muted, modern, and highly adaptable."
  }
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
