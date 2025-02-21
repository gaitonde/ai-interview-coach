-- Update last_updated_at function
CREATE OR REPLACE FUNCTION preview_update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users
DROP TABLE IF EXISTS aic_preview_users CASCADE;
CREATE TABLE aic_preview_users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER preview_update_users_last_updated_at
BEFORE UPDATE ON aic_preview_users
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Profiles
DROP TABLE IF EXISTS aic_preview_profiles CASCADE;

CREATE TABLE aic_preview_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    email VARCHAR(255),
    phone VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    linkedin_url VARCHAR(2048),
    school VARCHAR(255),
    major VARCHAR(255),
    concentration VARCHAR(255),
    graduation_date DATE,
    num_free_interviews INTEGER DEFAULT 1,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES aic_preview_users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

CREATE TRIGGER preview_update_profiles_last_updated_at
BEFORE UPDATE ON aic_preview_profiles
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Interviews
DROP TABLE IF EXISTS aic_preview_interviews CASCADE;
CREATE TABLE aic_preview_interviews (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    company_name VARCHAR(255),
    company_url VARCHAR(2048),
    company_text TEXT,
    jd_url VARCHAR(2048),
    jd_text TEXT,
    role_name VARCHAR(255),
    interviewer_name VARCHAR(255),
    interviewer_role VARCHAR(255),
    interviewer_linkedin_url VARCHAR(255),
    interviewer_linkedin_text TEXT,
    interview_date TIMESTAMP WITH TIME ZONE,
    readiness VARCHAR(255),
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    CHECK (jd_url IS NOT NULL OR jd_text IS NOT NULL)
);

CREATE TRIGGER preview_update_interviews_last_updated_at
BEFORE UPDATE ON aic_preview_interviews
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Resumes
DROP TABLE IF EXISTS aic_preview_resumes CASCADE;
CREATE TABLE aic_preview_resumes (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    filename VARCHAR(255),
    url VARCHAR(2048),
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    CHECK (url IS NOT NULL OR text IS NOT NULL)
);

CREATE TRIGGER preview_update_resumes_last_updated_at
BEFORE UPDATE ON aic_preview_resumes
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

CREATE OR REPLACE FUNCTION check_resume_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.url IS NULL AND NEW.text IS NULL THEN
        RAISE EXCEPTION 'Either url or text must be provided';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER preview_enforce_resume_fields
BEFORE INSERT OR UPDATE ON aic_preview_resumes
FOR EACH ROW EXECUTE FUNCTION check_resume_fields();

-- AI Responses; refactor this
DROP TABLE IF EXISTS aic_preview_airesponses CASCADE;
CREATE TABLE aic_preview_airesponses (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    interview_id INTEGER NOT NULL,
    generated_company_prep TEXT,
    generated_interviewer_prep TEXT,
    generated_question_prep TEXT,
    usage JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES aic_preview_interviews(id) ON DELETE CASCADE,
    CONSTRAINT unique_airesponses UNIQUE (profile_id, interview_id)
);

CREATE TRIGGER preview_update_airesponses_last_updated_at
BEFORE UPDATE ON aic_preview_airesponses
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Prompts
DROP TABLE IF EXISTS aic_preview_prompts CASCADE;
CREATE TABLE aic_preview_prompts (
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

CREATE TRIGGER preview_update_prompts_last_updated_at
BEFORE UPDATE ON aic_preview_prompts
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Questions for an interview
DROP TABLE IF EXISTS aic_preview_questions CASCADE;
CREATE TABLE aic_preview_questions (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    interview_id INTEGER NOT NULL,
    category VARCHAR(255),
    question TEXT,
    why TEXT,
    focus TEXT,
    example_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES aic_preview_interviews(id) ON DELETE CASCADE
);

CREATE TRIGGER preview_update_questions_last_updated_at
BEFORE UPDATE ON aic_preview_questions
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Answers to questions
DROP TABLE IF EXISTS aic_preview_answers CASCADE;
CREATE TABLE aic_preview_answers (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    interview_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES aic_preview_interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES aic_preview_questions(id) ON DELETE CASCADE
);

CREATE TRIGGER preview_update_answers_last_updated_at
BEFORE UPDATE ON aic_preview_answers
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Scores for answers
DROP TABLE IF EXISTS aic_preview_scores CASCADE;
CREATE TABLE aic_preview_scores (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    answer_id INTEGER NOT NULL,
    total_score DECIMAL(5,2),
    scores JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES aic_preview_answers(id) ON DELETE CASCADE,
    CONSTRAINT unique_score UNIQUE (profile_id, answer_id)
);

CREATE TRIGGER preview_update_scores_last_updated_at
BEFORE UPDATE ON aic_scores_preview
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Feedback
DROP TABLE IF EXISTS aic_preview_feedback CASCADE;
CREATE TABLE aic_preview_feedback (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    interview_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer_id INTEGER NOT NULL,
    category VARCHAR(255),
    feedback TEXT,
    interview_readiness_chat_history_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES aic_preview_interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES aic_preview_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES aic_preview_answers(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_readiness_chat_history_id) REFERENCES aic_preview_interview_readiness_chat_history(id) ON DELETE CASCADE
);

CREATE TRIGGER preview_update_feedback_last_updated_at
BEFORE UPDATE ON aic_preview_feedback
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Interview Readiness
DROP TABLE IF EXISTS aic_preview_interview_readiness CASCADE;
CREATE TABLE aic_preview_interview_readiness (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    interview_id INTEGER NOT NULL,
    category VARCHAR(255),
    readiness_rating VARCHAR(255),
    readiness_text TEXT,
    is_up_to_date BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES aic_preview_interviews(id) ON DELETE CASCADE,
    UNIQUE (profile_id, interview_id, category)
);

CREATE TRIGGER preview_update_interview_readiness_last_updated_at
BEFORE UPDATE ON aic_preview_interview_readiness
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Interview Readiness Chat History
DROP TABLE IF EXISTS aic_preview_interview_readiness_chat_history CASCADE;
CREATE TABLE aic_preview_interview_readiness_chat_history (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    interview_id INTEGER NOT NULL,
    role VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES aic_preview_interviews(id) ON DELETE CASCADE
);

CREATE TRIGGER preview_update_interview_readiness_chat_history_last_updated
BEFORE UPDATE ON aic_preview_interview_readiness_chat_history
FOR EACH ROW EXECUTE FUNCTION preview_update_last_updated_at();

-- Payments
DROP TABLE IF EXISTS aic_preview_payments CASCADE;
CREATE TABLE aic_preview_payments (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    UNIQUE (profile_id, stripe_session_id)
);

CREATE TABLE aic_preview_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    profile_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_preview_profiles(id) ON DELETE CASCADE,
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT unique_profile_id UNIQUE (profile_id)
);

ALTER TABLE aic_preview_profiles ADD COLUMN is_test BOOLEAN DEFAULT FALSE;
ALTER TABLE aic_preview_emails ADD COLUMN is_test BOOLEAN DEFAULT FALSE;

ALTER TABLE aic_preview_airesponses ADD COLUMN generated_interview_question_predictor TEXT;