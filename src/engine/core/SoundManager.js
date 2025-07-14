// Sound Management System - Audio feedback integration points
export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.volume = 0.7;
    this.enabled = true;
    this.soundQueue = [];
    this.isInitialized = false;
    this.preloadedSounds = new Map();
    
    // Sound effect definitions
    this.soundEffects = {
      // Typing sounds
      keypress: { frequency: 800, duration: 50, type: 'click' },
      correct: { frequency: 1200, duration: 100, type: 'success' },
      error: { frequency: 300, duration: 200, type: 'error' },
      
      // Performance sounds
      combo: { frequency: 1500, duration: 150, type: 'achievement' },
      perfectStreak: { frequency: 2000, duration: 200, type: 'celebration' },
      levelUp: { frequency: 1800, duration: 500, type: 'fanfare' },
      
      // Pattern sounds
      patternMatch: { frequency: 1600, duration: 120, type: 'bonus' },
      achievement: { frequency: 2200, duration: 300, type: 'triumph' },
      
      // UI sounds
      modeSwitch: { frequency: 1000, duration: 80, type: 'interface' },
      challengeStart: { frequency: 1400, duration: 250, type: 'start' },
      challengeComplete: { frequency: 1800, duration: 400, type: 'complete' }
    };
  }

  // Initialize audio context (requires user interaction)
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.preloadSounds();
      this.isInitialized = true;
      console.log('SoundManager initialized');
    } catch (error) {
      console.warn('Audio not supported:', error);
      this.enabled = false;
    }
  }

  // Preload sound effects
  async preloadSounds() {
    for (const [name, config] of Object.entries(this.soundEffects)) {
      this.preloadedSounds.set(name, config);
    }
  }

  // Play sound effect
  play(soundName, options = {}) {
    if (!this.enabled || !this.isInitialized) return;
    
    const soundConfig = this.preloadedSounds.get(soundName);
    if (!soundConfig) {
      console.warn(`Sound '${soundName}' not found`);
      return;
    }
    
    this.playTone({
      ...soundConfig,
      volume: options.volume || this.volume,
      pitch: options.pitch || 1
    });
  }

  // Generate and play tone
  playTone({ frequency, duration, type, volume = 0.7, pitch = 1 }) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Configure oscillator
    oscillator.frequency.setValueAtTime(frequency * pitch, this.audioContext.currentTime);
    oscillator.type = this.getOscillatorType(type);
    
    // Configure envelope
    const now = this.audioContext.currentTime;
    const attackTime = 0.01;
    const releaseTime = duration / 1000 * 0.3;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
    
    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  }

  getOscillatorType(soundType) {
    const types = {
      click: 'square',
      success: 'sine',
      error: 'sawtooth',
      achievement: 'triangle',
      celebration: 'sine',
      fanfare: 'triangle',
      bonus: 'sine',
      triumph: 'triangle',
      interface: 'square',
      start: 'triangle',
      complete: 'sine'
    };
    
    return types[soundType] || 'sine';
  }

  // Typing-specific sound methods
  playKeypressSound(speed = 'lame') {
    const pitchMap = {
      perfect: 1.3,
      best: 1.2,
      good: 1.1,
      lame: 1.0
    };
    
    this.play('keypress', { pitch: pitchMap[speed] });
  }

  playCorrectSound(combo = 1) {
    const pitch = Math.min(1 + (combo * 0.05), 2);
    this.play('correct', { pitch });
  }

  playErrorSound() {
    this.play('error');
  }

  playComboSound(combo) {
    const pitch = Math.min(1 + (combo * 0.02), 1.8);
    this.play('combo', { pitch, volume: Math.min(this.volume * (1 + combo * 0.1), 1) });
  }

  playPerfectStreakSound(streak) {
    const pitch = Math.min(1 + (streak * 0.03), 2);
    this.play('perfectStreak', { pitch });
  }

  playPatternMatchSound(bonus) {
    const pitch = Math.min(1 + (bonus * 0.001), 1.5);
    this.play('patternMatch', { pitch });
  }

  playAchievementSound(rarity = 'common') {
    const pitchMap = {
      common: 1.0,
      rare: 1.2,
      epic: 1.4,
      legendary: 1.6,
      mythic: 1.8
    };
    
    this.play('achievement', { pitch: pitchMap[rarity] || 1.0 });
  }

  playLevelUpSound(level) {
    const pitch = Math.min(1 + (level * 0.05), 1.8);
    this.play('levelUp', { pitch });
  }

  // UI sound methods
  playModeSwitch() {
    this.play('modeSwitch');
  }

  playChallengeStart() {
    this.play('challengeStart');
  }

  playChallengeComplete(score) {
    const pitch = Math.min(1 + (score * 0.0001), 1.5);
    this.play('challengeComplete', { pitch });
  }

  // Volume and settings
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Get sound integration points for components
  getSoundHooks() {
    return {
      onKeypress: (speed) => this.playKeypressSound(speed),
      onCorrect: (combo) => this.playCorrectSound(combo),
      onError: () => this.playErrorSound(),
      onCombo: (combo) => this.playComboSound(combo),
      onPerfectStreak: (streak) => this.playPerfectStreakSound(streak),
      onPatternMatch: (bonus) => this.playPatternMatchSound(bonus),
      onAchievement: (rarity) => this.playAchievementSound(rarity),
      onLevelUp: (level) => this.playLevelUpSound(level),
      onModeSwitch: () => this.playModeSwitch(),
      onChallengeStart: () => this.playChallengeStart(),
      onChallengeComplete: (score) => this.playChallengeComplete(score)
    };
  }

  // Cleanup
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.sounds.clear();
    this.preloadedSounds.clear();
  }
}