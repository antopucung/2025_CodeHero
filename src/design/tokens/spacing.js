// Design System - Spacing Tokens
export const spacing = {
  // Base spacing scale (8px system)
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  
  // Component-specific spacing
  component: {
    blockChar: {
      width: '20px',
      height: '28px',
      margin: '3px 2px'
    },
    
    panel: {
      padding: '16px',
      margin: '8px'
    },
    
    section: {
      padding: '24px',
      margin: '16px'
    }
  }
};

export const layout = {
  // Container sizes
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  
  // Grid system
  grid: {
    columns: 12,
    gap: '16px'
  },
  
  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    notification: 1070
  }
};