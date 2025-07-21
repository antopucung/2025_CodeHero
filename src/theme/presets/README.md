# Theme Presets

This directory contains pre-defined theme configurations that users can select from. Each preset is a complete theme configuration that defines colors, typography, spacing, and other design tokens.

## Available Presets

### 1. Terminal (Default)
- **ID**: `terminal`
- **Description**: Classic terminal-inspired dark theme with green accents
- **Best for**: Developers who love the classic terminal aesthetic

### 2. Modern Light
- **ID**: `modern`
- **Description**: Clean modern light theme with blue accents
- **Best for**: Users who prefer light themes and modern design

### 3. Cyberpunk
- **ID**: `cyberpunk`
- **Description**: Futuristic cyberpunk theme with neon colors
- **Best for**: Gaming enthusiasts and cyberpunk aesthetic lovers

### 4. Minimal
- **ID**: `minimal`
- **Description**: Clean, minimal theme with subtle colors
- **Best for**: Users who prefer understated, clean designs

### 5. Gaming
- **ID**: `gaming`
- **Description**: High-contrast gaming theme with RGB accents
- **Best for**: Gamers and users who like vibrant, high-contrast themes

## Creating New Presets

To create a new theme preset:

1. Add a new theme object to `ThemePresets.js`
2. Include all required properties (colors, typography, spacing, etc.)
3. Test the theme thoroughly across all components
4. Add documentation here

## Theme Structure

Each theme preset should include:

```javascript
{
  id: 'unique-theme-id',
  name: 'Display Name',
  description: 'Theme description',
  colorMode: 'dark' | 'light',
  
  colors: {
    brand: { primary, secondary, accent, error, warning, success },
    backgrounds: { primary, secondary, surface, elevated, overlay },
    text: { primary, secondary, muted, disabled, inverse },
    interactive: { default, hover, active, focus, disabled },
    borders: { default, subtle, strong, accent },
    status: { info, success, warning, error }
  },
  
  typography: {
    fonts: { mono, sans },
    sizes: { xs, sm, base, lg, xl, '2xl', '3xl', '4xl', '5xl' },
    weights: { normal, medium, semibold, bold },
    lineHeights: { tight, normal, relaxed }
  },
  
  spacing: { 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 },
  radii: { none, sm, base, md, lg, xl, full },
  shadows: { sm, base, md, lg, glow },
  animations: {
    duration: { fast, normal, slow },
    easing: { ease, easeIn, easeOut, easeInOut }
  }
}
```

## Usage

Themes are automatically loaded and made available through the `useTheme` hook:

```javascript
import { useTheme } from '../ThemeContext';

const { currentTheme, availableThemes, switchTheme } = useTheme();

// Switch to a preset theme
switchTheme('cyberpunk');
```