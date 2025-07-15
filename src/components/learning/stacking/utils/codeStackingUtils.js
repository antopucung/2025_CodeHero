/**
 * Helper functions for the Code Stacking component
 */

/**
 * Get indentation level from a line of code
 * 
 * @param {string} line - Line of code
 * @returns {number} - Indentation level (number of spaces)
 */
export const getIndentation = (line) => {
  if (!line) return 0;
  const match = line.match(/^(\s*)/);
  return match ? match[0].length : 0;
};

/**
 * Create code blocks from a string of code
 * 
 * @param {string} code - Full code string
 * @param {string} splitType - How to split code ('line' or 'statement')
 * @returns {Array} - Array of block objects
 */
export const createCodeBlocks = (code, splitType = "line") => {
  if (!code) return [];
  
  const lines = code.split("\n").filter(line => line.trim() !== "");
  
  // Create a block for each line
  const blocks = lines.map((line, index) => ({
    id: `block-${index}`,
    content: line,
    indentation: getIndentation(line),
    lineNumber: index + 1
  }));
  
  return blocks;
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Find the best insertion index based on mouse position
 * 
 * @param {MouseEvent} e - Drop event
 * @param {HTMLElement} containerRef - Reference to solution container
 * @param {Array} blocks - Current blocks in solution
 * @returns {number} - Best insertion index
 */
export const findBestInsertionIndex = (e, containerRef, blocks) => {
  if (!containerRef || blocks.length === 0) return 0;
  
  const containerRect = containerRef.getBoundingClientRect();
  const blockElements = containerRef.querySelectorAll('.solution-block');
  
  // Default to the end if no closer position is found
  let insertIndex = blocks.length;
  
  // Find the closest block based on Y position
  let closestDistance = Infinity;
  let closestIndex = -1;
  
  blockElements.forEach((blockEl, idx) => {
    const rect = blockEl.getBoundingClientRect();
    const blockMiddleY = rect.top + rect.height / 2;
    const distance = Math.abs(blockMiddleY - e.clientY);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = idx;
    }
  });
  
  // If mouse is above the closest block, insert before it
  // If below, insert after it
  if (closestIndex !== -1) {
    const closestRect = blockElements[closestIndex].getBoundingClientRect();
    const closestMiddleY = closestRect.top + closestRect.height / 2;
    
    if (e.clientY < closestMiddleY) {
      insertIndex = closestIndex;
    } else {
      insertIndex = closestIndex + 1;
    }
  }
  
  return insertIndex;
};

/**
 * Format time display
 * 
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string (MM:SS)
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};