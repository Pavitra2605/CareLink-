// CareLink Design Tokens — sourced from color-schemes.md
export const Colors = {
  // Backgrounds
  bgPrimary: '#F0EFF8',
  bgSecondary: '#E8E8F5',
  surface: '#FFFFFF',
  surfaceHover: '#F7F7FC',

  // Amber / Warm Accent
  amberLight: '#F2B866',
  amberMid: '#E8A857',
  amberDark: '#C97D3A',
  amberGlow: 'rgba(232,168,87,0.25)',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#8A8A9A',
  textInverted: '#FFFFFF',

  // Accent / Interactive (Indigo-Purple)
  accent: '#6B6BCC',
  accentHover: '#5555BB',
  accentLight: '#EEEEF9',
  accentMuted: 'rgba(107,107,204,0.15)',

  // Buttons
  btnPrimaryBg: '#1C1C1E',
  btnPrimaryText: '#FFFFFF',
  btnSecondaryBg: '#FFFFFF',
  btnSecondaryBorder: '#1C1C1E',
  btnSecondaryText: '#1C1C1E',

  // Borders & Dividers
  border: '#DDDDE8',
  borderFocus: '#6B6BCC',
  borderStrong: '#C4C4D4',

  // Status
  success: '#2E9E6B',
  warning: '#E8A857',
  error: '#D94F4F',
  info: '#6B6BCC',

  // Severity
  severityLow: '#2E9E6B',
  severityMedium: '#E8A857',
  severityHigh: '#D94F4F',

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
    shadowColor: '#C97D3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 6,
  },
};

export const Gradients = {
  amber: ['#F2B866', '#C97D3A'],
  bg: ['#F0EFF8', '#E8E8F5'],
  accent: ['#6B6BCC', '#5555BB'],
};
