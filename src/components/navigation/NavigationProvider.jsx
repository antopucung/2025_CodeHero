// Navigation Provider - Manages navigation state globally
import React, { createContext, useContext, useState, useCallback } from 'react';
import { NAVIGATION_MODES } from './NavigationConfig';

const NavigationContext = createContext({
  navigationMode: NAVIGATION_MODES.BOTH,
  sidebarCollapsed: false,
  setNavigationMode: () => {},
  setSidebarCollapsed: () => {},
  toggleSidebar: () => {}
});

export const NavigationProvider = ({ children }) => {
  const [navigationMode, setNavigationMode] = useState(() => {
    // Load from localStorage or default to BOTH
    return localStorage.getItem('navigation-mode') || NAVIGATION_MODES.BOTH;
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load from localStorage or default to false
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  
  // Update navigation mode and persist to localStorage
  const updateNavigationMode = useCallback((mode) => {
    setNavigationMode(mode);
    localStorage.setItem('navigation-mode', mode);
  }, []);
  
  // Update sidebar collapsed state and persist to localStorage
  const updateSidebarCollapsed = useCallback((collapsed) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, []);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    updateSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed, updateSidebarCollapsed]);
  
  const contextValue = {
    navigationMode,
    sidebarCollapsed,
    setNavigationMode: updateNavigationMode,
    setSidebarCollapsed: updateSidebarCollapsed,
    toggleSidebar
  };
  
  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook to use navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationProvider;