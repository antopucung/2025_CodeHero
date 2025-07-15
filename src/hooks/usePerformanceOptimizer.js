import { useState, useEffect, useCallback } from 'react';
import { PerformanceOptimizer } from '../engine/core/PerformanceOptimizer';

/**
 * Hook to use the PerformanceOptimizer throughout the application
 * This allows components to adjust their visual effects based on device capabilities
 */
export const usePerformanceOptimizer = (options = {}) => {
  const [optimizer] = useState(() => new PerformanceOptimizer());
  const [stats, setStats] = useState(optimizer.getStats());
  const [effectLimits, setEffectLimits] = useState({
    particles: 50,
    effects: 25,
    animations: 30
  });

  // Initialize monitoring
  useEffect(() => {
    optimizer.startMonitoring();
    
    const interval = setInterval(() => {
      const newStats = optimizer.getStats();
      setStats(newStats);
      
      // Update effect limits based on performance
      const limits = optimizer.optimizeActiveEffects();
      setEffectLimits(limits);
    }, options.updateInterval || 1000);
    
    return () => {
      clearInterval(interval);
      optimizer.destroy();
    };
  }, [optimizer, options.updateInterval]);

  // Calculate effect scale based on performance
  const getEffectScale = useCallback((baseScale = 1) => {
    return baseScale * stats.effectScale;
  }, [stats.effectScale]);

  // Determine if an effect should be shown based on performance
  const shouldShowEffect = useCallback((effectType, priority = 'medium') => {
    const priorityValues = {
      high: 3,
      medium: 2,
      low: 1
    };
    
    // Always show high priority effects unless in minimal mode
    if (priority === 'high' && stats.mode !== 'minimal') {
      return true;
    }
    
    // In low performance mode, only show high priority effects
    if (stats.mode === 'low' && priority !== 'high') {
      return false;
    }
    
    // In minimal mode, show very few effects
    if (stats.mode === 'minimal') {
      return priority === 'high' && effectType === 'core';
    }
    
    return true;
  }, [stats.mode]);

  return {
    stats,
    effectLimits,
    performanceMode: stats.mode,
    effectScale: stats.effectScale,
    getEffectScale,
    shouldShowEffect,
    optimizeActiveEffects: optimizer.optimizeActiveEffects.bind(optimizer)
  };
};