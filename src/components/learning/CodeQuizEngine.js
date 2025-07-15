// Quiz Engine Core - For code arrangement and stacking challenges
export class CodeQuizEngine {
  constructor(options = {}) {
    this.options = {
      // Time limit in seconds (0 = no limit)
      timeLimit: 60,
      // Points per correct placement
      basePoints: 100,
      // Bonus points per second remaining
      timeBonus: 10,
      // Combo multiplier increment
      comboIncrement: 0.1,
      // Maximum combo multiplier
      maxCombo: 3.0,
      // Penalty for incorrect placement (percentage of base points)
      penalty: 0.1,
      ...options
    };
    
    // Quiz state
    this.state = {
      blocks: [],         // Code blocks to arrange
      solution: [],       // Correct order of blocks
      userSolution: [],   // Current user arrangement
      startTime: null,    // When quiz started
      endTime: null,      // When quiz ended
      timeRemaining: 0,   // Time remaining (seconds)
      score: 0,           // Current score
      combo: 1.0,         // Current combo multiplier
      maxComboReached: 1.0, // Max combo reached
      correctPlacements: 0, // Number of correct placements
      incorrectPlacements: 0, // Number of incorrect attempts
      isComplete: false,  // Is quiz completed
      feedback: [],       // Array of feedback events
      status: 'waiting'   // 'waiting', 'active', 'paused', 'completed', 'failed'
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
  
  // Set up quiz with code blocks
  setup(codeBlocks, solution) {
    this.state.blocks = [...codeBlocks];
    this.state.solution = [...solution];
    this.state.userSolution = [];
    this.state.feedback = [];
    this.state.status = 'waiting';
    this.state.score = 0;
    this.state.combo = 1.0;
    this.state.maxComboReached = 1.0;
    this.state.correctPlacements = 0;
    this.state.incorrectPlacements = 0;
    this.state.isComplete = false;
    
    // Shuffle blocks for presentation
    this.shuffleBlocks();
    
    return this;
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
  
  // Add a block to the user solution
  placeBlock(blockId) {
    if (this.state.status !== 'active') return false;

    console.log("Attempting to place block:", blockId);
    console.log("Current blocks:", this.state.blocks);

    // Find block in available blocks
    const blockIndex = this.state.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
      console.log("Block not found in available blocks");
      return false;
    }
    
    // Get the block and remove from available blocks
    const block = this.state.blocks[blockIndex];
    const newBlocks = [...this.state.blocks];
    newBlocks.splice(blockIndex, 1);
    this.state.blocks = newBlocks;
    
    // Add to user solution
    this.state.userSolution = [...this.state.userSolution, block];
    console.log("Updated userSolution:", this.state.userSolution);
    
    // Check if placement is correct
    const isCorrect = this.checkPlacement(block, this.state.userSolution.length - 1);
    console.log("Placement correct?", isCorrect);
    
    if (isCorrect) {
      // Increase combo
      this.state.combo = Math.min(this.state.combo + this.options.comboIncrement, this.options.maxCombo);
      this.state.maxComboReached = Math.max(this.state.maxComboReached, this.state.combo);
      this.state.correctPlacements++;
      
      // Calculate points with combo
      const points = Math.round(this.options.basePoints * this.state.combo);
      this.state.score += points;
      
      // Add feedback event
      this.state.feedback.push({
        type: 'correct',
        blockId,
        points,
        combo: this.state.combo,
        timestamp: Date.now()
      });
      
      // Call onCorrect callback
      if (this.callbacks.onCorrect) {
        this.callbacks.onCorrect({
          blockId,
          points,
          combo: this.state.combo
        });
      }
    } else {
      // Reset combo on incorrect placement
      this.state.combo = 1.0;
      this.state.incorrectPlacements++;
      
      // Apply penalty
      const penalty = Math.round(this.options.basePoints * this.options.penalty);
      this.state.score = Math.max(0, this.state.score - penalty);
      
      // Add feedback event
      this.state.feedback.push({
        type: 'incorrect',
        blockId,
        penalty,
        timestamp: Date.now()
      });
      
      // Call onIncorrect callback
      if (this.callbacks.onIncorrect) {
        this.callbacks.onIncorrect({
          blockId,
          penalty
        });
      }
    }
    
    // Check if quiz is complete
    if (this.state.userSolution.length === this.state.solution.length) {
      this.complete();
    }
    
    return isCorrect;
  }
  
  // Check if a block is placed correctly
  checkPlacement(block, index) {
    if (index >= this.state.solution.length) return false;
    return block.id === this.state.solution[index].id;
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
        correctPlacements: this.state.correctPlacements,
        incorrectPlacements: this.state.incorrectPlacements
      });
    }
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
        correctPlacements: this.state.correctPlacements,
        incorrectPlacements: this.state.incorrectPlacements
      });
    }
  }
  
  // Pause the quiz
  pause() {
    if (this.state.status !== 'active') return;
    
    this.state.status = 'paused';
    this.stopTimer(); // Stop timer while paused
    
    // Store the time when paused
    this.state.pauseTime = Date.now();
  }
  
  // Resume the quiz
  resume() {
    if (this.state.status !== 'paused') return;
    
    // Calculate how long the quiz was paused
    const pauseDuration = Date.now() - (this.state.pauseTime || Date.now());
    
    // Adjust the start time by the pause duration
    if (this.state.startTime) {
      this.state.startTime += pauseDuration;
    }
    
    this.state.status = 'active';
    
    // Restart timer
    if (this.options.timeLimit > 0) {
      this.startTimer();
    }
  }
  
  // Shuffle blocks for presentation
  shuffleBlocks() {
    // Fisher-Yates shuffle algorithm
    const blocks = [...this.state.blocks];
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    this.state.blocks = blocks;
    return this;
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
    
    // Reset state
    const blocks = [...this.state.blocks, ...this.state.userSolution];
    this.state.blocks = blocks;
    this.state.userSolution = [];
    this.state.startTime = null;
    this.state.endTime = null;
    this.state.timeRemaining = this.options.timeLimit;
    this.state.score = 0;
    this.state.combo = 1.0;
    this.state.maxComboReached = 1.0;
    this.state.correctPlacements = 0;
    this.state.incorrectPlacements = 0;
    this.state.isComplete = false;
    this.state.feedback = [];
    this.state.status = 'waiting';
    
    // Shuffle blocks
    this.shuffleBlocks();
    
    return this;
  }
  
  // Register event callbacks
  on(event, callback) {
    if (this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] !== undefined) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
    return this;
  }
  
  // Get current quiz state (for rendering)
  getState() {
    return { ...this.state };
  }
  
  // Clean up resources
  destroy() {
    this.stopTimer();
    this.callbacks = {};
  }
}

