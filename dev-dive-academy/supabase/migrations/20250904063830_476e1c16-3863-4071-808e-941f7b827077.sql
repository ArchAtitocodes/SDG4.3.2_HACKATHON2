-- Enable RLS and create policies for questions and answer_options tables

-- Enable RLS on questions table if not already enabled
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on answer_options table if not already enabled  
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to questions
CREATE POLICY "Questions are publicly viewable" 
ON questions 
FOR SELECT 
USING (true);

-- Create policy to allow public read access to answer options
CREATE POLICY "Answer options are publicly viewable" 
ON answer_options 
FOR SELECT 
USING (true);

-- Note: We make questions and answer options publicly readable since this is educational content
-- that should be accessible to all users. No INSERT/UPDATE/DELETE policies are needed
-- since questions will be managed by administrators through direct database access.