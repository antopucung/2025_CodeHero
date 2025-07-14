// Code Formatter - Handles proper code layout and syntax detection
export class CodeFormatter {
  constructor() {
    this.keywords = new Set([
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 
      'return', 'class', 'import', 'export', 'from', 'async', 'await',
      'try', 'catch', 'finally', 'throw', 'new', 'this', 'super',
      'extends', 'implements', 'interface', 'type', 'enum', 'namespace'
    ]);
    
    this.operators = new Set([
      '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==',
      '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^',
      '<<', '>>', '++', '--', '+=', '-=', '*=', '/=', '=>'
    ]);
    
    this.brackets = new Set(['(', ')', '{', '}', '[', ']', '<', '>']);
    this.quotes = new Set(['"', "'", '`']);
  }
  
  // Parse code into structured format with proper layout
  parseCodeStructure(code) {
    const lines = code.split('\n');
    const structuredCode = [];
    
    lines.forEach((line, lineIndex) => {
      const lineData = this.parseLine(line, lineIndex);
      structuredCode.push(...lineData);
      
      // Add newline character except for last line
      if (lineIndex < lines.length - 1) {
        structuredCode.push({
          char: '\n',
          type: 'newline',
          lineIndex,
          isNewline: true,
          indentLevel: 0
        });
      }
    });
    
    return structuredCode;
  }
  
  // Parse individual line with syntax awareness
  parseLine(line, lineIndex) {
    const characters = [];
    const indentLevel = this.getIndentLevel(line);
    let currentToken = '';
    let inString = false;
    let stringChar = '';
    let inComment = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      // Handle comments
      if (!inString && char === '/' && nextChar === '/') {
        inComment = true;
      }
      
      // Handle strings
      if (!inComment && this.quotes.has(char) && !inString) {
        inString = true;
        stringChar = char;
      } else if (!inComment && inString && char === stringChar && line[i - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }
      
      const syntaxType = this.getSyntaxType(char, currentToken, inString, inComment);
      
      characters.push({
        char,
        type: syntaxType,
        lineIndex,
        charIndex: i,
        indentLevel,
        isNewline: false,
        inString,
        inComment
      });
      
      // Build current token for keyword detection
      if (/[a-zA-Z_$]/.test(char)) {
        currentToken += char;
      } else {
        currentToken = '';
      }
    }
    
    return characters;
  }
  
  // Get indentation level
  getIndentLevel(line) {
    let level = 0;
    for (const char of line) {
      if (char === ' ') level += 1;
      else if (char === '\t') level += 4;
      else break;
    }
    return Math.floor(level / 2); // Convert to logical indent level
  }
  
  // Determine syntax type for character
  getSyntaxType(char, currentToken, inString, inComment) {
    if (inComment) return 'comment';
    if (inString) return 'string';
    
    if (this.brackets.has(char)) return 'bracket';
    if (this.operators.has(char)) return 'operator';
    if (/\d/.test(char)) return 'number';
    if (this.keywords.has(currentToken)) return 'keyword';
    if (char === ' ' || char === '\t') return 'whitespace';
    
    return 'text';
  }
  
  // Format code for display with proper spacing
  formatForDisplay(structuredCode) {
    return structuredCode.map((item, index) => ({
      ...item,
      displayIndex: index,
      shouldPreserveSpace: item.type === 'whitespace' || item.char === '\t',
      shouldBreakLine: item.isNewline
    }));
  }
  
  // Get visual layout information
  getLayoutInfo(structuredCode, containerWidth) {
    const charWidth = 17; // Base character width
    const lineHeight = 22; // Base line height
    const maxCharsPerLine = Math.floor(containerWidth / charWidth);
    
    let currentLine = 0;
    let currentCol = 0;
    
    return structuredCode.map((item, index) => {
      const layoutInfo = {
        ...item,
        visualLine: currentLine,
        visualCol: currentCol,
        x: currentCol * charWidth,
        y: currentLine * lineHeight
      };
      
      if (item.isNewline) {
        currentLine++;
        currentCol = 0;
      } else {
        currentCol++;
        
        // Handle line wrapping for very long lines
        if (currentCol >= maxCharsPerLine && !item.shouldPreserveSpace) {
          currentLine++;
          currentCol = 0;
        }
      }
      
      return layoutInfo;
    });
  }
}