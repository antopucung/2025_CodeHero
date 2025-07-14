// Code Concept Detector - Identifies programming concepts and patterns
export class CodeConceptDetector {
  constructor() {
    // Programming language keywords
    this.keywords = new Set([
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 
      'return', 'class', 'import', 'export', 'from', 'async', 'await',
      'try', 'catch', 'finally', 'throw', 'new', 'this', 'super',
      'extends', 'implements', 'interface', 'type', 'enum', 'namespace',
      'public', 'private', 'protected', 'static', 'abstract'
    ]);
    
    // Design patterns and concepts
    this.patterns = {
      // Variable declarations
      variableDeclaration: /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      
      // Function declarations
      functionDeclaration: /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      arrowFunction: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*/g,
      
      // Class declarations
      classDeclaration: /\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      
      // Method calls
      methodCall: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
      
      // Object properties
      objectProperty: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
      
      // String literals
      stringLiteral: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
      
      // Number literals
      numberLiteral: /\b\d+\.?\d*\b/g,
      
      // Comments
      singleLineComment: /\/\/.*$/gm,
      multiLineComment: /\/\*[\s\S]*?\*\//g,
      
      // Control structures
      controlStructure: /\b(if|else|for|while|switch|case|break|continue)\b/g,
      
      // Import/Export statements
      importExport: /\b(import|export|from|default)\b/g
    };
    
    // Concept scoring for combo system
    this.conceptScores = {
      variable: 10,
      function: 25,
      class: 50,
      method: 20,
      property: 15,
      string: 5,
      number: 5,
      keyword: 15,
      operator: 5,
      bracket: 5,
      controlStructure: 30,
      importExport: 20,
      designPattern: 100
    };
  }
  
  // Detect code concepts in text
  detectConcepts(code) {
    const concepts = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIndex) => {
      // Detect various patterns
      this.detectVariables(line, lineIndex, concepts);
      this.detectFunctions(line, lineIndex, concepts);
      this.detectClasses(line, lineIndex, concepts);
      this.detectMethods(line, lineIndex, concepts);
      this.detectControlStructures(line, lineIndex, concepts);
      this.detectStrings(line, lineIndex, concepts);
      this.detectNumbers(line, lineIndex, concepts);
      this.detectComments(line, lineIndex, concepts);
    });
    
    return concepts;
  }
  
  // Detect variable declarations
  detectVariables(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.variableDeclaration)];
    matches.forEach(match => {
      concepts.push({
        type: 'variable',
        name: match[2],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.variable,
        description: `Variable declaration: ${match[2]}`
      });
    });
  }
  
  // Detect function declarations
  detectFunctions(line, lineIndex, concepts) {
    // Regular function declarations
    const funcMatches = [...line.matchAll(this.patterns.functionDeclaration)];
    funcMatches.forEach(match => {
      concepts.push({
        type: 'function',
        name: match[1],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.function,
        description: `Function declaration: ${match[1]}`
      });
    });
    
    // Arrow functions
    const arrowMatches = [...line.matchAll(this.patterns.arrowFunction)];
    arrowMatches.forEach(match => {
      concepts.push({
        type: 'function',
        name: match[1],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.function,
        description: `Arrow function: ${match[1]}`
      });
    });
  }
  
  // Detect class declarations
  detectClasses(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.classDeclaration)];
    matches.forEach(match => {
      concepts.push({
        type: 'class',
        name: match[1],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.class,
        description: `Class declaration: ${match[1]}`
      });
    });
  }
  
  // Detect method calls
  detectMethods(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.methodCall)];
    matches.forEach(match => {
      concepts.push({
        type: 'method',
        name: match[1],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.method,
        description: `Method call: ${match[1]}`
      });
    });
  }
  
  // Detect control structures
  detectControlStructures(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.controlStructure)];
    matches.forEach(match => {
      concepts.push({
        type: 'controlStructure',
        name: match[1],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.controlStructure,
        description: `Control structure: ${match[1]}`
      });
    });
  }
  
  // Detect string literals
  detectStrings(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.stringLiteral)];
    matches.forEach(match => {
      concepts.push({
        type: 'string',
        name: match[2],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.string,
        description: `String literal: "${match[2]}"`
      });
    });
  }
  
  // Detect number literals
  detectNumbers(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.numberLiteral)];
    matches.forEach(match => {
      concepts.push({
        type: 'number',
        name: match[0],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.number,
        description: `Number literal: ${match[0]}`
      });
    });
  }
  
  // Detect comments
  detectComments(line, lineIndex, concepts) {
    const matches = [...line.matchAll(this.patterns.singleLineComment)];
    matches.forEach(match => {
      concepts.push({
        type: 'comment',
        name: match[0],
        line: lineIndex,
        start: match.index,
        end: match.index + match[0].length,
        score: this.conceptScores.comment || 2,
        description: `Comment: ${match[0].substring(0, 20)}...`
      });
    });
  }
  
  // Detect design patterns
  detectDesignPatterns(concepts) {
    const patterns = [];
    
    // Singleton pattern detection
    const classes = concepts.filter(c => c.type === 'class');
    const staticMethods = concepts.filter(c => c.type === 'method' && c.name === 'getInstance');
    
    if (classes.length > 0 && staticMethods.length > 0) {
      patterns.push({
        type: 'designPattern',
        name: 'Singleton',
        score: this.conceptScores.designPattern,
        description: 'Singleton design pattern detected'
      });
    }
    
    // Factory pattern detection
    const factoryMethods = concepts.filter(c => 
      c.type === 'function' && 
      (c.name.includes('create') || c.name.includes('make') || c.name.includes('build'))
    );
    
    if (factoryMethods.length > 0) {
      patterns.push({
        type: 'designPattern',
        name: 'Factory',
        score: this.conceptScores.designPattern,
        description: 'Factory pattern detected'
      });
    }
    
    // Observer pattern detection
    const observerMethods = concepts.filter(c => 
      c.type === 'method' && 
      (c.name.includes('subscribe') || c.name.includes('notify') || c.name.includes('observe'))
    );
    
    if (observerMethods.length >= 2) {
      patterns.push({
        type: 'designPattern',
        name: 'Observer',
        score: this.conceptScores.designPattern,
        description: 'Observer pattern detected'
      });
    }
    
    return patterns;
  }
  
  // Calculate concept completion bonus
  calculateConceptBonus(completedConcepts) {
    let bonus = 0;
    const conceptCounts = {};
    
    // Count completed concepts
    completedConcepts.forEach(concept => {
      conceptCounts[concept.type] = (conceptCounts[concept.type] || 0) + 1;
    });
    
    // Apply bonuses for concept mastery
    Object.entries(conceptCounts).forEach(([type, count]) => {
      if (count >= 5) bonus += 50; // Mastery bonus
      if (count >= 10) bonus += 100; // Expert bonus
      if (count >= 20) bonus += 200; // Master bonus
    });
    
    return bonus;
  }
}