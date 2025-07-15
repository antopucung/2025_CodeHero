// Core engine for Code Stacking V2
import { BaseQuizEngine } from './BaseQuizEngine';

export class CodeStackingEngine extends BaseQuizEngine {
  constructor(options = {}) {
    super(options);
    
    // Extended state for code stacking
    this.state = {
      ...this.state,
      blocks: [],         // Code blocks to arrange
      solution: [],       // Correct order of blocks
      userSolution: [],   // Current user arrangement
    };
  }
  
  setup(codeBlocks, solution) {
    console.log("CodeStackingEngine setup called with blocks:", codeBlocks.length);
    if (!codeBlocks || !Array.isArray(codeBlocks) || codeBlocks.length === 0) {
      throw new Error("Invalid code blocks provided to CodeStackingEngine");
    }
    
    if (!solution || !Array.isArray(solution) || solution.length === 0) {
      throw new Error("Invalid solution provided to CodeStackingEngine");
    }
    
    this.state.blocks = [...codeBlocks];
    this.state.solution = [...solution];
    this.state.userSolution = [];
    
    // Shuffle blocks for presentation
    this.shuffleBlocks();
    
    return this;
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
  
  // Add a block to the user solution
  placeBlock(blockId, insertIndex = -1) {
    console.log(`Placing block ${blockId} at index ${insertIndex}, status: ${this.state.status}`);
    if (this.state.status !== 'active') {
      console.warn("Cannot place block: quiz is not active", this.state.status);
      return false;
    }

    // Find block in available blocks
    const blockIndex = this.state.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
      console.warn("Block not found in available blocks", blockId);
      return false;
    }
    
    // Get the block and remove from available blocks
    const block = this.state.blocks[blockIndex];
    const newBlocks = [...this.state.blocks];
    newBlocks.splice(blockIndex, 1);
    this.state.blocks = newBlocks;
    
    // Add to user solution at specified index or append to end if not specified
    const newUserSolution = [...this.state.userSolution];
    if (insertIndex >= 0 && insertIndex <= this.state.userSolution.length) {
      // Insert at specific position
      newUserSolution.splice(insertIndex, 0, block);
    } else {
      // Append to end
      newUserSolution.push(block);
    }
    this.state.userSolution = newUserSolution;
    
    // Check if placement is correct
    const isCorrect = this.checkPlacement(block, insertIndex);
    
    if (isCorrect) {
      // Increase combo
      this.state.combo = Math.min(this.state.combo + this.options.comboIncrement, this.options.maxCombo);
      this.state.maxComboReached = Math.max(this.state.maxComboReached, this.state.combo);
      this.state.correctAnswers++;
      
      // Calculate points with combo
      const points = Math.round(this.options.basePoints * this.state.combo);
      this.state.score += points;
      
      // Call onCorrect callback
      if (this.callbacks.onCorrect) {
        this.callbacks.onCorrect({
          blockId,
          insertIndex,
          points,
          combo: this.state.combo
        });
      }
    } else {
      // Reset combo on incorrect placement
      this.state.combo = 1.0;
      this.state.incorrectAnswers++;
      
      // Apply penalty
      const penalty = Math.round(this.options.basePoints * this.options.penalty);
      this.state.score = Math.max(0, this.state.score - penalty);
      
      // Call onIncorrect callback
      if (this.callbacks.onIncorrect) {
        this.callbacks.onIncorrect({
          blockId,
          insertIndex,
          penalty
        });
      }
    }
    
    // Check if all blocks are placed correctly
    if (this.state.blocks.length === 0) {
      // Check if all placements are correct
      const allCorrect = this.areAllPlacementsCorrect();
      if (allCorrect) {
        this.complete();
      }
    }
    
    return isCorrect;
  }
  
  // Check if a block is placed correctly
  checkPlacement(block, index) {
    if (!block || index < 0 || index >= this.state.solution.length) {
      return false;
    }
    return block.id === this.state.solution[index].id;
  }
  
  // Check if all blocks are placed correctly
  areAllPlacementsCorrect() {
    if (this.state.userSolution.length !== this.state.solution.length) {
      return false;
    }
    
    for (let i = 0; i < this.state.userSolution.length; i++) {
      if (this.state.userSolution[i].id !== this.state.solution[i].id) {
        return false;
      }
    }
    
    return true;
  }
  
  // Get current progress (percentage)
  getProgress() {
    if (this.state.solution.length === 0) return 0;
    return (this.state.userSolution.length / this.state.solution.length) * 100;
  }
  
  // Reset the quiz
  reset() {
    super.reset();
    
    // Put all blocks back in the available pool
    const blocks = [...this.state.blocks, ...this.state.userSolution];
    this.state.blocks = blocks;
    this.state.userSolution = [];
    
    // Shuffle blocks again
    this.shuffleBlocks();
    
    return this;
  }
}

// Function to create code blocks from a string
export function createCodeBlocks(code, type = "line") {
  if (!code) return [];
  
  let blocks = [];
  let id = 0;
  
  if (type === "line") {
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
  } else if (type === "statement") {
    // More complex splitting logic for statements
    // This is a simplified implementation
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
      
      if (trimmedLine.startsWith('}') || trimmedLine.endsWith('{') || trimmedLine.endsWith(';')) {
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
  
  return blocks.filter(block => block.content.trim() !== '');
}

// Helper function to get indentation level
function getIndentation(line) {
  if (!line) return 0;
  const match = line.match(/^(\s*)/);
  return match ? match[0].length : 0;
}