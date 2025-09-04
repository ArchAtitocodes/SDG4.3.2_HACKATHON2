-- Seed comprehensive quiz questions for all languages and difficulty levels
-- First, let's get the language and difficulty IDs
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
    
    -- Clear existing questions to start fresh
    DELETE FROM answer_options;
    DELETE FROM questions;
    
    -- HTML Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML element is used to define the structure of a webpage?', 'B', 'The <html> element is the root element that contains all other HTML elements on a page.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<div>', false),
                (question_id, 2, '<html>', true),
                (question_id, 3, '<body>', false),
                (question_id, 4, '<head>', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What does the "alt" attribute in an <img> tag represent?', 'A', 'The alt attribute provides alternative text for images, crucial for accessibility and SEO.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'Alternative text for screen readers', true),
                (question_id, 2, 'Image alignment', false),
                (question_id, 3, 'Image size', false),
                (question_id, 4, 'Image color', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which tag is used to create a hyperlink in HTML?', 'A', 'The <a> tag defines a hyperlink, which is used to link from one page to another.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<a>', true),
                (question_id, 2, '<link>', false),
                (question_id, 3, '<href>', false),
                (question_id, 4, '<url>', false);
                
            WHEN 4 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct HTML element for the largest heading?', 'A', 'The <h1> element defines the most important heading with the largest default font size.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<h1>', true),
                (question_id, 2, '<heading>', false),
                (question_id, 3, '<head>', false),
                (question_id, 4, '<header>', false);
                
            WHEN 5 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML attribute specifies an alternate text for an image?', 'B', 'The alt attribute provides alternative text when an image cannot be displayed.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'title', false),
                (question_id, 2, 'alt', true),
                (question_id, 3, 'src', false),
                (question_id, 4, 'href', false);
                
            WHEN 6 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct HTML for creating a checkbox?', 'C', 'The input element with type="checkbox" creates a checkbox form control.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<input type="check">', false),
                (question_id, 2, '<checkbox>', false),
                (question_id, 3, '<input type="checkbox">', true),
                (question_id, 4, '<check>', false);
                
            WHEN 7 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML element defines the document type?', 'A', 'The <!DOCTYPE> declaration defines the document type and HTML version.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<!DOCTYPE>', true),
                (question_id, 2, '<doctype>', false),
                (question_id, 3, '<html>', false),
                (question_id, 4, '<head>', false);
                
            WHEN 8 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What does HTML stand for?', 'B', 'HTML stands for HyperText Markup Language, the standard markup language for web pages.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'Home Tool Markup Language', false),
                (question_id, 2, 'HyperText Markup Language', true),
                (question_id, 3, 'Hyperlinks and Text Markup Language', false),
                (question_id, 4, 'High Tech Modern Language', false);
                
            WHEN 9 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML element is used to specify a footer for a document?', 'D', 'The <footer> element represents a footer for its nearest sectioning content.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<bottom>', false),
                (question_id, 2, '<section>', false),
                (question_id, 3, '<foot>', false),
                (question_id, 4, '<footer>', true);
                
            WHEN 10 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct HTML for making a text bold?', 'A', 'The <b> tag is used to make text bold without any extra importance.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<b>', true),
                (question_id, 2, '<bold>', false),
                (question_id, 3, '<strong>', false),
                (question_id, 4, '<thick>', false);
                
            WHEN 11 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML element is used to display a scalar value within a range?', 'C', 'The <meter> element represents a scalar value within a known range or a fractional value.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<gauge>', false),
                (question_id, 2, '<measure>', false),
                (question_id, 3, '<meter>', true),
                (question_id, 4, '<range>', false);
                
            WHEN 12 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct HTML for inserting a line break?', 'B', 'The <br> tag inserts a single line break and is an empty element.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<break>', false),
                (question_id, 2, '<br>', true),
                (question_id, 3, '<lb>', false),
                (question_id, 4, '<newline>', false);
                
            WHEN 13 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML element is used to define important text?', 'B', 'The <strong> element indicates that its contents have strong importance, seriousness, or urgency.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<important>', false),
                (question_id, 2, '<strong>', true),
                (question_id, 3, '<b>', false),
                (question_id, 4, '<i>', false);
                
            WHEN 14 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'What is the correct HTML for making a text italic?', 'A', 'The <i> tag is used to define a part of text in an alternate voice or mood.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '<i>', true),
                (question_id, 2, '<italic>', false),
                (question_id, 3, '<it>', false),
                (question_id, 4, '<em>', false);
                
            WHEN 15 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which HTML attribute is used to define inline styles?', 'C', 'The style attribute is used to add inline CSS styles to an element.', html_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'css', false),
                (question_id, 2, 'styles', false),
                (question_id, 3, 'style', true),
                (question_id, 4, 'font', false);
        END CASE;
    END LOOP;
    
    -- CSS Beginner Questions (15 questions)
    FOR i IN 1..15 LOOP
        question_id := gen_random_uuid();
        
        CASE i
            WHEN 1 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which CSS property is used to change the text color of an element?', 'C', 'The "color" property sets the text color of an element.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'text-color', false),
                (question_id, 2, 'font-color', false),
                (question_id, 3, 'color', true),
                (question_id, 4, 'text-style', false);
                
            WHEN 2 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you make each word in a text start with a capital letter?', 'B', 'The text-transform: capitalize property makes the first letter of each word uppercase.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'text-transform: uppercase', false),
                (question_id, 2, 'text-transform: capitalize', true),
                (question_id, 3, 'text-style: capitalize', false),
                (question_id, 4, 'transform: capitalize', false);
                
            WHEN 3 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which property is used to change the background color?', 'A', 'The background-color property sets the background color of an element.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'background-color', true),
                (question_id, 2, 'bgcolor', false),
                (question_id, 3, 'color', false),
                (question_id, 4, 'background', false);
                
            WHEN 4 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you select an element with id "demo"?', 'A', 'The # symbol is used to select elements by their id attribute in CSS.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '#demo', true),
                (question_id, 2, '.demo', false),
                (question_id, 3, 'demo', false),
                (question_id, 4, '*demo', false);
                
            WHEN 5 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you select elements with class name "test"?', 'B', 'The . (dot) symbol is used to select elements by their class attribute in CSS.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, '#test', false),
                (question_id, 2, '.test', true),
                (question_id, 3, 'test', false),
                (question_id, 4, '*test', false);
                
            WHEN 6 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which property is used to change the font of an element?', 'A', 'The font-family property specifies the font for an element.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'font-family', true),
                (question_id, 2, 'font-style', false),
                (question_id, 3, 'font-weight', false),
                (question_id, 4, 'font', false);
                
            WHEN 7 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you make a text bold?', 'B', 'The font-weight: bold property makes text bold.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'font-style: bold', false),
                (question_id, 2, 'font-weight: bold', true),
                (question_id, 3, 'text-style: bold', false),
                (question_id, 4, 'font: bold', false);
                
            WHEN 8 THEN
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'How do you display hyperlinks without an underline?', 'A', 'The text-decoration: none property removes the default underline from links.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'text-decoration: none', true),
                (question_id, 2, 'underline: none', false),
                (question_id, 3, 'decoration: none', false),
                (question_id, 4, 'text-style: none', false);
                
            ELSE
                -- Continue with remaining CSS beginner questions
                INSERT INTO questions (id, question_text, correct_answer, explanation, language_id, difficulty_id, points) 
                VALUES (question_id, 'Which CSS property controls the text size?', 'C', 'The font-size property sets the size of the font.', css_id, beginner_id, 10);
                INSERT INTO answer_options (question_id, option_order, option_text, is_correct) VALUES 
                (question_id, 1, 'text-style', false),
                (question_id, 2, 'font-style', false),
                (question_id, 3, 'font-size', true),
                (question_id, 4, 'text-size', false);
        END CASE;
    END LOOP;
    
END $$;