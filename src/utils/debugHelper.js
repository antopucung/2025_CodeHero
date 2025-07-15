/**
 * Debugging utilities to help identify and fix common issues
 * These utilities should only be used during development
 */

// Check if in development mode
const isDev = process.env.NODE_ENV === 'development';

// Log levels for more granular control
const LOG_LEVELS = {
  ERROR: 0,   // Always show errors
  WARN: 1,    // Show warnings in development
  INFO: 2,    // Show info in development
  DEBUG: 3    // Only show when explicitly enabled
};

// Current log level - can be overridden via localStorage
const getLogLevel = () => {
  if (!isDev) return LOG_LEVELS.ERROR;
  
  try {
    const storedLevel = localStorage.getItem('debugLogLevel');
    if (storedLevel && LOG_LEVELS[storedLevel] !== undefined) {
      return LOG_LEVELS[storedLevel];
    }
  } catch (e) {
    // localStorage may not be available in some environments
  }
  
  return LOG_LEVELS.WARN;
};

export const DebugHelper = {
  // Console utilities
  log: (message, data, level = LOG_LEVELS.INFO) => {
    if (level <= getLogLevel()) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  warn: (message, data) => {
    if (LOG_LEVELS.WARN <= getLogLevel()) {
      console.warn(`[DEBUG-WARN] ${message}`, data);
    }
  },
  
  error: (message, data) => {
    console.error(`[DEBUG-ERROR] ${message}`, data);
  },
  
  // Component debugging
  logRender: (componentName, props) => {
    if (LOG_LEVELS.DEBUG <= getLogLevel()) {
      console.log(`[RENDER] ${componentName}`, props);
    }
  },
  
  logStateUpdate: (stateName, prevState, newState) => {
    if (LOG_LEVELS.DEBUG <= getLogLevel()) {
      console.log(`[STATE] ${stateName} changed`, { 
        prev: prevState, 
        new: newState,
        diff: JSON.stringify(prevState) !== JSON.stringify(newState)
      });
    }
  },
  
  // Import debugging
  checkExports: (module, name) => {
    console.group(`Exports from ${name}`);
    console.log('Module:', module);
    console.log('Has default export:', !!module.default);
    console.log('Named exports:', Object.keys(module).filter(k => k !== 'default'));
    console.groupEnd();
  },
  
  // Performance analysis
  measurePerformance: (label, callback) => {
    console.time(label);
    const result = callback();
    console.timeEnd(label);
    return result;
  },
  
  // DOM debugging
  inspectElement: (selector) => {
    const el = document.querySelector(selector);
    console.log(`Element ${selector}:`, el);
    if (el) {
      console.log('Computed styles:', window.getComputedStyle(el));
      console.log('Bounding rect:', el.getBoundingClientRect());
    }
    return el;
  },
  
  // React DevTools integration
  highlightUpdates: (enable = true) => {
    if (isDev && typeof window !== 'undefined') {
      try {
        // This accesses React DevTools hook to highlight updates
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
          rendererInterfaces: {
            highlight: enable
          }
        });
        console.log(`Component update highlighting ${enable ? 'enabled' : 'disabled'}`);
      } catch (e) {
        console.warn('React DevTools not available for highlight updates');
      }
    }
  }
};

// Set global debug helper in development mode for console access
if (isDev && typeof window !== 'undefined') {
  window.DebugHelper = DebugHelper;
}

export default DebugHelper;