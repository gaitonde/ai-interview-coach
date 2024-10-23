'use client'

import { Button } from "@/components/ui/button"
import { Footer } from '../footer'
import { Clipboard } from 'lucide-react'
export function ListOfQuestionsComponent() {
  const generalQuestions = [
    {
      question: "How would you prioritize features for a new product aimed at organizing and improving access to information?",
      whyAsking: "TechCorp wants to assess your ability to make strategic decisions when managing a product's feature set, especially when you have limited resources.",
      whatToFocus: "Discuss how you would prioritize features using frameworks like RICE or MoSCoW. You can give an example where you used data-driven methods to prioritize features, such as focusing on the most impactful updates when building out InfoNet, TechCorp's information management tool."
    },
    {
      question: "Describe a time when you made a data-driven decision. How would you apply data-driven decision-making in your role as a TechCorp Inc. Product Manager Intern?",
      whyAsking: "TechCorp relies heavily on data to make product decisions and expects you to have a clear understanding of how to leverage it to improve products.",
      whatToFocus: "Highlight a specific instance where data guided your decision-making process. For instance, you can mention analyzing user interactions in MapTrail and how that data led you to optimize the app's user interface to enhance engagement."
    },
    {
      question: "How would you approach building a product roadmap for a new TechCorp product that targets small businesses?",
      whyAsking: "They want to know if you can plan strategically and align short-term and long-term goals, especially for new markets like small businesses.",
      whatToFocus: "Explain how you would build an MVP and iterate based on feedback. Use an example, like developing BizStream for small businesses, where you balanced immediate user needs with the broader company objectives."
    },
    {
      question: "How would you handle feedback from multiple teams (e.g., engineering, marketing, legal) while working on a product at TechCorp Inc.?",
      whyAsking: "TechCorp values cross-functional collaboration. They want to see how you navigate and integrate diverse perspectives to ensure a product's success.",
      whatToFocus: "Share a time when you worked across different teams to launch a feature, perhaps in SyncCloud, where you mediated between engineering's technical priorities and marketing's customer-facing goals."
    },
    {
      question: "Explain how you would evaluate the success of a new feature post-launch.",
      whyAsking: "They want to gauge your ability to measure outcomes and understand key success metrics post-launch.",
      whatToFocus: "Talk about using KPIs such as adoption rates and user satisfaction. For example, you might evaluate a new collaboration feature in DocuLink by tracking engagement and collecting user feedback to inform future iterations."
    },
    {
      question: "How would you gather and integrate user feedback into product improvements at TechCorp Inc.?",
      whyAsking: "TechCorp wants to understand how you approach iterative product development and your ability to incorporate user feedback.",
      whatToFocus: "Explain your approach to continuous improvement based on user feedback from TechCorp Analytics or surveys. You can mention gathering insights on a new feature in MailPro and using that data to make improvements."
    },
    {
      question: "How would you approach competitive analysis for TechCorp's cloud computing products?",
      whyAsking: "Competitive analysis is key for TechCorp to stay ahead in the market. They want to ensure you know how to assess and differentiate their products.",
      whatToFocus: "Use examples like comparing SyncCloud to competitors like CloudPrime. Explain how you would identify key differentiators, such as superior integration with OfficeStream and customer-focused features."
    },
    {
      question: "What would your go-to-market strategy look like for a new feature in TechCorp Workspace?",
      whyAsking: "They are assessing your understanding of product launches and your ability to plan a successful market entry.",
      whatToFocus: "Outline a launch strategy for a TechCorp Workspace feature, such as organizing product demos for key user groups, leveraging email marketing campaigns, and using social media to build awareness."
    },
    {
      question: "How would you foster innovation within a product team at TechCorp Inc.?",
      whyAsking: "TechCorp is known for innovation, and they want to see how you would encourage creativity and new ideas within your team.",
      whatToFocus: "Highlight how you foster experimentation, perhaps through TechCorp's hackathons or the 20% time policy. Explain how you led a team that developed an innovative feature for MeetHub during one of these initiatives."
    },
    {
      question: "Explain how you would use Agile methodologies to manage product development for a TechCorp product.",
      whyAsking: "TechCorp uses Agile practices to drive product development, and they want to ensure you can manage iterative cycles effectively.",
      whatToFocus: "Share an example of how you applied Agile principles, like running sprints to launch new features in SyncCloud, and how the feedback loops enabled you to release a refined product."
    }
  ]

  const companySpecificQuestions = [
    {
      question: "How would you contribute to TechCorp's mission of organizing the world's information as a Product Manager Intern?",
      whyAsking: "TechCorp's core mission revolves around organizing information, and they want to know how you align with that.",
      whatToFocus: "Mention specific product initiatives you would take to improve InfoNet, such as making search results more personalized and accessible to a broader audience."
    },
    {
      question: "What product metrics would you prioritize when evaluating the success of a new consumer-facing TechCorp product?",
      whyAsking: "TechCorp wants to understand if you know which metrics are crucial for measuring product success.",
      whatToFocus: "Highlight metrics like DAUs, retention, and satisfaction rates. For example, discuss how you would evaluate the success of a new MeetHub feature by monitoring usage and feedback data."
    },
    {
      question: "How would you ensure that a new TechCorp product aligns with its focus on user-first development?",
      whyAsking: "They want to confirm that you understand TechCorp's user-centric philosophy.",
      whatToFocus: "Share your approach to incorporating user feedback into product development. For example, discuss your work on DocuLink, ensuring that every feature addresses real user needs and improves productivity."
    },
    {
      question: "How would you localize a TechCorp product for international markets while maintaining TechCorp's global brand identity?",
      whyAsking: "TechCorp wants to see how you can balance localization with maintaining a consistent brand.",
      whatToFocus: "Talk about localizing MapTrail for different regions by adapting language and cultural considerations, while ensuring the core brand experience remains the same globally."
    },
    {
      question: "How would you incorporate TechCorp's focus on AI into a new product?",
      whyAsking: "TechCorp emphasizes AI as part of their innovation strategy, and they want to see how you would use it.",
      whatToFocus: "Discuss how you would implement AI-driven features in PhotoVault to improve image search by automatically categorizing and tagging user-uploaded content."
    },
    {
      question: "How would you integrate user privacy considerations into a new TechCorp product?",
      whyAsking: "TechCorp values privacy, and they want to ensure you understand how to build products that respect user data.",
      whatToFocus: "Mention how you'd use privacy-by-design principles. For example, explain how you ensured MailPro complies with GDPR by implementing opt-in data collection and anonymization features."
    },
    {
      question: "How would you improve the user experience for a feature in MapTrail?",
      whyAsking: "TechCorp seeks to understand your focus on UX and how you enhance existing product features.",
      whatToFocus: "Highlight your approach to improving usability, such as using AR in MapTrail to offer real-time navigation assistance and enhancing visual cues for a better user experience."
    },
    {
      question: "What strategies would you use to promote collaboration across TechCorp's global teams when launching a new product?",
      whyAsking: "TechCorp operates globally, and they want to see if you can handle cross-regional collaboration.",
      whatToFocus: "Describe your strategy for leveraging tools like OfficeStream to coordinate international product launches, ensuring consistent communication and alignment among teams in different time zones."
    },
    {
      question: "How would you identify and mitigate potential risks for a new feature in SyncCloud?",
      whyAsking: "Risk management is essential in product launches, and they want to know how you approach it.",
      whatToFocus: "Talk about risk assessment methods and how you would ensure features have necessary security protocols and redundancies. For instance, mention how you implemented data encryption for SyncCloud to mitigate data privacy risks."
    },
    {
      question: "How would you gather and analyze competitive intelligence when launching a product to compete with similar services?",
      whyAsking: "Competitive analysis is key for TechCorp, and they want to understand your approach.",
      whatToFocus: "Explain how you'd perform a SWOT analysis by tracking competitors like FlexData and identifying areas where SyncCloud excels, such as offering better integration with TechCorp Workspace tools."
    }
  ]

  const softSkillsQuestions = [
    {
      question: "Tell me about a time you led a cross-functional team through a challenging project. How did you ensure the team stayed motivated and on track?",
      whyAsking: "TechCorp values leadership and collaboration, and they want to see how you handle team dynamics under pressure.",
      whatToFocus: "Describe how you kept a team aligned and motivated, like leading the development of MapTrail, where you coordinated efforts across engineering, UX, and marketing to deliver a key feature under tight deadlines."
    },
    {
      question: "How do you approach communication when working with stakeholders who have competing interests?",
      whyAsking: "They want to know if you can manage conflicting priorities while maintaining clear communication.",
      whatToFocus: "Talk about managing expectations and finding common ground. For example, you could explain how you balanced technical requirements and legal concerns when working on SyncCloud's new compliance feature."
    },
    {
      question: "Can you describe a situation where you had to adapt to a sudden change in project direction? How did you handle it?",
      whyAsking: "TechCorp values adaptability, especially in fast-changing environments.",
      whatToFocus: "Discuss how you adjusted to new priorities, like shifting focus in the middle of a sprint for VoiceMate when a new customer need emerged, and how you kept the team aligned despite the change."
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
                  <p className="text-[#D1D5DB]"><em>Why they're asking:</em> {item.whyAsking}</p>
                  <p className="text-[#F9FAFB]"><em>What you should focus on:</em> {item.whatToFocus}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Targeted Company Market Questions</h2>
              {companySpecificQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-[#F9FAFB]"><strong>{index + 1}. {item.question}</strong></p>
                  <p className="text-[#D1D5DB]"><em>Why they're asking:</em> {item.whyAsking}</p>
                  <p className="text-[#F9FAFB]"><em>What you should focus on:</em> {item.whatToFocus}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Soft Skills Questions</h2>
              {softSkillsQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-[#F9FAFB]"><strong>{index + 1}. {item.question}</strong></p>
                  <p className="text-[#D1D5DB]"><em>Why they're asking:</em> {item.whyAsking}</p>
                  <p className="text-[#F9FAFB]"><em>What you should focus on:</em> {item.whatToFocus}</p>
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