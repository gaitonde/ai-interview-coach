'use client'

import { Button } from "@/components/ui/button"
import { Footer } from './components-footer'
import { Clipboard } from 'lucide-react'

export function ListOfQuestionsComponent() {
  const generalQuestions = [
    {
      question: "How would you prioritize features for a new product aimed at organizing and improving access to information?",
      skillTested: "Prioritization and decision-making in product development.",
      exampleSolution: "Use a prioritization framework like RICE (Reach, Impact, Confidence, Effort) to evaluate features with the highest user impact. For example, for InfoNet, prioritize features that improve relevance and response time, based on user behavior data and feedback."
    },
    {
      question: "Describe a time when you made a data-driven decision. How would you apply data-driven decision-making in your role as a TechCorp Inc. Product Manager Intern?",
      skillTested: "Data-driven decision making.",
      exampleSolution: "Use user engagement data from TechCorp Analytics to inform decisions. For example, if analyzing user interactions on MapTrail, make decisions on feature improvements by identifying key areas where users struggle and enhancing those."
    },
    {
      question: "How would you approach building a product roadmap for a new TechCorp product that targets small businesses?",
      skillTested: "Roadmap planning and execution.",
      exampleSolution: "Develop an MVP focused on addressing small business pain points, such as managing online presence. Iterate based on user feedback and align the roadmap with long-term goals of empowering small businesses through BizStream, TechCorp's small business platform."
    },
    {
      question: "How would you handle feedback from multiple teams (e.g., engineering, marketing, legal) while working on a product at TechCorp Inc.?",
      skillTested: "Cross-functional collaboration.",
      exampleSolution: "Facilitate regular meetings with cross-functional teams to ensure alignment and address concerns early in the development process. For example, consider legal implications during feature planning to avoid potential delays in the release of SyncCloud, TechCorp's cloud storage solution."
    },
    {
      question: "Explain how you would evaluate the success of a new feature post-launch.",
      skillTested: "Product lifecycle management and performance evaluation.",
      exampleSolution: "Use KPIs such as user engagement, adoption rates, and satisfaction scores. For example, after launching a feature in DocuLink, measure success through feature usage, feedback, and A/B testing different versions for performance improvement."
    },
    {
      question: "How would you gather and integrate user feedback into product improvements at TechCorp Inc.?",
      skillTested: "User feedback integration.",
      exampleSolution: "Implement in-app surveys or track user behavior through TechCorp Analytics. Use feedback to inform product iteration. For example, if a new feature in MailPro receives poor feedback, identify the pain points and modify the feature based on user suggestions."
    },
    {
      question: "How would you approach competitive analysis for TechCorp's cloud computing products?",
      skillTested: "Market research and competitive analysis.",
      exampleSolution: "Perform a SWOT analysis comparing SyncCloud to competing services like CloudPrime and FlexData. Identify opportunities for differentiation, such as providing superior integration with other TechCorp services, and emphasize this in your strategy."
    },
    {
      question: "What would your go-to-market strategy look like for a new feature in TechCorp Workspace?",
      skillTested: "Go-to-market strategy and execution.",
      exampleSolution: "Time the feature launch around key business events like quarter-end or fiscal-year-end. Engage in marketing campaigns targeted to relevant user groups, such as businesses needing enhanced productivity features in OfficeStream, TechCorp's collaborative workspace."
    },
    {
      question: "How would you foster innovation within a product team at TechCorp Inc.?",
      skillTested: "Innovation and creativity in product development.",
      exampleSolution: "Encourage team members to explore new ideas during internal hackathons or through TechCorp's 20% time policy. Develop experimental features and test them in limited user groups before full release."
    },
    {
      question: "Explain how you would use Agile methodologies to manage product development for a TechCorp product.",
      skillTested: "Agile methodologies and iterative development.",
      exampleSolution: "Implement Agile sprints, focusing on delivering value in short iterations. For example, when building new features for MeetHub, use feedback from each sprint to refine product development and ensure alignment with user needs."
    }
  ]

  const companySpecificQuestions = [
    {
      question: "How would you contribute to TechCorp Inc.'s mission of organizing the world's information as a Product Manager Intern?",
      explanation: "Tests understanding of TechCorp's core mission.",
      exampleSolution: "Focus on developing user-centric products that enhance accessibility to information. For example, propose improvements to InfoNet that personalize results based on user behavior and preferences to enhance user experience."
    },
    {
      question: "What product metrics would you prioritize when evaluating the success of a new consumer-facing TechCorp product?",
      explanation: "Tests understanding of product success metrics.",
      exampleSolution: "Prioritize metrics like active users, retention rates, and user satisfaction scores. For example, with a new MeetHub feature, evaluate success based on user engagement during meetings, feature usage, and overall satisfaction."
    },
    {
      question: "How would you ensure that a new TechCorp product aligns with its focus on user-first development?",
      explanation: "Ensures understanding of TechCorp's user-centric approach.",
      exampleSolution: "Conduct user research and iterate based on feedback, ensuring the product adheres to TechCorp's Design Standards for a seamless experience across devices."
    },
    {
      question: "How would you localize a TechCorp product for international markets while maintaining TechCorp's global brand identity?",
      explanation: "Tests ability to scale TechCorp products globally while respecting local differences.",
      exampleSolution: "Use TechCorp's localization teams to adapt content for regional languages and cultural preferences. Ensure consistency with the overall brand by maintaining TechCorp's design standards while allowing for regional variations."
    },
    {
      question: "How would you incorporate TechCorp's focus on AI into a new product?",
      explanation: "Ensures awareness of TechCorp's strengths in AI.",
      exampleSolution: "Leverage TechCorp's AI tools, such as machine learning algorithms, to enhance user experience. For example, develop smarter autocomplete suggestions in DocuLink that predict user needs based on historical usage data."
    },
    {
      question: "How would you integrate user privacy considerations into a new TechCorp product?",
      explanation: "Ensures alignment with TechCorp's emphasis on privacy.",
      exampleSolution: "Apply privacy-by-design principles, ensuring user data is anonymized and opt-in for any sensitive data collection. For example, in PhotoVault, ensure that user-uploaded images are securely stored and private until explicitly shared."
    },
    {
      question: "How would you improve the user experience for a feature in MapTrail?",
      explanation: "Focuses on enhancing user interaction with a widely used TechCorp product.",
      exampleSolution: "Propose introducing AR-based real-time navigation that overlays directional arrows onto a user's environment through the camera, making navigation more intuitive and immersive for users on foot."
    },
    {
      question: "What strategies would you use to promote collaboration across TechCorp's global teams when launching a new product?",
      explanation: "Tests ability to navigate TechCorp's global operations.",
      exampleSolution: "Leverage OfficeStream to enable collaboration across time zones and locations. For instance, coordinate weekly meetings and detailed documentation to keep all global stakeholders aligned when rolling out new features for SyncCloud."
    },
    {
      question: "How would you identify and mitigate potential risks for a new feature in SyncCloud?",
      explanation: "Tests risk management in a cloud services context.",
      exampleSolution: "Use risk assessment frameworks to evaluate potential technical and operational risks. For example, ensure that SyncCloud's new data management features include built-in redundancies and comply with data security standards."
    },
    {
      question: "How would you gather and analyze competitive intelligence when launching a product to compete with similar services?",
      explanation: "Tests ability to perform competitive analysis in the context of TechCorp's key competitors.",
      exampleSolution: "Track competitors' product releases, user reviews, and performance metrics, then perform a SWOT analysis to identify gaps. For example, when launching a new AI-powered tool, focus on where TechCorp's capabilities surpass those of competitors like FlexData or DataPrime."
    }
  ]

  const softSkillsQuestions = [
    {
      question: "Describe a time when you led a cross-functional team through a challenging project. How did you ensure the team stayed motivated and on track?",
      skillTested: "Leadership & Initiative.",
      exampleSolution: "Focus on how you facilitated collaboration, aligned the team around a common goal, and handled obstacles. For example, you might lead a team developing a MapTrail feature by organizing regular check-ins, ensuring clear communication, and addressing any blockers."
    },
    {
      question: "How do you approach communication when working with stakeholders who have competing interests?",
      skillTested: "Communication.",
      exampleSolution: "Show how you balance transparency with diplomacy, ensuring all stakeholders feel heard while driving the project toward a solution. For example, if engineering and legal have different priorities for a product, facilitate a discussion to find common ground while aligning with TechCorp's goals."
    },
    {
      question: "Can you describe a situation where you had to adapt to a sudden change in project direction? How did you handle it?",
      skillTested: "Adaptability.",
      exampleSolution: "Highlight how you quickly assessed the new situation, adjusted priorities, and communicated the change to the team. For example, if a key feature for VoiceMate had to be reprioritized due to technical limitations, explain how you shifted focus while keeping the team engaged."
    },
    {
      question: "Tell us about a time you had to resolve a conflict within your team. What steps did you take to address the issue?",
      skillTested: "Conflict Resolution.",
      exampleSolution: "Emphasize active listening, understanding both sides, and finding a compromise. For example, if two engineers disagree on the best way to implement a feature for PhotoVault, you might facilitate a discussion to identify the pros and cons of each approach and agree on the most feasible solution."
    },
    {
      question: "How do you manage your time when working on multiple projects with tight deadlines?",
      skillTested: "Time Management.",
      exampleSolution: "Describe how you prioritize tasks, delegate where possible, and use tools (like TechCorp Tasks) to stay organized. For example, managing multiple feature releases might involve creating detailed timelines, prioritizing tasks based on their impact, and using Agile sprints to stay on track."
    },
    {
      question: "Tell us about a time when you collaborated with a team to solve a difficult problem. What role did you play?",
      skillTested: "Teamwork & Collaboration.",
      exampleSolution: "Explain how you contributed to the team effort. For example, if working with UX designers and engineers to improve MeetHub, you might facilitate discussions, synthesize inputs from all parties, and ensure that user experience improvements aligned with technical feasibility."
    },
    {
      question: "Describe a time when you encountered an unexpected problem during a project. How did you solve it?",
      skillTested: "Problem Solving.",
      exampleSolution: "Focus on your ability to think critically and find creative solutions. For example, if a SyncCloud feature failed during testing, describe how you quickly worked with engineers to diagnose the issue, proposed solutions, and ensured the feature was fixed before the next sprint."
    },
    {
      question: "Tell me about a time you had to make a difficult decision with limited information. How did you approach the decision-making process?",
      skillTested: "Decision Making.",
      exampleSolution: "Describe how you gathered as much information as possible, evaluated the risks, and made the best decision under the circumstances. For example, if launching a new feature for InfoNet with limited data, explain how you used past user feedback or industry benchmarks to guide the decision."
    },
    {
      question: "Give an example of a time when you showed empathy in a professional setting. How did it help the situation?",
      skillTested: "Empathy.",
      exampleSolution: "Highlight how understanding the perspectives of team members or stakeholders led to a better outcome. For instance, if a team member was struggling with a task, you might have adjusted deadlines or provided additional resources to help them succeed."
    },
    {
      question: "How do you manage relationships with stakeholders to ensure project success?",
      skillTested: "Stakeholder Management.",
      exampleSolution: "Describe how you communicate regularly, manage expectations, and ensure stakeholders are aligned with the project's goals. For example, when managing a SyncCloud product launch, you might schedule regular updates and involve stakeholders in key decisions to ensure transparency and buy-in."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="prep-sheet-content">
          <div className="w-full max-w-4xl p-6 sm:p-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#10B981] text-center">Interview Prep Sheet for TechCorp Inc.</h1>
              <p className="text-[#F9FAFB] text-center">2025 Product Manager Intern</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">General Technology Product Management Questions</h2>
              {generalQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-[#F9FAFB]"><strong>{index + 1}. {item.question}</strong></p>
                  <p className="text-[#D1D5DB]">Skill being tested: {item.skillTested}</p>
                  <p className="text-[#F9FAFB]">Example solution: {item.exampleSolution}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Targeted Company Market Questions (TechCorp Inc.-Specific)</h2>
              {companySpecificQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-[#F9FAFB]"><strong>{index + 1}. {item.question}</strong></p>
                  <p className="text-[#D1D5DB]">Explanation: {item.explanation}</p>
                  <p className="text-[#F9FAFB]">Example solution: {item.exampleSolution}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Soft Skills Questions (Prioritized by  Importance)</h2>
              {softSkillsQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-[#F9FAFB]"><strong>{index + 1}. {item.question}</strong></p>
                  <p  className="text-[#D1D5DB]">Skill being tested: {item.skillTested}</p>
                  <p className="text-[#F9FAFB]">Example solution: {item.exampleSolution}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <p className="text-[#F9FAFB] italic">This prep sheet is personalized for TechCorp Inc. Product Manager Intern position. Note that the prep sheet is meant as a guide based on the information provided. You should verify all information. Good luck with your interview!</p>
            </div>
            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const content = document.querySelector('.prep-sheet-content')?.textContent;
                  if (content) {
                    navigator.clipboard.writeText(content)
                      .then(() => alert('Content copied to clipboard!'))
                      .catch(err => console.error('Failed to copy: ', err));
                  }
                }
              }}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors flex items-center justify-center"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
