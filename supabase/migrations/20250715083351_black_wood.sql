/*
  # Add New Quiz Types to Lessons

  1. New Content Types
    - Add support for multiple choice quizzes, code completion, and debug challenges
    - Update existing content_data with sample quizzes for different lesson types
  
  2. Migration
    - Updates JSON content_data to include quiz configurations
    - Applies to various lesson types for more diverse assessments
*/

-- Function to safely update JSONB
CREATE OR REPLACE FUNCTION update_lesson_quiz_content()
RETURNS void AS $$
DECLARE
    lesson_record RECORD;
BEGIN
    -- Update text-based lesson for JavaScript with multiple choice quiz
    UPDATE lessons
    SET content_data = jsonb_set(
        content_data, 
        '{quiz}',
        '{"type": "multiple-choice", "title": "JavaScript Fundamentals Quiz", "description": "Test your knowledge of JavaScript basics", "questions": [{"question": "Which of the following is a correct way to declare a variable in modern JavaScript?", "answers": ["var name = value;", "let name = value;", "const name = value;", "All of the above"], "correctAnswerIndex": 3}, {"question": "What does the === operator check for?", "answers": ["Value equality only", "Value and type equality", "Reference equality only", "None of the above"], "correctAnswerIndex": 1}, {"question": "Which array method adds one or more elements to the end of an array?", "answers": ["unshift()", "push()", "concat()", "splice()"], "correctAnswerIndex": 1}], "timeLimit": 120, "difficulty": "beginner", "juiciness": "high"}'::jsonb
    )
    WHERE course_id IN (SELECT id FROM courses WHERE language = 'javascript')
    AND content_type = 'text'
    AND order_index = 1;

    -- Update text-based lesson for Python with code completion quiz
    UPDATE lessons
    SET content_data = jsonb_set(
        content_data, 
        '{quiz}',
        '{"type": "code-completion", "title": "Python Syntax Practice", "description": "Fill in the missing code to complete the Python functions", "code": "def calculate_average(numbers):\\n    total = __BLANK__\\n    for num in numbers:\\n        total += num\\n    \\n    return total / __BLANK__\\n\\ndef is_palindrome(word):\\n    word = word.lower()\\n    return word == __BLANK__\\n\\ndef get_fibonacci(n):\\n    if n <= 1:\\n        return n\\n    else:\\n        return __BLANK__ + get_fibonacci(n-2)", "blanks": [{"lineIndex": 1, "startIndex": 12, "endIndex": 20, "solution": "0"}, {"lineIndex": 4, "startIndex": 21, "endIndex": 29, "solution": "len(numbers)"}, {"lineIndex": 8, "startIndex": 20, "endIndex": 28, "solution": "word[::-1]"}, {"lineIndex": 13, "startIndex": 15, "endIndex": 23, "solution": "get_fibonacci(n-1)"}], "timeLimit": 180, "difficulty": "intermediate", "juiciness": "high"}'::jsonb
    )
    WHERE course_id IN (SELECT id FROM courses WHERE language = 'python')
    AND content_type = 'text'
    AND order_index = 2;

    -- Update C# lesson with Unity debug challenge
    UPDATE lessons
    SET content_data = jsonb_set(
        content_data, 
        '{quiz}',
        '{"type": "debug-challenge", "title": "C# Debug Challenge", "description": "Find and fix the bugs in this Unity player controller", "buggyCode": "public class PlayerController : MonoBehaviour\\n{\\n    public int speed = 5f;  // Should be float\\n    private Rigitbody rb;  // Typo in Rigidbody\\n\\n    void Start()\\n    {\\n        // Initialize the component\\n        rb = GetComponents<Rigidbody>();  // Wrong method (GetComponent)\\n    }\\n\\n    void Update()\\n    {\\n        // Get player input\\n        float horizontalInput = Input.GetAxis(\\"Horizontal\\");\\n        float verticalInput = Input.GetAxis(\\"Vertical\\");\\n\\n        // Calculate movement\\n        Vector3 movement = new Vector3(horizontalInput, verticalInput, 0);  // Wrong order for 3D movement\\n\\n        // Apply movement\\n        transform.Translate(movement * speed);  // Missing Time.deltaTime\\n    }\\n}", "fixedCode": "public class PlayerController : MonoBehaviour\\n{\\n    public float speed = 5f;  // Correct type\\n    private Rigidbody rb;  // Correct spelling\\n\\n    void Start()\\n    {\\n        // Initialize the component\\n        rb = GetComponent<Rigidbody>();  // Correct method\\n    }\\n\\n    void Update()\\n    {\\n        // Get player input\\n        float horizontalInput = Input.GetAxis(\\"Horizontal\\");\\n        float verticalInput = Input.GetAxis(\\"Vertical\\");\\n\\n        // Calculate movement\\n        Vector3 movement = new Vector3(horizontalInput, 0, verticalInput);  // Correct order for 3D movement\\n\\n        // Apply movement\\n        transform.Translate(movement * speed * Time.deltaTime);  // Added Time.deltaTime\\n    }\\n}", "bugs": ["Incorrect data type for speed variable", "Typo in Rigidbody variable name", "GetComponents should be GetComponent (singular)", "Incorrect Vector3 component order for 3D movement", "Missing Time.deltaTime for frame rate independence"], "totalBugs": 5, "language": "csharp", "timeLimit": 240, "difficulty": "intermediate", "juiciness": "high"}'::jsonb
    )
    WHERE course_id IN (SELECT id FROM courses WHERE language = 'csharp')
    AND content_type = 'text'
    AND order_index = 3;

    -- Add a code stacking quiz to a JavaScript lesson
    UPDATE lessons
    SET content_data = jsonb_set(
        CASE 
            WHEN content_data ? 'code_example' THEN content_data
            ELSE jsonb_set(content_data, '{code_example}', '"function createCounter() {\n  let count = 0;\n  \n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getCount: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.decrement()); // 1\nconsole.log(counter.getCount()); // 1"'::jsonb)
        END,
        '{quiz}',
        '{"type": "code-stacking", "title": "JavaScript Closure Challenge", "description": "Arrange the code blocks to create a working counter with closures", "code": "function createCounter() {\n  let count = 0;\n  \n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getCount: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.decrement()); // 1\nconsole.log(counter.getCount()); // 1", "language": "javascript", "timeLimit": 120, "difficulty": "intermediate", "juiciness": "high", "splitType": "line"}'::jsonb
    )
    WHERE course_id IN (SELECT id FROM courses WHERE language = 'javascript')
    AND content_type = 'text'
    AND order_index = 4;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT update_lesson_quiz_content();

-- Clean up
DROP FUNCTION update_lesson_quiz_content();