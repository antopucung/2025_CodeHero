// Pattern Matching Logic
import { PATTERN_DEFINITIONS } from '../core/EngineConfig.js';

export class PatternMatcher {
  constructor() {
    this.patterns = PATTERN_DEFINITIONS;
  }

  checkPatterns(newTypedText, currentCombo, recentlyTyped) {
    const patterns = [];
    const recentChars = recentlyTyped.slice(-5);
    const perfectCount = recentChars.filter(char => char.speed === 'perfect').length;

    // Perfect streak pattern
    if (perfectCount >= 3) {
      patterns.push({
        type: 'perfect_streak',
        count: perfectCount,
        bonus: perfectCount * this.patterns.perfect_streak.bonus,
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }

    // Function/method pattern detection
    const recentText = newTypedText.slice(-10);
    if (recentText.includes('function') || recentText.includes('const ') || recentText.includes('let ')) {
      patterns.push({
        type: 'function_declaration',
        bonus: this.patterns.function_declaration.bonus,
        color: '#4ecdc4',
        id: Date.now() + Math.random()
      });
    }

    // Advanced coding patterns
    if (recentText.includes('class ') || recentText.includes('interface ') || recentText.includes('type ')) {
      patterns.push({
        type: 'advanced_syntax',
        bonus: this.patterns.advanced_syntax.bonus,
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }

    // Arrow function pattern
    if (recentText.includes('=>')) {
      patterns.push({
        type: 'arrow_function',
        bonus: this.patterns.arrow_function.bonus,
        color: '#ffd93d',
        id: Date.now() + Math.random()
      });
    }

    // Bracket mastery
    const bracketChars = recentText.match(/[\[\]{}()]/g);
    if (bracketChars && bracketChars.length >= 4) {
      patterns.push({
        type: 'bracket_combo',
        bonus: this.patterns.bracket_combo.bonus,
        color: '#4ecdc4',
        id: Date.now() + Math.random()
      });
    }

    // String mastery
    if (recentText.includes('"') || recentText.includes("'") || recentText.includes('`')) {
      patterns.push({
        type: 'string_mastery',
        bonus: this.patterns.string_mastery.bonus,
        color: '#9c27b0',
        id: Date.now() + Math.random()
      });
    }

    // Combo milestones
    if (currentCombo > 0 && currentCombo % 10 === 0) {
      patterns.push({
        type: 'combo_milestone',
        combo: currentCombo,
        bonus: currentCombo * this.patterns.combo_milestone.bonus,
        color: '#ffd93d',
        id: Date.now() + Math.random()
      });
    }

    return patterns;
  }

  getPatternInfo(type) {
    return this.patterns[type] || { icon: '⭐', name: 'AMAZING', bonus: 50 };
  }
}