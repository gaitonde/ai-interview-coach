-- Update last_updated_at function
CREATE OR REPLACE FUNCTION update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles
DROP TABLE IF EXISTS aic_profiles_preview CASCADE;

CREATE TABLE aic_profiles_preview (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255),
    email VARCHAR(255),
    school VARCHAR(255),
    major VARCHAR(255),
    concentration VARCHAR(255),
    graduation_date DATE,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_profiles_last_updated_at
BEFORE UPDATE ON aic_profiles_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Jobs
DROP TABLE IF EXISTS aic_jobs_preview CASCADE;
CREATE TABLE aic_jobs_preview (
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
    interview_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    readiness VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    CHECK (jd_url IS NOT NULL OR jd_text IS NOT NULL)
);

CREATE TRIGGER update_jobs_last_updated_at
BEFORE UPDATE ON aic_jobs_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Resumes
DROP TABLE IF EXISTS aic_resumes_preview CASCADE;
CREATE TABLE aic_resumes_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    url VARCHAR(2048),
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    CHECK (url IS NOT NULL OR text IS NOT NULL)
);

CREATE TRIGGER update_resumes_last_updated_at
BEFORE UPDATE ON aic_resumes_preview
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
BEFORE INSERT OR UPDATE ON aic_resumes_preview
FOR EACH ROW EXECUTE FUNCTION check_resume_fields();

-- AI Responses; refactor this
DROP TABLE IF EXISTS aic_airesponses_preview CASCADE;
CREATE TABLE aic_airesponses_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    generated_company_info TEXT,
    generated_interview_prep_info TEXT,
    usage JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    overall_status VARCHAR(255),
    overall_status_response TEXT,
    behavioral_status VARCHAR(255),
    behavioral_status_response TEXT,
    case_status VARCHAR(255),
    case_status_response TEXT,
    role_status VARCHAR(255),
    role_status_response TEXT,
    technical_status VARCHAR(255),
    technical_status_response TEXT,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES aic_jobs_preview(id) ON DELETE CASCADE,
    CONSTRAINT unique_profile_job_airesponses_preview UNIQUE (profile_id, job_id)
);

CREATE TRIGGER update_airesponses_last_updated_at
BEFORE UPDATE ON aic_airesponses_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Prompts
DROP TABLE IF EXISTS aic_prompts_preview CASCADE;
CREATE TABLE aic_prompts_preview (
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

CREATE TRIGGER update_prompts_last_updated_at
BEFORE UPDATE ON aic_prompts_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- DROP TABLE IF EXISTS aic_job_sessions_preview CASCADE;
-- CREATE TABLE aic_job_sessions_preview (
--     id SERIAL PRIMARY KEY,
--     profile_id INTEGER NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE
-- );

-- CREATE TRIGGER update_job_sessions_last_updated_at
-- BEFORE UPDATE ON aic_job_sessions_preview
-- FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Questions for a job
DROP TABLE IF EXISTS aic_questions_preview CASCADE;
CREATE TABLE aic_questions_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    category VARCHAR(255),
    question TEXT,
    why TEXT,
    focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES aic_jobs_preview(id) ON DELETE CASCADE
);

CREATE TRIGGER update_questions_last_updated_at
BEFORE UPDATE ON aic_questions_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Answers to questions
DROP TABLE IF EXISTS aic_answers_preview CASCADE;
CREATE TABLE aic_answers_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES aic_job_questions_preview(id) ON DELETE CASCADE
);
CREATE TRIGGER update_answers_last_updated_at
BEFORE UPDATE ON aic_answers_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Scores for answers
DROP TABLE IF EXISTS aic_scores_preview CASCADE;
CREATE TABLE aic_scores_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    answer_id INTEGER NOT NULL,
    total_score DECIMAL(5,2),
    scores JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES aic_job_question_answers_preview(id) ON DELETE CASCADE,
    CONSTRAINT unique_profile_answer_score_preview UNIQUE (profile_id, answer_id)
);

CREATE TRIGGER update_scores_last_updated_at
BEFORE UPDATE ON aic_scores_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Suggestions - what is this for? should be renamed
DROP TABLE IF EXISTS aic_suggestions_preview CASCADE;
CREATE TABLE aic_suggestions_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer_id INTEGER NOT NULL,
    category VARCHAR(255),
    suggestion_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES aic_jobs_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES aic_job_questions_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES aic_job_question_answers_preview(id) ON DELETE CASCADE
);

CREATE TRIGGER update_suggestions_last_updated_at
BEFORE UPDATE ON aic_suggestions_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- Job Readiness
DROP TABLE IF EXISTS aic_job_readiness_preview CASCADE;
CREATE TABLE aic_job_readiness_preview (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    category VARCHAR(255),
    readiness_rating VARCHAR(255),
    readiness_text TEXT,
    is_up_to_date BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES aic_profiles_preview(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES aic_jobs_preview(id) ON DELETE CASCADE,
    UNIQUE (profile_id, job_id, category)
);

CREATE TRIGGER update_job_readiness_last_updated_at
BEFORE UPDATE ON aic_job_readiness_preview
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

-- INSERT INTO aic_job_readiness_preview (
--     profile_id,
--     job_id,
--     category,
--     readiness_rating,
--     readiness_text,
--     is_up_to_date
-- ) VALUES (
--     26,
--     32,
--     'Overall',
--     'Kinda Ready',
--     '* Technical knowledge is a significant concern and requires immediate attention.',
--     TRUE
-- );
