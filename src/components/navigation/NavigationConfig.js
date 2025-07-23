// Navigation Configuration - Data-driven navigation system

/**
 * Header-specific navigation items (simplified for header use)
 */
export const HEADER_NAVIGATION_ITEMS = [
  { id: 'home', label: 'Home', icon: '⌂', path: '/' },
  { id: 'marketplace', label: 'Marketplace', icon: '⊞', path: '/marketplace' },
  { id: 'editor', label: 'Editor', icon: '⌨', path: '/code-editor' },
  { id: 'community', label: 'Community', icon: '◉', path: '/community' },
  { id: 'profile', label: 'Profile', icon: '◎', path: '/profile' }
];

/**
 * 🎯 NAVIGATION SYSTEM CONFIGURATION
 * ===================================
 * 
 * This file contains all navigation structure and modes.
 * 
 * USAGE:
 * - To switch between Sidebar and Header-only navigation, 
 *   change the USE_SIDEBAR constant in App.jsx
 * - To modify navigation items, update the arrays below
 * - Icons should be emoji for consistency
 */

export const NAVIGATION_CONFIG = {
  // Primary navigation items
  primary: [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/',
      description: 'Dashboard and overview'
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: '🛒',
      path: '/marketplace',
      description: 'Browse courses and content'
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: '📚',
      path: '/typing-challenge',
      description: 'Practice and learn',
      submenu: [
        {
          id: 'typing-challenge',
          label: 'Typing Challenge',
          icon: '⌨️',
          path: '/typing-challenge',
          description: 'Improve typing speed'
        },
        {
          id: 'quiz-gallery',
          label: 'Quiz Gallery',
          icon: '🎮',
          path: '/quiz-gallery',
          description: 'Interactive quizzes'
        },
        {
          id: 'code-editor',
          label: 'Code Editor',
          icon: '💻',
          path: '/code-editor',
          description: 'Write and execute code'
        },
        {
          id: 'hybrid-mode',
          label: 'Hybrid Mode',
          icon: '🚀',
          path: '/hybrid-mode',
          description: 'Type and execute'
        }
      ]
    },
    {
      id: 'community',
      label: 'Community',
      icon: '🌐',
      path: '/community',
      description: 'Connect with developers'
    }
  ],
  
  // Secondary navigation items
  secondary: [
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile',
      description: 'Your learning progress'
    },
    {
      id: 'creator-dashboard',
      label: 'Creator Dashboard',
      icon: '🎨',
      path: '/creator-dashboard',
      description: 'Manage your digital assets'
    },
    {
      id: 'my-library',
      label: 'My Library',
      icon: '📚',
      path: '/my-library',
      description: 'Your purchased assets'
    }
  ],
  
  // Footer navigation items
  footer: [
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings',
      description: 'App preferences',
      action: 'modal' // Special action instead of navigation
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      path: '/help',
      description: 'Support and docs'
    }
  ]
};

// Navigation modes configuration
export const NAVIGATION_MODES = {
  HEADER_ONLY: 'header-only',
  SIDEBAR_ONLY: 'sidebar-only',
  BOTH: 'both'
};

// Quick access functions for easier navigation management
export const getMainNavigationItems = () => NAVIGATION_CONFIG.primary;
export const getSecondaryNavigationItems = () => NAVIGATION_CONFIG.secondary;
export const getAllNavigationItems = () => [
  ...NAVIGATION_CONFIG.primary,
  ...NAVIGATION_CONFIG.secondary,
  ...NAVIGATION_CONFIG.footer
];
// Get navigation item by path
export const getNavigationItem = (path) => {
  const allItems = getAllNavigationItems();
  
  // Check main items
  let found = allItems.find(item => item.path === path);
  if (found) return found;
  
  // Check submenu items
  for (const item of NAVIGATION_CONFIG.primary) {
    if (item.submenu) {
      found = item.submenu.find(subItem => subItem.path === path);
      if (found) return { ...found, parent: item };
    }
  }
  
  return null;
};

// Check if navigation item is active
export const isNavigationItemActive = (item, currentPath) => {
  if (item.path === currentPath) return true;
  
  // Check if any submenu item is active
  if (item.submenu) {
    return item.submenu.some(subItem => subItem.path === currentPath);
  }
  
  return false;
};