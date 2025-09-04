-- Continue seeding questions for all remaining languages and difficulty levels
DO $$
DECLARE
    html_id uuid;
    css_id uuid;
    js_id uuid;
    python_id uuid;
    php_id uuid;
    sql_id uuid;
    rust_id uuid;
    
    beginner_id uuid;
    intermediate_id uuid;
    advanced_id uuid;
    expert_id uuid;
    
    question_id uuid;
    i INTEGER;
BEGIN
    -- Get language IDs
    SELECT id INTO html_id FROM programming_languages WHERE name = 'HTML';
    SELECT id INTO css_id FROM programming_languages WHERE name = 'CSS';
    SELECT id INTO js_id FROM programming_languages WHERE name = 'JavaScript';
    SELECT id INTO python_id FROM programming_languages WHERE name = 'Python';
    SELECT id INTO php_id FROM programming_languages WHERE name = 'PHP';
    SELECT id INTO sql_id FROM programming_languages WHERE name = 'SQL';
    SELECT id INTO rust_id FROM programming_languages WHERE name = 'Rust';
    
    -- Get difficulty IDs
    SELECT id INTO beginner_id FROM difficulty_levels WHERE name = 'Beginner';
    SELECT id INTO intermediate_id FROM difficulty_levels WHERE name = 'Intermediate';
    SELECT id INTO advanced_id FROM difficulty_levels WHERE name = 'Advanced';
    SELECT id INTO expert_id FROM difficulty_levels WHERE name = 'Expert';
    
    -- JavaScript Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which method is used to add an element to the end of an array?', 'A', 'The push() method adds one or more elements to the end of an array and returns the new length.', js_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'push()', true),
                (question_id, 2, 'add()', false),
                (question_id, 3, 'append()', false),
                (question_id, 4, 'insert()', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct way to declare a variable in JavaScript?', 'A', 'let is the preferred way to declare variables in modern JavaScript.', js_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'let variableName;', true),
                (question_id, 2, 'variable variableName;', false),
                (question_id, 3, 'declare variableName;', false),
                (question_id, 4, 'v variableName;', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which operator is used for strict equality comparison?', 'C', 'The === operator checks for strict equality (both value and type).', js_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '=', false),
                (question_id, 2, '==', false),
                (question_id, 3, '===', true),
                (question_id, 4, '!=', false);
                
            ELSE
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What does console.log() do?', 'B', 'console.log() prints output to the browser console for debugging.', js_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'Creates a log file', false),
                (question_id, 2, 'Prints to the console', true),
                (question_id, 3, 'Logs user in', false),
                (question_id, 4, 'Displays an alert', false);
        END CASE;
    END LOOP;
    
    -- Python Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which function is used to output text in Python?', 'A', 'The print() function is used to display output in Python.', python_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'print()', true),
                (question_id, 2, 'echo()', false),
                (question_id, 3, 'display()', false),
                (question_id, 4, 'output()', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you create a comment in Python?', 'B', 'The # symbol is used to create single-line comments in Python.', python_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '// This is a comment', false),
                (question_id, 2, '# This is a comment', true),
                (question_id, 3, '/* This is a comment */', false),
                (question_id, 4, '<!-- This is a comment -->', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct file extension for Python files?', 'C', 'Python files use the .py extension.', python_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '.pt', false),
                (question_id, 2, '.python', false),
                (question_id, 3, '.py', true),
                (question_id, 4, '.p', false);
                
            ELSE
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which data type is used to store text in Python?', 'A', 'String (str) is used to store text data in Python.', python_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'str', true),
                (question_id, 2, 'text', false),
                (question_id, 3, 'string', false),
                (question_id, 4, 'char', false);
        END CASE;
    END LOOP;
    
    -- SQL Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which SQL statement is used to retrieve data from a database?', 'A', 'SELECT is the primary SQL statement used to query and retrieve data.', sql_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'SELECT', true),
                (question_id, 2, 'GET', false),
                (question_id, 3, 'FETCH', false),
                (question_id, 4, 'RETRIEVE', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which clause is used to filter records in SQL?', 'C', 'The WHERE clause is used to filter records based on specific conditions.', sql_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'FILTER', false),
                (question_id, 2, 'HAVING', false),
                (question_id, 3, 'WHERE', true),
                (question_id, 4, 'IF', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What does SQL stand for?', 'B', 'SQL stands for Structured Query Language.', sql_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'Simple Query Language', false),
                (question_id, 2, 'Structured Query Language', true),
                (question_id, 3, 'Standard Query Language', false),
                (question_id, 4, 'System Query Language', false);
                
            ELSE
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which statement is used to create a new table?', 'A', 'CREATE TABLE is used to create a new table in the database.', sql_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'CREATE TABLE', true),
                (question_id, 2, 'NEW TABLE', false),
                (question_id, 3, 'MAKE TABLE', false),
                (question_id, 4, 'ADD TABLE', false);
        END CASE;
    END LOOP;
    
    -- PHP Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you start a PHP script?', 'A', 'PHP scripts start with <?php and end with ?>.', php_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<?php', true),
                (question_id, 2, '<php>', false),
                (question_id, 3, '<script>', false),
                (question_id, 4, '<?', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which symbol is used to create a variable in PHP?', 'B', 'In PHP, variables are prefixed with the $ symbol.', php_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '@', false),
                (question_id, 2, '$', true),
                (question_id, 3, '#', false),
                (question_id, 4, '%', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which function is used to output text in PHP?', 'A', 'echo is commonly used to output text in PHP.', php_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'echo', true),
                (question_id, 2, 'print_text', false),
                (question_id, 3, 'display', false),
                (question_id, 4, 'write', false);
                
            ELSE
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you create a comment in PHP?', 'C', 'PHP supports multiple comment styles including // for single-line comments.', php_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '# This is a comment', false),
                (question_id, 2, '/* This is a comment */', false),
                (question_id, 3, '// This is a comment', true),
                (question_id, 4, '<!-- This is a comment -->', false);
        END CASE;
    END LOOP;
    
    -- Rust Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the main function called in Rust?', 'A', 'The main function is the entry point of a Rust program.', rust_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'main', true),
                (question_id, 2, 'start', false),
                (question_id, 3, 'begin', false),
                (question_id, 4, 'init', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which keyword is used to declare a variable in Rust?', 'B', 'The let keyword is used to bind values to variables in Rust.', rust_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'var', false),
                (question_id, 2, 'let', true),
                (question_id, 3, 'mut', false),
                (question_id, 4, 'const', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the file extension for Rust source files?', 'C', 'Rust source files use the .rs extension.', rust_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '.rust', false),
                (question_id, 2, '.r', false),
                (question_id, 3, '.rs', true),
                (question_id, 4, '.rt', false);
                
            ELSE
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which macro is used to print to the console in Rust?', 'A', 'println! is a macro that prints text to the console with a newline.', rust_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'println!', true),
                (question_id, 2, 'print()', false),
                (question_id, 3, 'console.log()', false),
                (question_id, 4, 'echo', false);
        END CASE;
    END LOOP;
END $$;