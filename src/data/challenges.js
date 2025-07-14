export const TYPING_CHALLENGES = {
  javascript: [
    {
      id: 'js_basic_1',
      title: 'Hello World Function',
      description: 'Learn basic function syntax while improving typing speed',
      difficulty: 'beginner',
      language: 'javascript',
      code: `function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("World");`
    },
    {
      id: 'js_basic_2',
      title: 'Array Operations',
      description: 'Practice array methods and iteration',
      difficulty: 'beginner',
      language: 'javascript',
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(doubled);
console.log(sum);`
    },
    {
      id: 'js_intermediate_1',
      title: 'Async/Await Pattern',
      description: 'Master modern JavaScript async patterns',
      difficulty: 'intermediate',
      language: 'javascript',
      code: `async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}`
    }
  ],
  python: [
    {
      id: 'py_basic_1',
      title: 'List Comprehension',
      description: 'Practice Python list comprehensions',
      difficulty: 'beginner',
      language: 'python',
      code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(even_squares)`
    },
    {
      id: 'py_basic_2',
      title: 'Class Definition',
      description: 'Learn Python class syntax',
      difficulty: 'intermediate',
      language: 'python',
      code: `class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def get_history(self):
        return self.history`
    }
  ],
  typescript: [
    {
      id: 'ts_basic_1',
      title: 'Interface Definition',
      description: 'Practice TypeScript interfaces and types',
      difficulty: 'intermediate',
      language: 'typescript',
      code: `interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

function createUser(userData: Partial<User>): User {
    return {
        id: Math.random(),
        isActive: true,
        ...userData
    } as User;
}`
    }
  ],
  java: [
    {
      id: 'java_basic_1',
      title: 'Class and Methods',
      description: 'Practice Java class structure',
      difficulty: 'beginner',
      language: 'java',
      code: `public class Calculator {
    private int result;
    
    public Calculator() {
        this.result = 0;
    }
    
    public int add(int a, int b) {
        this.result = a + b;
        return this.result;
    }
    
    public int getResult() {
        return this.result;
    }
}`
    }
  ]
};

export const getChallengesByLanguage = (language) => {
  return TYPING_CHALLENGES[language] || [];
};

export const getChallengeById = (id) => {
  for (const language in TYPING_CHALLENGES) {
    const challenge = TYPING_CHALLENGES[language].find(c => c.id === id);
    if (challenge) return challenge;
  }
  return null;
};

export const getRandomChallenge = (language = null, difficulty = null) => {
  let challenges = [];
  
  if (language) {
    challenges = TYPING_CHALLENGES[language] || [];
  } else {
    challenges = Object.values(TYPING_CHALLENGES).flat();
  }
  
  if (difficulty) {
    challenges = challenges.filter(c => c.difficulty === difficulty);
  }
  
  return challenges[Math.floor(Math.random() * challenges.length)];
};