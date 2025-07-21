# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🎯 Navigation System Configuration

### Easy Mode Switching

To switch between Sidebar and Header-only navigation:

1. Open `src/App.jsx`
2. Find the `USE_SIDEBAR` constant (around line 24)
3. Change it to:
   - `true` for Sidebar + Header navigation
   - `false` for Header-only navigation

```javascript
const USE_SIDEBAR = false; // 👈 Change this to false for header-only mode
```

### Navigation Features

- **Sidebar Mode**: Modern collapsible sidebar with premium UI/UX
- **Header Mode**: Traditional top navigation with full menu
- **Responsive**: Automatically adapts to mobile/tablet screens
- **Persistent**: Remembers user's sidebar collapse preference

### Customizing Navigation

Edit `src/components/navigation/NavigationConfig.js` to:
- Add new navigation items
- Modify existing routes
- Change icons and descriptions
- Reorganize menu structure