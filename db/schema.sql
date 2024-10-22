-- Create ai_interview_coach_Profiles table
CREATE TABLE ai_interview_coach_prod_Profiles (
    id SERIAL PRIMARY KEY,
    school VARCHAR(255) NOT NULL,
    major VARCHAR(255) NOT NULL,
    concentration VARCHAR(255),
    graduation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_interview_coach_Jobs table
CREATE TABLE ai_interview_coach_prod_Jobs (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    company_name VARCHAR(255),
    company_url VARCHAR(2048),
    jd_url VARCHAR(2048),
    jd_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_Profiles(id) ON DELETE CASCADE,
    CHECK (jd_url IS NOT NULL OR jd_text IS NOT NULL)
);

-- Create Resumes table
CREATE TABLE ai_interview_coach_prod_Resumes (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    url VARCHAR(2048),
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_Profiles(id) ON DELETE CASCADE,
    CHECK (url IS NOT NULL OR text IS NOT NULL)
);

--Create a table to store the AI responses
CREATE TABLE ai_interview_coach_prod_AIResponses (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    prep_sheet_response TEXT,
    questions_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES ai_interview_coach_prod_Profiles(id) ON DELETE CASCADE
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
BEFORE UPDATE ON ai_interview_coach_prod_Profiles
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE TRIGGER update_jobs_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_Jobs
FOR EACH ROW EXECUTE FUNCTION update_last_updated_at();

CREATE TRIGGER update_resumes_last_updated_at
BEFORE UPDATE ON ai_interview_coach_prod_Resumes
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
BEFORE INSERT OR UPDATE ON ai_interview_coach_prod_Resumes
FOR EACH ROW EXECUTE FUNCTION check_resume_fields();
