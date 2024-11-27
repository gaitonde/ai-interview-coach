-- Create ai_interview_coach_Profiles table
DROP TABLE IF EXISTS ai_interview_coach_prod_profiles CASCADE;

CREATE TABLE ai_interview_coach_prod_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    school VARCHAR(255) NOT NULL,
    major VARCHAR(255) NOT NULL,
    concentration VARCHAR(255),
    graduation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_interview_coach_Jobs table
CREATE TABLE ai_interview_coach_prod_jobs (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    company_name VARCHAR(255),
    company_url VARCHAR(2048),
    jd_url VARCHAR(2048),
    jd_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE,
    CHECK (jd_url IS NOT NULL OR jd_text IS NOT NULL)
);

-- Create Resumes table
CREATE TABLE ai_interview_coach_prod_resumes (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    url VARCHAR(2048),
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE,
    CHECK (url IS NOT NULL OR text IS NOT NULL)
);

--Create a table to store the AI responses
CREATE TABLE ai_interview_coach_prod_airesponses (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    prep_sheet_response TEXT,
    questions_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE
);

-- Create a function to update last_updated_at
CREATE OR REPLACE FUNCTION update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update last_updated_at
CREATE TRIGGER update_profiles_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_profiles
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE TRIGGER update_jobs_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_jobs
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE TRIGGER update_resumes_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_resumes
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE OR REPLACE FUNCTION check_resume_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.url IS NULL AND NEW.text IS NULL THEN
        RAISE EXCEPTION 'Either url or text must be provided';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_resume_fields
BEFORE INSERT OR UPDATE ON ai_interview_coach_prod_resumes
FOR EACH ROW EXECUTE FUNCTION check_resume_fields();

ALTER TABLE ai_interview_coach_prod_airesponses ADD CONSTRAINT unique_profile_id UNIQUE (profile_id);

-- Create ai_interview_coach_prod_prompts table
CREATE TABLE ai_interview_coach_prod_prompts (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    temperature DECIMAL(3,2) NOT NULL,
    max_completion_tokens INTEGER NOT NULL,
    system_prompt TEXT NOT NULL,
    user_prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to automatically update last_updated_at
CREATE TRIGGER update_prompts_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_prompts
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();


ALTER TABLE ai_interview_coach_prod_jobs ADD COLUMN company_text TEXT;

CREATE TABLE ai_interview_coach_prod_job_sessions (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE
);

CREATE TRIGGER update_job_sessions_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_job_sessions
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();


ALTER TABLE ai_interview_coach_prod_airesponses ADD COLUMN usage JSON;
ALTER TABLE ai_interview_coach_prod_jobs ADD COLUMN interviewer_name VARCHAR(255);
ALTER TABLE ai_interview_coach_prod_jobs ADD COLUMN interviewer_role VARCHAR(255);

CREATE TABLE ai_interview_coach_prod_job_questions (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    category VARCHAR(255),
    question TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE
);

CREATE TABLE ai_interview_coach_prod_job_question_answers (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES ai_interview_coach_prod_job_questions(id) ON DELETE CASCADE
);

CREATE TABLE ai_interview_coach_prod_answer_scores (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    answer_id INTEGER NOT NULL,
    total_score DECIMAL(5,2),
    scores JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES ai_interview_coach_prod_job_question_answers(id) ON DELETE CASCADE,
    CONSTRAINT unique_profile_answer_score UNIQUE (profile_id, answer_id)
);


CREATE TRIGGER update_job_questions_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_job_questions
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE TRIGGER update_job_question_answers_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_job_question_answers
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE TRIGGER update_answer_scores_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_answer_scores
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

ALTER TABLE ai_interview_coach_prod_job_questions ADD COLUMN why VARCHAR(255);
ALTER TABLE ai_interview_coach_prod_job_questions ADD COLUMN focus VARCHAR(255);


ALTER TABLE ai_interview_coach_prod_job_questions ALTER COLUMN why TYPE TEXT;
ALTER TABLE ai_interview_coach_prod_job_questions ALTER COLUMN focus TYPE TEXT;

CREATE TABLE ai_interview_coach_prod_suggestions (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer_id INTEGER NOT NULL,
    suggestion_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES ai_interview_coach_prod_job_question_answers(id) ON DELETE CASCADE
);

CREATE TRIGGER update_suggestions_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_suggestions
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();


ALTER TABLE ai_interview_coach_prod_profiles ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;

-- December 2024 Drop
ALTER TABLE ai_interview_coach_prod_jobs ADD COLUMN role_name VARCHAR(255);
ALTER TABLE ai_interview_coach_prod_jobs ADD COLUMN interview_date  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE ai_interview_coach_prod_jobs ADD COLUMN readiness VARCHAR(255);