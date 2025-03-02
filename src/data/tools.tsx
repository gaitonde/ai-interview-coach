import { PersonIcon } from "@radix-ui/react-icons"
import { Building2, HelpCircle, MessageSquare, Music, Mic2, Lightbulb, Star, MessageCircleQuestion, FileText } from "lucide-react"

export type Tool = {
  icon: JSX.Element;
  title: string;
  description: string;
  slug: string;
  label?: string;
  disabled?: boolean;
  inputTypes: InputType[];
  outputType: OutputType;
  trending?: boolean;
};

export type InputType =
  'Resume'
  | 'CompanyUrl'
  | 'JdUrl'
  | 'InterviewerLIURL'
  | 'RoleName'
  | 'Question'
;

export type OutputType = 'Markdown' | 'HTML' | 'Custom';

export const tools: Tool[] = [
  {
    icon: <FileText className="h-8 w-8 text-emerald-400" />,
    title: "Know Your Resume",
    description: "Master the tough resume questions—before your interviewer asks them.",
    slug: "know-your-resume",
    inputTypes: ['Resume'],
    outputType: 'Markdown',
    trending: true
  },
  {
    icon: <PersonIcon className="h-8 w-8 text-emerald-400" />,
    title: "Interviewer Scout",
    description: "Know your interviewer's background in seconds—before you step into the call.",
    slug: "interviewer-scout",
    inputTypes: ['Resume', 'CompanyUrl', 'JdUrl', 'InterviewerLIURL'],
    outputType: 'Markdown'
  },
  {
    icon: <Building2 className="h-8 w-8 text-emerald-400" />,
    title: "Company Scout",
    description: "Research the company in minutes so you can interview with confidence.",
    slug: "company-scout",
    inputTypes: ['Resume', 'CompanyUrl', 'JdUrl'],
    outputType: 'Markdown'
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-emerald-400" />,
    title: "Question Scout",
    description: "See the types and styles of questions you will get asked for this role at this company.",
    slug: "question-scout",
    inputTypes: ['Resume', 'CompanyUrl', 'JdUrl'],
    outputType: 'Markdown'
    // label: "New",
    // users: "2100 users",
    // trending: true,
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-emerald-400" />,
    title: "Interview Question Predictor",
    description: "Get tailored questions based on the role, company, and industry—be one step ahead.",
    slug: "interview-question-predictor",
    inputTypes: ['Resume', 'CompanyUrl', 'JdUrl'],
    outputType: 'Markdown',
    label: "New",
  },
  {
    icon: <Star className="h-8 w-8 text-emerald-400" />,
    title: "STAR Stories Creator",
    description: "Build a arsenal of impactful STAR stories to showcase your skills and experiences.",
    slug: "star-stories-creator",
    inputTypes: ['Resume'],
    outputType: 'Markdown',
    label: "New",
  },
  {
    icon: <MessageCircleQuestion className="h-8 w-8 text-emerald-400" />,
    title: "BYOQuestion",
    description: "Get advice on how to approach YOUR interview question.",
    slug: "byoq",
    inputTypes: ['RoleName', 'Question'],
    outputType: 'Markdown',
    label: "New",
  },

  // {
  //   icon: <Lightbulb className="h-8 w-8 text-emerald-400" />,
  //   title: "Questions To Ask the Interviewer",
  //   description: "Impress interviewers with thought-provoking questions that showcase your expertise.",
  //   users: "1730 users",
  //   popular: true,
  // },
  // {
  //   icon: <MessageSquare className="h-8 w-8 text-emerald-400" />,
  //   title: "Interview Question Predictor",
  //   description: "Get tailored questions based on the role, company, and industry—be one step ahead.",
  //   users: "1950 users",
  // },
  // {
  //   icon: <Music className="h-8 w-8 text-emerald-400" />,
  //   title: "Interview Jam Session",
  //   description: "Practice answering real-time questions and receive instant feedback to improve.",
  //   label: "New",
  // },
  // {
  //   icon: <Sparkles className="h-8 w-8 text-emerald-400" />,
  //   title: "Tell Me About Yourself Generator",
  //   description: "Craft a compelling personal pitch that captures attention and sets you apart.",
  //   label: "Coming Soon",
  // },
  // {
  //   icon: <Mic2 className="h-8 w-8 text-emerald-400" />,
  //   title: "Any Question Coach",
  //   description: "Get personalized coaching on tackling any interview question—boost your confidence.",
  //   label: "Coming Soon",
  // },
]