# To Discuss / Triage
- Fix waiting state on interview practice page
- Add privacy page
- Add terms of service page
- Demo link


---
# Now
- [ ] Unhide copy button on Job Prep page
- [ ] Interview Prep Page: Fix/test mobile record button

# Next
- [ ] Improve testability
- [ ] N2H: "interim/wait" page that describes the sections on the job prep
- [ ] Check out putting queries up front
- [ ] Auth/Login/Signup
- [ ] Break up profile setup
- [ ] Discuss Demo Mode (how to show)
- [ ] Figure out a better way to handle versioning/handling prompts
- [ ] Multi-jobs; Use sessions; right now every run is a new profile

# Later
- [ ] Add Nav
- [ ] Add Home Page
- [ ] Wait state on Job Prep page
- [ ] Look at locking down public access to the resume file
- [ ] Validation on prompts from webhook
- [ ] Fix build linter errors

---
# Flow
1. [Profile Setup] Setup profile (/) - prompted for resume, school stuff, etc + interview: name, role
2. [Company Scoop] Get job prep page (/job-prep) - company overview, job fit, pitch
3. [Awesome Interview Cheat Sheet] Get interview prep page (/interview-prep) - questions to ask, questions i'll be asked, stories to tell
4. [Interview Jam Session] Get Practice (/interview-practice) - get questions, record and get score and feedback

---
# Done
- [x] add email to profile setup page
- [x] Profile Setup Page: Make it real; Pass and save data to db (upload file); parse the pdf for text
- [x] Update Prompt for Job Prep
- [x] Update Prompt for Questions
- [x] Add link to home page on questions page
- [x] Wait state before Job Prep page
- [x] Remove default values from Profile Setup page
- [x] Markdown formatting for Job Prep + Questions pages
- [x] Validation for the Profile Setup page
- [x] Google Spreadsheet Integration
- [x] Connect model to Google Sheet
- [x] Stop years at 2028
- [x] Implement Grade logic
- [x] Move questions call to Questions page
- [x] Update Prompts
- [x] Talk about what is desired in "version" in job prep page
- [x] Store AI response metrics in db
- [x] Add Initial Interviewer Page and all associated navigation
- [x] Add Interviewer name and role to model and ui
- [x] Change prompt to only ask for only 1 question of each type for
- [x] Put back in token limit: 10k?
- [x] Update button on Interviewer page to goto "Profile Setup" page
- [x] Update button on Interviewer page to goto "Job Prep" page
- [x] Store answers in db
- [x] Store scores in db
- [x] Manually insert questions into db
- [x] Add new button on Interviewer page to goto "next" question
- [x] Iterate over questions for Interviewer
- [x] each answer has it's score; question just shows latest score? => Yes
- [x] Add new "Interview Prep" Page
- [x] DG: add section for question, why, focus
- [x] Insert records into questions table after AI call
- [x] Update prompt to get back questions in json format
- [x] Add the question to the prompt
- [x] Debug why the prompt update is not working in prod
- [x] Interview Practice Page: Fix getting of questions
- [x] Interview Practice Page: Fix next/previous question buttons
- [x] Interview Practice Page: Fix disabled state
- [x] Interview Practice Page: fix the suggestion thingy
- [x] Interview Practice Page: Store suggestions in db
- [x] Interview Practice Page: Fix getting of answers
- [x] Interview Prep Page: Fix title; 4 cases (name + role, name only, role only, neither)
- [x] Interview Prep Page: Add a "Back Question" button
- [x] Interview Prep Page: Add a "Header" for manual transcript; update button text
- [x] Interview Prep Page: N2H Show total questions
