// Base Quiz Engine - Abstract class for all quiz types
export class BaseQuizEngine {
  constructor(options = {}) {
    this.options = {
      timeLimit: 60,       // Time limit in seconds (0 = no limit)
      basePoints: 100,     // Points per correct answer
      timeBonus: 10,       // Bonus points per second remaining
      comboIncrement: 0.1, // Combo multiplier increment
      maxCombo: 3.0,       // Maximum combo multiplier
      penalty: 0.1,        // Penalty for incorrect answers
      ...options
    };
    
    // Quiz state - subclasses should extend or override this
    this.state = {
      startTime: null,     // When quiz started
      endTime: null,       // When quiz ended
      timeRemaining: 0,    // Time remaining (seconds)
      score: 0,            // Current score
      combo: 1.0,          // Current combo multiplier
      maxComboReached: 1.0, // Max combo reached
      correctAnswers: 0,   // Number of correct answers
      incorrectAnswers: 0, // Number of incorrect attempts
      isComplete: false,   // Is quiz completed
      feedback: [],        // Array of feedback events
      status: 'waiting'    // 'waiting', 'active', 'paused', 'completed', 'failed'
    };
    
    // Event callbacks
    this.callbacks = {
      onStart: null,
      onComplete: null,
      onCorrect: null,
      onIncorrect: null,
      onTimeout: null,
      onTick: null
    };
    
    // Timer reference
    this.timerRef = null;
  }
  
  // Abstract method to be implemented by subclasses
  setup(quizData) {
    throw new Error('Method not implemented: subclasses must implement setup()');
  }
  
  // Start the quiz
  start() {
    this.state.startTime = Date.now();
    this.state.status = 'active';
    this.state.timeRemaining = this.options.timeLimit;
    
    // Start timer if time limit is set
    if (this.options.timeLimit > 0) {
      this.startTimer();
    }
    
    // Call onStart callback
    if (this.callbacks.onStart) {
      this.callbacks.onStart(this.getState());
    }
    
    return this;
  }
  
  // Abstract method to handle an answer submission
  submitAnswer(answer) {
    throw new Error('Method not implemented: subclasses must implement submitAnswer()');
  }
  
  // Complete the quiz
  complete() {
    if (this.state.status === 'completed') return;
    
    this.state.status = 'completed';
    this.state.isComplete = true;
    this.state.endTime = Date.now();
    
    // Stop timer
    this.stopTimer();
    
    // Calculate time bonus
    let timeBonus = 0;
    if (this.options.timeLimit > 0 && this.state.timeRemaining > 0) {
      timeBonus = Math.round(this.state.timeRemaining * this.options.timeBonus);
      this.state.score += timeBonus;
      
      // Add feedback event
      this.state.feedback.push({
        type: 'timeBonus',
        points: timeBonus,
        timeRemaining: this.state.timeRemaining,
        timestamp: Date.now()
      });
    }
    
    // Call onComplete callback
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete({
        score: this.state.score,
        timeBonus,
        maxCombo: this.state.maxComboReached,
        timeElapsed: (this.state.endTime - this.state.startTime) / 1000,
        correctAnswers: this.state.correctAnswers,
        incorrectAnswers: this.state.incorrectAnswers,
        success: this.isSuccessful()
      });
    }
  }
  
  // Determine if quiz was successful
  isSuccessful() {
    // Default implementation - subclasses may override
    // By default, consider successful if more correct than incorrect
    return this.state.correctAnswers > this.state.incorrectAnswers;
  }
  
  // Fail the quiz (timeout)
  fail() {
    if (this.state.status === 'failed' || this.state.status === 'completed') return;
    
    this.state.status = 'failed';
    this.state.endTime = Date.now();
    
    // Call onTimeout callback
    if (this.callbacks.onTimeout) {
      this.callbacks.onTimeout({
        score: this.state.score,
        timeElapsed: (this.state.endTime - this.state.startTime) / 1000,
        correctAnswers: this.state.correctAnswers,
        incorrectAnswers: this.state.incorrectAnswers
      });
    }
  }
  
  // Start timer
  startTimer() {
    if (this.timerRef) this.stopTimer();
    
    const interval = 100; // Update every 100ms for smooth countdown
    const startTime = Date.now();
    const timeLimit = this.options.timeLimit * 1000; // Convert to milliseconds
    
    this.timerRef = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, timeLimit - elapsed);
      this.state.timeRemaining = Math.ceil(remaining / 1000);
      
      // Call onTick callback
      if (this.callbacks.onTick) {
        this.callbacks.onTick({
          timeRemaining: this.state.timeRemaining,
          timeElapsed: elapsed / 1000
        });
      }
      
      // Check if time is up
      if (remaining <= 0) {
        this.stopTimer();
        this.fail();
      }
    }, interval);
  }
  
  // Stop timer
  stopTimer() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }
  
  // Reset the quiz
  reset() {
    this.stopTimer();
    
    // Reset state - basic fields only, subclasses should handle quiz-specific state
    this.state.startTime = null;
    this.state.endTime = null;
    this.state.timeRemaining = this.options.timeLimit;
    this.state.score = 0;
    this.state.combo = 1.0;
    this.state.maxComboReached = 1.0;
    this.state.correctAnswers = 0;
    this.state.incorrectAnswers = 0;
    this.state.isComplete = false;
    this.state.feedback = [];
    this.state.status = 'waiting';
    
    return this;
  }
  
  // Register event callbacks
  on(event, callback) {
    if (this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] !== undefined) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
    return this;
  }
  
  // Get current quiz state
  getState() {
    return { ...this.state };
  }
  
  // Clean up resources
  destroy() {
    this.stopTimer();
    this.callbacks = {};
  }
}