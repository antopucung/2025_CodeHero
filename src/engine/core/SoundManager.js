// Sound Manager - Handles audio feedback for typing events
export class SoundManager {
  constructor() {
    this.isInitialized = false;
    this.audioContext = null;
    this.sounds = new Map();
    this.volume = 0.3;
    this.enabled = true;
  }
  
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.loadSounds();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Sound initialization failed:', error);
    }
  }
  
  async loadSounds() {
    // Generate simple tones for different events
    this.sounds.set('keypress_perfect', this.createTone(800, 0.1));
    this.sounds.set('keypress_best', this.createTone(600, 0.1));
    this.sounds.set('keypress_good', this.createTone(400, 0.1));
    this.sounds.set('keypress_lame', this.createTone(200, 0.1));
    this.sounds.set('error', this.createTone(150, 0.2));
    this.sounds.set('combo', this.createTone(1000, 0.3));
    this.sounds.set('achievement', this.createTone(1200, 0.5));
    this.sounds.set('levelup', this.createTone(1500, 0.8));
    this.sounds.set('complete', this.createTone(2000, 1.0));
  }
  
  createTone(frequency, duration) {
    return () => {
      if (!this.audioContext || !this.enabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  }
  
  playKeypressSound(speed) {
    const soundKey = `keypress_${speed}`;
    const sound = this.sounds.get(soundKey);
    if (sound) sound();
  }
  
  playCorrectSound(combo) {
    if (combo > 10) {
      const sound = this.sounds.get('combo');
      if (sound) sound();
    }
  }
  
  playErrorSound() {
    const sound = this.sounds.get('error');
    if (sound) sound();
  }
  
  playComboSound(combo) {
    const sound = this.sounds.get('combo');
    if (sound) sound();
  }
  
  playPatternMatchSound(bonus) {
    const sound = this.sounds.get('combo');
    if (sound) sound();
  }
  
  playAchievementSound(rarity) {
    const sound = this.sounds.get('achievement');
    if (sound) sound();
  }
  
  playLevelUpSound(level) {
    const sound = this.sounds.get('levelup');
    if (sound) sound();
  }
  
  playChallengeComplete(score) {
    const sound = this.sounds.get('complete');
    if (sound) sound();
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
  
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  
  getSoundHooks() {
    return {
      playKeypress: this.playKeypressSound.bind(this),
      playCorrect: this.playCorrectSound.bind(this),
      playError: this.playErrorSound.bind(this),
      playCombo: this.playComboSound.bind(this),
      playPattern: this.playPatternMatchSound.bind(this),
      playAchievement: this.playAchievementSound.bind(this),
      playLevelUp: this.playLevelUpSound.bind(this),
      playComplete: this.playChallengeComplete.bind(this)
    };
  }
  
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.sounds.clear();
    this.isInitialized = false;
  }
}