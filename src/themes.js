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
    return lightColorOption; 
  }
  const contrastWithDark = getContrast(backgroundHex, darkColorOption);
  const contrastWithLight = getContrast(backgroundHex, lightColorOption);

  if (contrastWithLight >= minContrast && contrastWithDark >= minContrast) {
    const bgLuminance = getLuminance(backgroundHex);
    if (bgLuminance < 0.5) { 
      return contrastWithLight >= contrastWithDark ? lightColorOption : darkColorOption;
    } else { 
      return contrastWithDark >= contrastWithLight ? darkColorOption : lightColorOption;
    }
  }
  if (contrastWithLight >= minContrast) return lightColorOption;
  if (contrastWithDark >= minContrast) return darkColorOption;
  
  const bgLuminance = getLuminance(backgroundHex);
    if (bgLuminance < 0.5) {
      return lightColorOption; 
    } else {
      return darkColorOption; 
    }
};

// Helper function to adjust hex color brightness
const adjustHexBrightness = (hex, factor) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex; 
    let [r, g, b] = hexToRgbArray(hex);
    r = Math.min(255, Math.max(0, Math.round(r * (1 + factor))));
    g = Math.min(255, Math.max(0, Math.round(g * (1 + factor))));
    b = Math.min(255, Math.max(0, Math.round(b * (1 + factor))));
    const toHex = c => ('0'+c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const baseProperties = {
  '--theme-error': '#B3261E',
  '--theme-on-error': '#FFFFFF',
  '--theme-text-color-primary': 'var(--theme-on-surface)',
  '--theme-text-color-secondary': 'var(--theme-on-surface-variant)',
};

const generateThemeColors = (
  primary, secondary, tertiary, 
  primaryContainer, onPrimaryContainer, 
  secondaryContainer, onSecondaryContainer, 
  tertiaryContainer, onTertiaryContainer, 
  appBg, contentBg, sidebarBg, searchFormBg,
  isDark = false,
  customOutline = null, customOutlineVariant = null,
  customErrorContainer = null, customOnErrorContainer = null,
  customInputBg = null, customDropdownBg = null 
) => {
  const onPrimary = getAccessibleOnColor(primary, '#1C1B1F', '#FFFFFF', 7.0); 
  const onSecondary = getAccessibleOnColor(secondary);
  const onTertiary = getAccessibleOnColor(tertiary);

  const defaultDarkText = '#1C1B1F';
  const defaultLightText = '#FFFFFF';
  const secondaryTextForLightBg = '#444746'; 
  const secondaryTextForDarkBg = '#B0B0B0';

  const onAppBg = getAccessibleOnColor(appBg, defaultDarkText, defaultLightText, 7.0);
  const onContentBg = getAccessibleOnColor(contentBg, defaultDarkText, defaultLightText, 7.0);
  const onContentBgVariant = getAccessibleOnColor(
    contentBg, 
    isDark ? secondaryTextForDarkBg : secondaryTextForLightBg, 
    isDark ? defaultDarkText : defaultLightText, 
    4.5
  );
  
  const sidebarTextColor = getAccessibleOnColor(sidebarBg, defaultDarkText, defaultLightText, 7.0);
  const sidebarIconColor = getAccessibleOnColor(
    sidebarBg, 
    isDark ? secondaryTextForDarkBg : secondaryTextForLightBg, 
    isDark ? defaultDarkText : defaultLightText, 
    4.5
  );
  
  const effectiveDropdownBg = customDropdownBg || contentBg;
  const dropdownTextColor = getAccessibleOnColor(effectiveDropdownBg, defaultDarkText, defaultLightText, 4.5);

  let surfaceContainerLowest, surfaceContainerLow, surfaceContainer, surfaceContainerHigh, surfaceContainerHighest;
  if (isDark) { // This block will not be hit as all themes are light now
    surfaceContainerLowest = adjustHexBrightness(contentBg, 0.05); 
    surfaceContainerLow = adjustHexBrightness(contentBg, 0.08);    
    surfaceContainer = adjustHexBrightness(contentBg, 0.11);       
    surfaceContainerHigh = adjustHexBrightness(contentBg, 0.14);   
    surfaceContainerHighest = adjustHexBrightness(contentBg, 0.17);
  } else {
    surfaceContainerLowest = '#FFFFFF'; 
    if (contentBg && contentBg.toUpperCase() === '#FFFFFF') {
        surfaceContainerLowest = '#F8F9FA'; 
    } else if (contentBg) {
        surfaceContainerLowest = adjustHexBrightness(contentBg, 0.02); 
    } else {
        surfaceContainerLowest = '#F8F9FA'; 
    }
    surfaceContainerLow = contentBg ? adjustHexBrightness(contentBg, -0.02) : '#F0F0F0'; 
    surfaceContainer = contentBg ? adjustHexBrightness(contentBg, -0.04) : '#EAEAEA';    
    surfaceContainerHigh = contentBg ? adjustHexBrightness(contentBg, -0.06) : '#E0E0E0';  
    surfaceContainerHighest = contentBg ? adjustHexBrightness(contentBg, -0.08) : '#D9D9D9'; 
  }

  return {
    ...baseProperties,
    '--theme-background': appBg,
    '--theme-on-background': onAppBg,
    '--theme-surface': contentBg, 
    '--theme-on-surface': onContentBg,
    '--theme-on-surface-variant': onContentBgVariant,

    '--theme-surface-container-lowest': surfaceContainerLowest,
    '--theme-surface-container-low': surfaceContainerLow,
    '--theme-surface-container': surfaceContainer,
    '--theme-surface-container-high': surfaceContainerHigh,
    '--theme-surface-container-highest': surfaceContainerHighest,
    
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
    
    '--theme-primary-brand-color': primary,
    '--theme-secondary-brand-color': secondary,
    '--theme-accent-color': tertiary,
    '--theme-text-color-on-primary': onPrimary,
    '--theme-text-color-on-secondary': onSecondary,
    '--theme-text-color-on-tertiary': onTertiary,
    '--theme-text-color-link': primary,
    '--theme-background-app': appBg,
    '--theme-background-content': contentBg,
    '--theme-background-hover': hexToRgba(primary, 0.08),
    '--theme-background-active': hexToRgba(primary, 0.12),
    
    '--theme-sidebar-background': sidebarBg,
    '--theme-sidebar-text-color': sidebarTextColor,
    '--theme-sidebar-icon-color': sidebarIconColor,
    
    '--theme-sidebar-nav-item-hover-bg': hexToRgba(primary, 0.08),
    '--theme-sidebar-nav-item-active-text-color': onPrimaryContainer,
    '--theme-sidebar-nav-item-active-bg': primaryContainer,
    '--theme-sidebar-nav-item-active-border-color': primary,
    
    '--theme-button-primary-bg': primary,
    '--theme-button-primary-text': onPrimary,
    '--theme-button-primary-hover-bg': hexToRgba(primary, 0.88), 
    '--theme-button-secondary-bg': secondaryContainer,
    '--theme-button-secondary-text': onSecondaryContainer,
    '--theme-button-secondary-hover-bg': hexToRgba(secondaryContainer, 0.88),
    '--theme-primary-container-hover-bg': adjustHexBrightness(primaryContainer, -0.05),
    
    '--theme-primary-brand-color-hover': hexToRgba(primary, 0.88),
    '--theme-link-hover-color': hexToRgba(primary, 0.8),
    '--theme-button-link-hover-bg': hexToRgba(primary, 0.08),
    '--theme-selected-row-hover-bg': hexToRgba(primary, 0.07),
    '--theme-dropzone-hover-border-color': hexToRgba(primary, 0.5),
    '--theme-dropzone-accept-border-color': secondary,
    '--theme-dropzone-accept-bg-color': hexToRgba(secondary, 0.1),
    
    '--theme-utility-sidebar-bg': sidebarBg, 
    '--theme-search-criteria-form-bg': searchFormBg, 
    '--theme-input-bg': customInputBg || '#FFFFFF',
    '--theme-dropdown-bg': effectiveDropdownBg, 
    '--theme-dropdown-text-color': dropdownTextColor,

    '--theme-outline': customOutline || '#79747E',
    '--theme-outline-variant': customOutlineVariant || '#CAC4D0',
    '--theme-error-container': customErrorContainer || '#F9DEDC',
    '--theme-on-error-container': customOnErrorContainer || '#410E0B',
  };
};

export const themes = [
  {
    name: 'Default (Sky Blue)', id: 'default',
    colors: generateThemeColors('#0D9BE1', '#87CEEB', '#FFD700', '#D0EFFF', '#001D35', '#C3E6F9', '#001D35', '#FFF8E1', '#4B3C00', '#F0F4F8', '#FFFFFF', '#E4E9EF', '#F0F4F8'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Roboto', sans-serif" } // Pairing 1
  },
  {
    name: 'Crimson Kiss (Light)', id: 'crimson-light',
    colors: generateThemeColors('#B3261E', '#E91E63', '#FFB547', '#F9DEDC', '#410E0B', '#FFD8E4', '#31111D', '#FFECB3', '#251A00', '#FFFBFB', '#FFFFFF', '#FFEBEA', '#FFF0F0'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Montserrat', sans-serif" } // Pairing 2
  },
  {
    name: 'Minty Fresh (Light)', id: 'minty-green',
    colors: generateThemeColors('#006A60', '#386A20', '#A8C87B', '#DCEFEA', '#00201D', '#D9E7CB', '#102008', '#F1F8E9', '#1A230F', '#F0FFF4', '#FBFFF8', '#E6F5E9', '#F0FAF0'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Lato', sans-serif" } // Pairing 3
  },
  {
    name: 'Azure Day (Light)', id: 'azure-sky',
    colors: generateThemeColors('#0061A4', '#5DB32A', '#869DFF', '#D0E6FF', '#001D36', '#DCEDC8', '#1B360A', '#E0E0FF', '#1B1262', '#F0F8FF', '#FFFFFF', '#E1F0FF', '#EBF4FF'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Poppins', sans-serif" } // Pairing 4
  },
  {
    name: 'Lavender Dream (Light)', id: 'lavender-bliss',
    colors: generateThemeColors('#6750A4', '#958DA5', '#E8DEF8', '#EADDFF', '#21005D', '#EFEEF5', '#292630', '#F6F3FE', '#1E1B2C', '#F8F0FF', '#FFFFFF', '#F3E8FF', '#F5F0FD'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Raleway', sans-serif" } // Pairing 5
  },
  {
    name: 'Peachy Keen (Light)', id: 'warm-peach',
    colors: generateThemeColors('#B75D00', '#FFB547', '#7D5260', '#FFDCC0', '#3E091F', '#FFE0B2', '#2A1800', '#FCE4EC', '#300D1A', '#FFF8F2', '#FFFFFF', '#FFEFE2', '#FFF5EC'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Merriweather', serif" } // Pairing 6
  },
  {
    name: 'Aqua Splash (Light)', id: 'aqua-marine',
    colors: generateThemeColors('#006A6A', '#4FD8EB', '#B1C5D0', '#AFEEEE', '#002020', '#B2EBF2', '#00363A', '#E1F5FE', '#0C1D24', '#E6FEFE', '#F0FFFF', '#D9F7F7', '#E0F7FA'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Playfair Display', serif" } // Pairing 7
  },
  {
    name: 'Modern Stone (Light)', id: 'cool-gray',
    colors: generateThemeColors('#606060', '#A0A0A0', '#007BFF', '#E0E0E0', '#1F1F1F', '#F5F5F5', '#333333', '#D0E6FF', '#001D36', '#F8F9FA', '#FFFFFF', '#EDEDED', '#F5F5F5'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Work Sans', sans-serif" } // Pairing 8
  },
  {
    name: 'Sapphire Sky (Light)', id: 'sapphire-sky',
    colors: generateThemeColors('#0F52BA', '#7CB9E8', '#FFC0CB', '#D6EAF8', '#082E6C', '#C1E0F7', '#001E36', '#FFE0E6', '#3E000A', '#F0F4FF', '#FFFFFF', '#E2ECF8', '#EAF2FA'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Cabin', sans-serif" } // Pairing 9
  },
  {
    name: 'Emerald Isle (Light)', id: 'emerald-isle',
    colors: generateThemeColors('#50C878', '#90EE90', '#FFDB58', '#D4EFDF', '#1E4620', '#E2F7E2', '#285C2A', '#FFF8E1', '#2A1B00', '#F0FDF5', '#F8FFF8', '#E3F5E9', '#EBF9F0'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Source Sans Pro', sans-serif" } // Pairing 10
  },
  {
    name: 'Amethyst Haze (Light)', id: 'amethyst-haze',
    colors: generateThemeColors('#9966CC', '#B19CD9', '#F0E68C', '#EADDFC', '#4D2F6F', '#E2D9F2', '#3A2A5C', '#FFF9C4', '#2C2507', '#F8F5FD', '#FFFFFF', '#F1EBF9', '#F5F0FA'),
    fonts: { '--theme-font-primary': "'Roboto Slab', serif", '--theme-font-secondary': "'Roboto', sans-serif" } // Pairing 11 (Roboto Slab for headings)
  },
  {
    name: 'Ruby Glow (Light)', id: 'ruby-glow',
    colors: generateThemeColors('#E0115F', '#F08080', '#FFDEAD', '#FADADD', '#730932', '#FFD1D1', '#5B0000', '#FFF0E1', '#301F00', '#FFF5F7', '#FFFFFF', '#FFE9ED', '#FFF0F3'),
    fonts: { '--theme-font-primary': "'Lora', serif", '--theme-font-secondary': "'Montserrat', sans-serif" } // Pairing 12
  },
  {
    name: 'Topaz Shine (Light)', id: 'topaz-shine',
    colors: generateThemeColors('#FFC87C', '#FFDAB9', '#87CEEB', '#FFF0E1', '#805B32', '#FFE8CC', '#4D3300', '#D1EFFF', '#002030', '#FFF8F0', '#FFFFFF', '#FFF5E8', '#FFF9F0'),
    fonts: { '--theme-font-primary': "'Merriweather', serif", '--theme-font-secondary': "'Lato', sans-serif" } // Pairing 13
  },
  {
    name: 'Rose Quartz (Light)', id: 'rose-quartz',
    colors: generateThemeColors('#F7CAC9', '#FADADD', '#B0E0E6', '#FFF0F1', '#7C5A56', '#FFF5F5', '#5D4037', '#E1F5FE', '#0C1D24', '#FEFBFB', '#FFFFFF', '#FFF5F5', '#FFF8F8'),
    fonts: { '--theme-font-primary': "'Lora', serif", '--theme-font-secondary': "'Poppins', sans-serif" } // Pairing 14
  },
  {
    name: 'Silver Lining (Light)', id: 'silver-lining',
    colors: generateThemeColors('#B0BEC5', '#CFD8DC', '#81D4FA', '#ECEFF1', '#37474F', '#F5F5F5', '#455A64', '#D0E6FF', '#001D36', '#F8F9FA', '#FFFFFF', '#EFF1F2', '#F5F6F7'),
    fonts: { '--theme-font-primary': "'Merriweather', serif", '--theme-font-secondary': "'Raleway', sans-serif" } // Pairing 15
  },
  {
    name: 'Lime Zest (Light)', id: 'lime-zest',
    colors: generateThemeColors('#AEF359', '#DFFF00', '#FF8C00', '#F1FDE3', '#42600F', '#F7FFDB', '#5E6600', '#FFF3E0', '#4D2B00', '#F8FFF0', '#FDFFFA', '#F0FEE6', '#F5FFE0'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Oswald', sans-serif" } // Pairing 16
  },
  // --- Design System Themes (Light - Kept as requested) ---
  {
    name: 'Apple HIG (Light)', id: 'apple-hig-light',
    colors: generateThemeColors(
      '#007AFF', '#86868B', '#FF9500', 
      '#D1E8FF', '#001E40',
      '#E5E5E5', '#1C1C1E',
      '#FFEBCF', '#593600',
      '#F2F2F7', '#FFFFFF', '#EAEAEB', '#FFFFFF'
    ),
    fonts: { '--theme-font-primary': "'PT Serif', serif", '--theme-font-secondary': "'PT Sans', sans-serif" } // Pairing 17
  },
  {
    name: 'Shopify Polaris (Light)', id: 'shopify-polaris-light',
    colors: generateThemeColors(
      '#008060', '#5C6AC4', '#FFC453', 
      '#D4F3E9', '#003E2D',
      '#D9DFF9', '#202E78',
      '#FFF4CC', '#543800',
      '#F6F6F7', '#FFFFFF', '#F1F2F3', '#FFFFFF'
    ),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Arvo', serif" } // Pairing 18
  },

  // --- 8 Additional New Themes (Light) ---
  {
    name: 'Oceanic Deep', id: 'oceanic-deep',
    colors: generateThemeColors('#006994', '#008080', '#F0E68C', '#BEE3F8', '#002A3A', '#B2DFDB', '#00363A', '#FAFAD2', '#4B4B00', '#E0F7FA', '#FFFFFF', '#C0E0E8', '#F0F8FF'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Ubuntu', sans-serif" } // Pairing 19
  },
  {
    name: 'Forest Canopy', id: 'forest-canopy',
    colors: generateThemeColors('#228B22', '#8B4513', '#FFD700', '#C8E6C9', '#0A2E0B', '#D7CCC8', '#3E2723', '#FFF9C4', '#4D4000', '#F1F8E9', '#FFFFFF', '#E8F5E9', '#FAFFF2'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Nunito', sans-serif" } // Pairing 20
  },
  {
    name: 'Sunset Glow', id: 'sunset-glow',
    colors: generateThemeColors('#FF4500', '#8A2BE2', '#FFD700', '#FFDAB9', '#5C1A00', '#E0B0FF', '#30005C', '#FFF0B3', '#4D4000', '#FFF2E6', '#FFFFFF', '#FFE5D9', '#FFF8F0'),
    fonts: { '--theme-font-primary': "'IBM Plex Serif', serif", '--theme-font-secondary': "'IBM Plex Sans', sans-serif" } // Pairing 21
  },
  {
    name: 'Tech Noir (Light)', id: 'tech-noir-light',
    colors: generateThemeColors('#3F51B5', '#00BCD4', '#E91E63', '#D1D9FF', '#1A237E', '#B2EBF2', '#006064', '#F8BBD0', '#880E4F', '#ECEFF1', '#FFFFFF', '#CFD8DC', '#E8EAF6'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Inter', sans-serif" } // Pairing 22
  },
  {
    name: 'Desert Mirage', id: 'desert-mirage',
    colors: generateThemeColors('#D2B48C', '#E77200', '#87CEEB', '#F5E8D5', '#5D4037', '#FFDCC2', '#793000', '#D1EFFF', '#002030', '#FAF0E6', '#FFFBF5', '#F0E6DB', '#FFF8EF'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'DM Sans', sans-serif" } // Pairing 23
  },
  {
    name: 'Spring Bloom', id: 'spring-bloom',
    colors: generateThemeColors('#FFB6C1', '#98FB98', '#E6E6FA', '#FFECF0', '#7A3C45', '#E0FFE0', '#2E5C2E', '#F0F0FF', '#36366D', '#FFF5FD', '#FFFFFF', '#F5FFF5', '#FAF5FF'),
    fonts: { '--theme-font-primary': "'Merriweather', serif", '--theme-font-secondary': "'Work Sans', sans-serif" } // Pairing 24
  },
  {
    name: 'Urban Modern', id: 'urban-modern',
    colors: generateThemeColors('#4A90E2', '#7F8C8D', '#F1C40F', '#D4E6FB', '#1A3C5E', '#E4E7E7', '#2C3E50', '#FCF3CF', '#795500', '#ECF0F1', '#FFFFFF', '#BDC3C7', '#FFFFFF'),
    fonts: { '--theme-font-primary': "'Merriweather', serif", '--theme-font-secondary': "'Fira Sans', sans-serif" } // Pairing 25
  },
  {
    name: 'Vintage Charm', id: 'vintage-charm',
    colors: generateThemeColors('#BDB76B', '#BC8F8F', '#F5F5DC', '#E9E7C8', '#4A4721', '#EAD7D7', '#5C3C3C', '#FFFEEF', '#4D4D40', '#FAF0E6', '#FFFDF5', '#F5EFE6', '#FFFBF0'),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Barlow', sans-serif" } // Pairing 26
  },
  // --- New Stylistic Themes ---
  {
    name: 'Cyberpunk Neon', id: 'cyberpunk-neon', // Will render as light theme due to isDark=false default
    colors: generateThemeColors(
      '#00F0FF', '#FF00FF', '#7FFF00', 
      '#B3FCFF', '#004C52', 
      '#FFB3FF', '#520052', 
      '#D9FFB3', '#295400', 
      '#F0F0F8', '#FFFFFF', '#E0E0E8', '#F5F5FA',
      false, null, null, null, null, '#FFFFFF', '#FDFBFF'
    ),
    fonts: { '--theme-font-primary': "'Libre Baskerville', serif", '--theme-font-secondary': "'Libre Franklin', sans-serif" } // Pairing 27
  },
  {
    name: 'Rose Garden', id: 'rose-garden', 
    colors: generateThemeColors(
      '#D94E67', '#FF8FAB', '#558B2F', 
      '#FFDDE2', '#5C1A25', 
      '#FFEBF0', '#7A3C45', 
      '#DCECCB', '#1E3A0F', 
      '#F0FFF0', '#FFF8F0', '#E8F5E9', '#FFF8F0'
    ),
    fonts: { '--theme-font-primary': "'Source Serif Pro', serif", '--theme-font-secondary': "'Source Sans Pro', sans-serif" } // Pairing 28
  },
  {
    name: 'Heartfelt Hues', id: 'heartfelt-hues', 
    colors: generateThemeColors(
      '#FF69B4', '#FF1493', '#E6E6FA', 
      '#FFDDF4', '#7A2153', 
      '#FFC0DB', '#7A0A48', 
      '#F0F0FF', '#36366D', 
      '#FFF0F5', '#FFFFFF', '#FCEFF5', '#FFFFFF'
    ),
    fonts: { '--theme-font-primary': "'Lora', serif", '--theme-font-secondary': "'Cabin', sans-serif" } // Pairing 29
  },
  {
    name: 'Tech Interface', id: 'tech-interface', 
    colors: generateThemeColors(
      '#007BFF', '#17A2B8', '#6C757D', 
      '#CCE5FF', '#002752', 
      '#C7EEF5', '#083C44', 
      '#E2E3E5', '#292D30', 
      '#F8F9FA', '#FFFFFF', '#E9ECEF', '#FFFFFF'
    ),
    fonts: { '--theme-font-primary': "'Open Sans', sans-serif", '--theme-font-secondary': "'Josefin Sans', sans-serif" } // Pairing 30
  }
];

export const applyTheme = (themeId) => {
  const theme = themes.find(t => t.id === themeId) || themes[0]; 

  if (theme && theme.colors) {
    for (const colorVar in theme.colors) {
      document.documentElement.style.setProperty(colorVar, theme.colors[colorVar]);
    }
  }

  if (theme && theme.fonts) {
    for (const fontVar in theme.fonts) {
      document.documentElement.style.setProperty(fontVar, theme.fonts[fontVar]);
    }
  }
};
