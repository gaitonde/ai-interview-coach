-- Insert sample data into ai_interview_coach_Profiles
INSERT INTO ai_interview_coach_Profiles (school, major, concentration, graduation_date)
VALUES
    ('Stanford University', 'Computer Science', 'Artificial Intelligence', '2024-06-15'),
    ('MIT', 'Electrical Engineering', 'Robotics', '2023-05-20'),
    ('Harvard University', 'Business Administration', 'Finance', '2025-05-30');

-- Insert sample data into ai_interview_coach_Jobs
INSERT INTO ai_interview_coach_Jobs (profile_id, url, text)
VALUES
    (1, 'https://example.com/job1', 'Software Engineer at Tech Corp'),
    (1, 'https://example.com/job2', 'Data Scientist at AI Innovations'),
    (2, 'https://example.com/job3', 'Robotics Engineer at Future Robotics'),
    (3, 'https://example.com/job4', 'Financial Analyst at Big Bank');

-- Insert sample data into ai_interview_coach_Resumes
INSERT INTO ai_interview_coach_Resumes (profile_id, url, text)
VALUES
    (1, 'https://example.com/resume1', 'John Doe - Software Engineer Resume'),
    (2, 'https://example.com/resume2', 'Jane Smith - Robotics Engineer Resume'),
    (3, 'https://example.com/resume3', 'Alice Johnson - Financial Analyst Resume');
