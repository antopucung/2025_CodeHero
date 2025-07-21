# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🎯 Easy Configuration Guide

### 🚀 Navigation System (Super Simple!)

**Want to change from Sidebar to Header-only navigation? Just change ONE line!**

```javascript
// In src/App.jsx (around line 24)
const USE_SIDEBAR = true;  // 👈 Change this!
```

**Options:**
- `true` = Modern Sidebar + Compact Header
- `false` = Traditional Header-Only Navigation

### 🎨 Theme System (Just as Easy!)

**Switch themes instantly using the theme selector in the header, or set a default:**

1. **Via UI**: Click the 🎨 icon in the header to open theme selector
2. **Via Code**: Change the default theme in `src/theme/ThemeContext.jsx`

**Available Themes:**
- **Terminal IDE** (Default) - Classic green terminal look
- **The Rundown AI** - Clean, professional data-focused design
- **Cyberpunk** - Futuristic neon aesthetic
- **Modern Light** - Clean light theme
- **Minimal** - Ultra-clean minimal design
- **Gaming** - High-contrast gaming theme

### 🔧 Quick Theme Switching
```javascript
// In src/theme/ThemeContext.jsx
const [currentThemeId, setCurrentThemeId] = useState(() => {
  return localStorage.getItem('selected-theme') || 'rundown'; // 👈 Change default here
});
```

---

### Navigation Features

- **Sidebar Mode**: Modern collapsible sidebar with premium UI/UX
- **Header Mode**: Traditional top navigation with full menu
- **Responsive**: Automatically adapts to mobile/tablet screens
- **Persistent**: Remembers user's sidebar collapse preference

### Theme Features

- **6 Professional Themes**: From terminal to modern AI platform aesthetics
- **Instant Switching**: Change themes without page reload
- **Persistent Selection**: Remembers your theme choice
- **Component Integration**: Themes automatically apply to all components
- **Custom Theme Support**: Easy to add new themes

### Customizing Navigation

Edit `src/components/navigation/NavigationConfig.js` to:
- Add new navigation items
- Modify existing routes
- Change icons and descriptions
- Reorganize menu structure