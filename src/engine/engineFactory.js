// Engine Factory - Easy swapping of typing engines
import { TypingEngine } from './core/TypingEngine';

/**
 * Factory function for creating typing engines
 * This allows easy swapping of engine implementations in the future
 */
export const createTypingEngine = (config = {}) => {
  // Default configuration for minimalist mode
  const defaultConfig = {
    enableSounds: false,
    enableAnalytics: true,
    enableEffects: false,
    minimalistMode: true,
    ...config
  };

  // In the future, you can add logic here to choose between different engines
  // For example:
  // if (config.engineType === 'advanced') {
  //   return new AdvancedTypingEngine(defaultConfig);
  // }
  // if (config.engineType === 'beginner') {
  //   return new BeginnerTypingEngine(defaultConfig);
  // }
  
  // For now, return the current engine with minimalist settings
  return new TypingEngine(defaultConfig);
};

/**
 * Available engine types (for future implementation)
 */
export const ENGINE_TYPES = {
  MINIMALIST: 'minimalist',
  STANDARD: 'standard',
  ADVANCED: 'advanced',
  BEGINNER: 'beginner'
};

/**
 * Engine configuration presets
 */
export const ENGINE_PRESETS = {
  [ENGINE_TYPES.MINIMALIST]: {
    enableSounds: false,
    enableAnalytics: false,
    enableEffects: false,
    minimalistMode: true,
    performanceMode: 'high'
  },
  
  [ENGINE_TYPES.STANDARD]: {
    enableSounds: true,
    enableAnalytics: true,
    enableEffects: true,
    minimalistMode: false,
    performanceMode: 'medium'
  },
  
  [ENGINE_TYPES.ADVANCED]: {
    enableSounds: true,
    enableAnalytics: true,
    enableEffects: true,
    minimalistMode: false,
    performanceMode: 'high',
    advancedFeatures: true
  },
  
  [ENGINE_TYPES.BEGINNER]: {
    enableSounds: false,
    enableAnalytics: true,
    enableEffects: false,
    minimalistMode: true,
    performanceMode: 'high',
    beginnerMode: true
  }
};

/**
 * Create typing engine with preset configuration
 */
export const createTypingEngineWithPreset = (preset = ENGINE_TYPES.MINIMALIST, customConfig = {}) => {
  const presetConfig = ENGINE_PRESETS[preset] || ENGINE_PRESETS[ENGINE_TYPES.MINIMALIST];
  const finalConfig = { ...presetConfig, ...customConfig };
  
  return createTypingEngine(finalConfig);
};