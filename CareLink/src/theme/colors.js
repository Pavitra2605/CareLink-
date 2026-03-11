// CareLink Design Tokens — Warm Indian-inspired AI platform palette
export const Colors = {
  // Backgrounds
  bgPrimary: '#F5F4F0',
  bgSecondary: '#F0EDE6',
  surface: '#FFFFFF',
  surfaceHover: '#F5F2ED',

  // Saffron / Warm Accent
  amberLight: '#F0A050',
  amberMid: '#E8843A',
  amberDark: '#C4682A',
  amberGlow: 'rgba(232,132,58,0.25)',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textInverted: '#FFFFFF',

  // Accent / Interactive (Lavender-Indigo)
  accent: '#5B5A9E',
  accentHover: '#4A498D',
  accentLight: '#EEEDF8',
  accentMuted: 'rgba(91,90,158,0.15)',

  // Buttons
  btnPrimaryBg: '#1A1A1A',
  btnPrimaryText: '#FFFFFF',
  btnSecondaryBg: '#FFFFFF',
  btnSecondaryBorder: '#1A1A1A',
  btnSecondaryText: '#1A1A1A',

  // Tags / Pills
  tagBg: '#EEEDF8',
  tagBorder: '#C8C4E8',
  tagText: '#5B5A9E',

  // Borders & Dividers
  border: '#E0DDD6',
  borderFocus: '#5B5A9E',
  borderStrong: '#C8C4E8',

  // Status
  success: '#2E9E6B',
  warning: '#E8843A',
  error: '#D94F4F',
  info: '#5B5A9E',

  // Severity
  severityLow: '#2E9E6B',
  severityMedium: '#E8843A',
  severityHigh: '#D94F4F',

  // Navigation
  navText: '#2A2A2A',
  logo: '#0A0A0A',
  partnerTint: '#AAAAAA',

  // Banner / Top Bar
  bannerStart: '#C4682A',
  bannerEnd: '#8B4A1E',

  // Misc
  overlay: 'rgba(0,0,0,0.4)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 4,
  },
  amber: {
    shadowColor: '#C4682A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 6,
  },
};

export const Gradients = {
  // Hero: soft lavender → warm cream → light peach
  hero: ['#D6D4F0', '#F0EDE6', '#F5E8D8'],
  // Accent cards/banners: orange → amber → soft lavender
  accent: ['#E8843A', '#F0A050', '#C8C4E8'],
  // Card accent visual: orange → lavender diagonal
  cardAccent: ['#E8853A', '#B8B4E0'],
  // Banner/top bar: deep saffron → burnt amber
  banner: ['#C4682A', '#8B4A1E'],
  // Background gradient (auth screens etc.)
  bg: ['#F5F4F0', '#F0EDE6', '#F5E8D8'],
  // Primary (used in hero sections): same as banner
  primary: ['#C4682A', '#8B4A1E'],
};