// Create code blocks from a string of code
export const createCodeBlocksFromString = (code, blockType = 'line') => {
  if (!code) return [];
  
  const blocks = [];
  let id = 0;
  
  if (blockType === 'line') {
    // Split by lines and create a block for each line
    const lines = code.split('\n');
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      if (line.trim() !== '') { // Skip empty lines
        blocks.push({
          id: `block-${id++}`,
          content: line,
          indentation: getIndentation(line),
          lineNumber: index + 1
        });
      }
    }
  } else if (blockType === 'statement') {
    // More complex: split by statements
    // This is a simplified implementation
    // A more robust version would need to account for brackets, parentheses, etc.
    const lines = code.split('\n');
    let currentBlock = '';
    let currentIndentation = 0;
    let lineNumber = 1;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        lineNumber++;
        return;
      }
      
      if (trimmedLine.startsWith('}') || trimmedLine.endsWith('{')) {
        // This is a block boundary, create a new block
        if (currentBlock) {
          blocks.push({
            id: `block-${id++}`,
            content: currentBlock,
            indentation: currentIndentation,
            lineNumber: lineNumber - currentBlock.split('\n').length
          });
        }
        
        blocks.push({
          id: `block-${id++}`,
          content: line,
          indentation: getIndentation(line),
          lineNumber: lineNumber
        });
        
        currentBlock = '';
      } else if (trimmedLine.endsWith(';')) {
        // This is a statement, add it to the current block
        currentBlock += (currentBlock ? '\n' : '') + line;
        
        // Create a new block
        blocks.push({
          id: `block-${id++}`,
          content: currentBlock,
          indentation: getIndentation(currentBlock.split('\n')[0]),
          lineNumber: lineNumber - currentBlock.split('\n').length + 1
        });
        
        currentBlock = '';
      } else {
        // This is part of a statement, add it to the current block
        currentBlock += (currentBlock ? '\n' : '') + line;
        currentIndentation = getIndentation(line);
      }
      
      lineNumber++;
    });
    
    // Add any remaining block
    if (currentBlock) {
      blocks.push({
        id: `block-${id++}`,
        content: currentBlock,
        indentation: currentIndentation,
        lineNumber: lineNumber - currentBlock.split('\n').length
      });
    }
  }
  
  // Make sure all blocks have unique IDs
  return blocks.filter(block => block.content.trim() !== '');
};

// Helper function to get indentation level
const getIndentation = (line) => {
  if (!line) return 0;
  const match = line.match(/^(\s*)/);
  return match ? match[0].length : 0;
};