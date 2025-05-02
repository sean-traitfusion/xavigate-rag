const theme = {
  colors: {
    primary: '#0984E3',
    primaryTint1: '#80CFFF',
    primaryTint2: '#E1F4FF',
    primaryTint3: '#F6FCFF',

    accent: '#D83094',
    accentTint1: '#FF78DD',
    accentTint2: '#FEEAFF',
    accentTint3: '#FFF9FF',

    complimentary: '#6F30D1',
    complimentaryTint1: '#B488F9',
    complimentaryTint2: '#E8DEF9',
    complimentaryTint3: '#F8F5FD',

    backgroundDark: '#030D2B',
    backgroundMedium: '#F0F0F0',
    backgroundLight: '#FBFBFB',
    backgroundWhite: '#FFFFFF',

    textDark: '#030D2B',
    textMedium: '#4C515D',
    textLight: '#FFFFFF'
  },

  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'DM Sans', sans-serif`
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 64
  },

  breakpoints: {
    xs: 375,
    sm: 425,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1440
  },

  radius: {
    sm: '4px',
    md: '6px',
    lg: '12px',
    round: '999px'
  }
} as const;

export default theme;