// Effect System - Manages all visual effects
import { CustomEventEmitter } from '../core/TypingEngine.js';

export class EffectSystem extends CustomEventEmitter {
  constructor() {
    super();
    
    this.effects = {
      floatingScores: new Map(),
      explosions: new Map(),
      patterns: new Map(),
      bonuses: new Map(),
      screenEffects: new Map()
    };
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 500);
  }
  
  // Add floating score effect
  addFloatingScore(config) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      ...config,
      createdAt: Date.now()
    };
    
    this.effects.floatingScores.set(id, effect);
    this.emit('floatingScore', effect);
    
    return id;
  }
  
  // Add character explosion effect
  addExplosion(config) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      ...config,
      createdAt: Date.now()
    };
    
    this.effects.explosions.set(id, effect);
    this.emit('explosion', effect);
    
    return id;
  }
  
  // Add pattern match effect
  addPattern(config) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      ...config,
      createdAt: Date.now()
    };
    
    this.effects.patterns.set(id, effect);
    this.emit('pattern', effect);
    
    return id;
  }
  
  // Add bonus effect
  addBonus(config) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      ...config,
      createdAt: Date.now()
    };
    
    this.effects.bonuses.set(id, effect);
    this.emit('bonus', effect);
    
    return id;
  }
  
  // Add screen effect
  addScreenEffect(config) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      ...config,
      createdAt: Date.now()
    };
    
    this.effects.screenEffects.set(id, effect);
    this.emit('screenEffect', effect);
    
    return id;
  }
  
  // Remove effect
  removeEffect(type, id) {
    if (this.effects[type]) {
      this.effects[type].delete(id);
      this.emit('effectRemoved', { type, id });
    }
  }
  
  // Get all effects of a type
  getEffects(type) {
    return Array.from(this.effects[type]?.values() || []);
  }
  
  // Cleanup expired effects
  cleanup() {
    const now = Date.now();
    const maxAge = {
      floatingScores: 2000,
      explosions: 1500,
      patterns: 3000,
      bonuses: 1000,
      screenEffects: 500
    };
    
    Object.keys(this.effects).forEach(type => {
      const effects = this.effects[type];
      const age = maxAge[type];
      
      effects.forEach((effect, id) => {
        if (now - effect.createdAt > age) {
          effects.delete(id);
          this.emit('effectExpired', { type, id, effect });
        }
      });
    });
  }
  
  // Clear all effects
  clear() {
    Object.keys(this.effects).forEach(type => {
      this.effects[type].clear();
    });
    
    this.emit('cleared');
  }
  
  // Destroy system
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.clear();
    this.removeAllListeners();
  }
}