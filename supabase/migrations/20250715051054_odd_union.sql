/*
  # Create Unity C# 101 course and lessons

  1. Course Data
    - Creates a new "Unity C# 101: The Developer's Quest" course
  2. Lesson Data
    - Creates 7 lessons with various content types (text, typing_challenge, code_exercise)
    - Lessons follow a gamified structure with progressive learning
    - Each lesson has unique gamified content with story elements
*/

-- Insert the Unity C# 101 course
INSERT INTO courses (
  title,
  description,
  language,
  difficulty,
  price,
  thumbnail_url,
  instructor_id,
  instructor_name,
  lessons_count,
  duration_hours,
  rating,
  students_count,
  is_published,
  slug
) VALUES (
  'Unity C# 101: The Developer''s Quest',
  'Embark on an epic adventure through the fundamentals of C# programming for Unity game development. Master variables, functions, conditionals, and more while building your first game components. No prior experience required!',
  'csharp',
  'beginner',
  0,
  'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg',
  NULL,
  'Terminal IDE AI',
  7,
  3.5,
  4.9,
  0,
  true,
  'unity-csharp-101'
);

-- Get the course ID
DO $$
DECLARE
  course_id uuid;
BEGIN
  SELECT id INTO course_id FROM courses WHERE slug = 'unity-csharp-101';

  -- Lesson 1: Introduction to C# and Unity
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Awakening: Your First C# Script',
    'text',
    '{
      "content": "Welcome, brave developer! Your journey into the realm of Unity game development begins now. In this quest, you''ll master the fundamentals of C# programming while creating game components that will serve you in your future adventures.\n\nC# (pronounced \"C-sharp\") is the primary language used in Unity game development. It''s powerful, flexible, and will be your trusty companion throughout your game development journey.\n\nIn Unity, each behavior is typically defined in its own C# script file. These scripts are attached to GameObjects in your scene, giving them specific behaviors and functionality.",
      "code_example": "using UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n    // Start is called before the first frame update\n    void Start()\n    {\n        Debug.Log(\"Player has awakened!\");\n    }\n\n    // Update is called once per frame\n    void Update()\n    {\n        // This code runs every frame\n    }\n}",
      "image_url": "https://images.pexels.com/photos/7915250/pexels-photo-7915250.jpeg"
    }',
    0,
    15,
    true
  );

  -- Lesson 2: Variables and Data Types
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Variable Vault: C# Data Types',
    'typing_challenge',
    '{
      "code": "using UnityEngine;\n\npublic class PlayerStats : MonoBehaviour\n{\n    // Variables to store player information\n    public string playerName = \"Hero\";\n    public int health = 100;\n    public float moveSpeed = 5.0f;\n    public bool isAlive = true;\n    \n    // Start is called before the first frame update\n    void Start()\n    {\n        Debug.Log(\"Player: \" + playerName);\n        Debug.Log(\"Health: \" + health);\n        Debug.Log(\"Speed: \" + moveSpeed);\n        Debug.Log(\"Alive: \" + isAlive);\n    }\n}",
      "language": "csharp",
      "difficulty": "beginner"
    }',
    1,
    20,
    true
  );

  -- Lesson 3: Functions and Methods
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Method Forge: Creating C# Functions',
    'code_exercise',
    '{
      "instructions": "The forge requires a function to craft player abilities! Create a method called `TakeDamage` that accepts an `int` parameter named `amount` and subtracts it from the player''s health. If health drops to or below 0, set `isAlive` to false and print \"Player has been defeated!\" using Debug.Log(). Otherwise, print the remaining health.",
      "starter_code": "using UnityEngine;\n\npublic class PlayerHealth : MonoBehaviour\n{\n    public int health = 100;\n    public bool isAlive = true;\n    \n    // Create your TakeDamage method here\n    \n    \n    // Test your method\n    void Start()\n    {\n        TakeDamage(30);  // Should reduce health to 70\n        TakeDamage(80);  // Should defeat the player\n    }\n}",
      "language": "csharp"
    }',
    2,
    25,
    true
  );

  -- Lesson 4: Conditional Statements
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Decision Crystal: If/Else Statements',
    'typing_challenge',
    '{
      "code": "using UnityEngine;\n\npublic class ItemPickup : MonoBehaviour\n{\n    public int coins = 0;\n    public bool hasKey = false;\n    public int playerLevel = 1;\n    \n    void CollectItem(string itemType)\n    {\n        if (itemType == \"Coin\")\n        {\n            coins += 10;\n            Debug.Log(\"You collected 10 coins! Total: \" + coins);\n        }\n        else if (itemType == \"Treasure\")\n        {\n            coins += 50;\n            Debug.Log(\"You found treasure! Total coins: \" + coins);\n        }\n        else if (itemType == \"Key\")\n        {\n            hasKey = true;\n            Debug.Log(\"You found a key! You can now open locked doors.\");\n        }\n        else\n        {\n            Debug.Log(\"Unknown item collected.\");\n        }\n    }\n}",
      "language": "csharp",
      "difficulty": "beginner"
    }',
    3,
    20,
    true
  );

  -- Lesson 5: Loops
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Loop Labyrinth: For and While Loops',
    'code_exercise',
    '{
      "instructions": "You''ve encountered the Loop Labyrinth! To escape, you must create code that generates a specific pattern of numbers. Complete the `GeneratePattern` method to:\n\n1. Use a for loop to iterate from 1 to `count`\n2. For each number, if it''s divisible by both 3 and 5, print \"PowerUp\"\n3. If it''s only divisible by 3, print \"Speed\"\n4. If it''s only divisible by 5, print \"Shield\"\n5. Otherwise, print the number itself\n\nThis pattern will unlock the labyrinth exit!",
      "starter_code": "using UnityEngine;\n\npublic class LoopEscape : MonoBehaviour\n{\n    public int count = 15;\n    \n    void GeneratePattern(int count)\n    {\n        // Your loop code here\n        \n    }\n    \n    // Test your method\n    void Start()\n    {\n        GeneratePattern(count);\n    }\n}",
      "language": "csharp"
    }',
    4,
    30,
    true
  );

  -- Lesson 6: Arrays and Collections
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Inventory Scroll: Arrays and Lists',
    'typing_challenge',
    '{
      "code": "using UnityEngine;\nusing System.Collections.Generic;\n\npublic class PlayerInventory : MonoBehaviour\n{\n    // Array of basic equipment slots\n    public string[] equipmentSlots = new string[4] {\n        \"Helmet\",\n        \"Chestplate\",\n        \"Gloves\",\n        \"Boots\"\n    };\n    \n    // List of collected items\n    public List<string> inventory = new List<string>();\n    \n    void Start()\n    {\n        // Add starting items to inventory\n        inventory.Add(\"Health Potion\");\n        inventory.Add(\"Wooden Sword\");\n        \n        // Show equipment\n        for (int i = 0; i < equipmentSlots.Length; i++)\n        {\n            Debug.Log(\"Slot \" + i + \": \" + equipmentSlots[i]);\n        }\n        \n        // Show inventory\n        Debug.Log(\"Inventory contains \" + inventory.Count + \" items:\");\n        foreach (string item in inventory)\n        {\n            Debug.Log(\"- \" + item);\n        }\n    }\n}",
      "language": "csharp",
      "difficulty": "beginner"
    }',
    5,
    25,
    true
  );

  -- Lesson 7: The Final Boss Challenge
  INSERT INTO lessons (
    course_id,
    title,
    content_type,
    content_data,
    order_index,
    duration_minutes,
    is_published
  ) VALUES (
    course_id,
    'The Debugging Dragon: Fix The Errors',
    'code_exercise',
    '{
      "instructions": "Oh no! The code for the final boss encounter has been corrupted by the Debugging Dragon! The script contains THREE errors that you must identify and fix for the game to run correctly:\n\n1. A syntax error\n2. A logical error\n3. A runtime error waiting to happen\n\nFix all three errors to defeat the Debugging Dragon and complete your quest!",
      "starter_code": "using UnityEngine;\nusing System.Collections.Generic;\n\npublic class BossBattle : MonoBehaviour\n{\n    public int playerHealth = 100;\n    public int bossHealth = 200;\n    public int playerAttack = 25\n    public List<string> spells = new List<string>();\n    \n    void Start()\n    {\n        // Initialize spells\n        spells.Add(\"Fireball\");\n        spells.Add(\"Ice Shard\");\n        spells.Add(\"Lightning Strike\");\n        \n        // Begin battle\n        StartBattle();\n    }\n    \n    void StartBattle()\n    {\n        Debug.Log(\"Boss battle started!\");\n        \n        // Player attacks first\n        int damage = CalculateDamage(\"Player\", playerAttack);\n        bossHealth -= damage;\n        \n        // Display spell options\n        for (int i = 0; i <= spells.Count; i++)\n        {\n            Debug.Log($\"Spell {i+1}: {spells[i]}\");\n        }\n        \n        // Determine if player wins\n        if (playerHealth < bossHealth)\n        {\n            Debug.Log(\"Victory! You defeated the Debugging Dragon!\");\n        }\n        else\n        {\n            Debug.Log(\"Defeat! The boss was too strong!\");\n        }\n    }\n    \n    int CalculateDamage(string attacker, int baseDamage)\n    {\n        Debug.Log($\"{attacker} attacks for {baseDamage} damage!\");\n        return baseDamage;\n    }\n}",
      "language": "csharp"
    }',
    6,
    35,
    true
  );
END $$;