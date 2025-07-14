/*
  # Insert Sample Courses and Lessons

  1. Sample Courses
    - Unity C# Scripting 101
    - Python Programming Fundamentals  
    - Advanced JavaScript Patterns
    - Java Spring Boot Development
    - React with TypeScript Mastery
    - PHP Laravel Web Development

  2. Sample Lessons
    - Each course will have multiple lessons with different content types
    - Typing challenges, code exercises, and text content
*/

-- Insert sample courses
INSERT INTO courses (
  id,
  title, 
  description, 
  language, 
  difficulty, 
  price, 
  thumbnail_url,
  instructor_name,
  lessons_count,
  duration_hours,
  rating,
  students_count,
  is_published
) VALUES 
(
  'unity-csharp-101',
  'Unity C# Scripting 101',
  'Learn C# programming fundamentals for Unity game development. Master variables, functions, and game object interactions.',
  'csharp',
  'beginner',
  49.99,
  'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
  'GameDev Master',
  8,
  8.0,
  4.8,
  1250,
  true
),
(
  'python-basics',
  'Python Programming Fundamentals',
  'Start your coding journey with Python. Learn syntax, data structures, and build real projects step by step.',
  'python',
  'beginner',
  39.99,
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Code Ninja',
  10,
  12.0,
  4.9,
  2340,
  true
),
(
  'javascript-advanced',
  'Advanced JavaScript Patterns',
  'Master advanced JavaScript concepts including async/await, closures, prototypes, and modern ES6+ features.',
  'javascript',
  'advanced',
  79.99,
  'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
  'JS Expert',
  12,
  15.0,
  4.7,
  890,
  true
),
(
  'java-spring-boot',
  'Java Spring Boot Development',
  'Build enterprise-grade applications with Spring Boot. Learn REST APIs, database integration, and deployment.',
  'java',
  'intermediate',
  69.99,
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Enterprise Dev',
  15,
  20.0,
  4.6,
  1560,
  true
),
(
  'react-typescript',
  'React with TypeScript Mastery',
  'Build type-safe React applications. Learn hooks, context, state management, and modern development practices.',
  'typescript',
  'intermediate',
  59.99,
  'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Frontend Pro',
  10,
  14.0,
  4.8,
  2100,
  true
),
(
  'php-laravel',
  'PHP Laravel Web Development',
  'Create powerful web applications with Laravel. Learn MVC architecture, authentication, and API development.',
  'php',
  'intermediate',
  54.99,
  'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Web Architect',
  12,
  16.0,
  4.5,
  980,
  true
);

-- Insert sample lessons for Unity C# course
INSERT INTO lessons (
  course_id,
  title,
  content_type,
  content_data,
  order_index,
  duration_minutes,
  is_published
) VALUES 
(
  'unity-csharp-101',
  'Introduction to C# Variables',
  'typing_challenge',
  '{
    "challenge_id": "csharp_variables_intro",
    "code": "int playerHealth = 100;\nfloat speed = 5.5f;\nstring playerName = \"Hero\";\nbool isAlive = true;",
    "description": "Practice typing C# variable declarations",
    "difficulty": "beginner"
  }',
  1,
  15,
  true
),
(
  'unity-csharp-101',
  'Understanding Unity Methods',
  'code_exercise',
  '{
    "template": "void Start()\n{\n    // Initialize your game object here\n    \n}\n\nvoid Update()\n{\n    // Add movement logic here\n    \n}",
    "solution": "void Start()\n{\n    // Initialize your game object here\n    transform.position = Vector3.zero;\n}\n\nvoid Update()\n{\n    // Add movement logic here\n    transform.Translate(Vector3.forward * Time.deltaTime);\n}",
    "instructions": "Complete the Start() and Update() methods to initialize a game object and add forward movement."
  }',
  2,
  20,
  true
),
(
  'unity-csharp-101',
  'Working with Game Objects',
  'text',
  '{
    "content": "# Working with Game Objects\n\nIn Unity, every object in your scene is a GameObject. GameObjects are containers that hold components, which define the behavior and appearance of objects in your game.\n\n## Key Concepts:\n\n- **Transform**: Every GameObject has a Transform component that defines its position, rotation, and scale\n- **Components**: Scripts, renderers, colliders, and other functionality\n- **Hierarchy**: GameObjects can be parents or children of other GameObjects\n\n## Common Operations:\n\n```csharp\n// Finding game objects\nGameObject player = GameObject.FindWithTag(\"Player\");\n\n// Accessing transform\ntransform.position = new Vector3(0, 0, 0);\n\n// Getting components\nRigidbody rb = GetComponent<Rigidbody>();\n```"
  }',
  3,
  10,
  true
);

-- Insert sample lessons for Python course
INSERT INTO lessons (
  course_id,
  title,
  content_type,
  content_data,
  order_index,
  duration_minutes,
  is_published
) VALUES 
(
  'python-basics',
  'Python Variables and Data Types',
  'typing_challenge',
  '{
    "challenge_id": "python_variables_intro",
    "code": "name = \"Alice\"\nage = 25\nheight = 5.6\nis_student = True\nprint(f\"Hello, {name}!\")",
    "description": "Practice typing Python variable assignments and f-strings",
    "difficulty": "beginner"
  }',
  1,
  12,
  true
),
(
  'python-basics',
  'Lists and Loops',
  'code_exercise',
  '{
    "template": "# Create a list of numbers\nnumbers = [1, 2, 3, 4, 5]\n\n# Use a for loop to print each number\n# Your code here:\n\n\n# Calculate the sum of all numbers\ntotal = 0\n# Your code here:\n\n\nprint(f\"Total: {total}\")",
    "solution": "# Create a list of numbers\nnumbers = [1, 2, 3, 4, 5]\n\n# Use a for loop to print each number\nfor number in numbers:\n    print(number)\n\n# Calculate the sum of all numbers\ntotal = 0\nfor number in numbers:\n    total += number\n\nprint(f\"Total: {total}\")",
    "instructions": "Complete the code to iterate through the list and calculate the sum of all numbers."
  }',
  2,
  18,
  true
);

-- Insert sample lessons for JavaScript course
INSERT INTO lessons (
  course_id,
  title,
  content_type,
  content_data,
  order_index,
  duration_minutes,
  is_published
) VALUES 
(
  'javascript-advanced',
  'Async/Await Patterns',
  'typing_challenge',
  '{
    "challenge_id": "js_async_await",
    "code": "async function fetchUserData(userId) {\n    try {\n        const response = await fetch(`/api/users/${userId}`);\n        const userData = await response.json();\n        return userData;\n    } catch (error) {\n        console.error(\"Failed to fetch user:\", error);\n        throw error;\n    }\n}",
    "description": "Master modern JavaScript async patterns",
    "difficulty": "advanced"
  }',
  1,
  25,
  true
),
(
  'javascript-advanced',
  'Closures and Scope',
  'code_exercise',
  '{
    "template": "function createCounter() {\n    // Add your counter logic here\n    \n    \n    return {\n        increment: function() {\n            // Your code here\n        },\n        decrement: function() {\n            // Your code here\n        },\n        getValue: function() {\n            // Your code here\n        }\n    };\n}",
    "solution": "function createCounter() {\n    let count = 0;\n    \n    return {\n        increment: function() {\n            count++;\n            return count;\n        },\n        decrement: function() {\n            count--;\n            return count;\n        },\n        getValue: function() {\n            return count;\n        }\n    };\n}",
    "instructions": "Implement a counter using closures that maintains private state."
  }',
  2,
  30,
  true
);