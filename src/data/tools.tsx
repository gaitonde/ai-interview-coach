import {
  Building2,
  Dumbbell,
  FileText,
  HelpCircle,
  MessageCircleQuestion,
  MessageSquare,
  Star,
  User
} from 'lucide-react';
import { z } from 'zod';
import { pickFormFields } from './form-fields';
import { Tool } from '@/types/tools';

type BaseValidation = {
  label: string;
  optional?: boolean;
}

export type TextValidation = BaseValidation & {
  type: 'text';
  placeholderText?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export type TextAreaValidation = BaseValidation & {
  type: 'textarea';
  placeholderText?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

type UrlValidation = BaseValidation & {
  type: 'url';
  placeholderText?: string;
  validation?: {
    protocols?: ('http' | 'https')[];
    allowedDomains?: string[];
  };
}

type FileValidation = BaseValidation & {
  type: 'file';
  validation?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[]; // e.g., ['pdf', 'doc', 'docx']
  };
}

export type DropDownValidation = BaseValidation & {
  type: 'dropdown';
  validation: {
    allowedValues: string[];
  };
}

export type EmailValidation = BaseValidation & {
  type: 'email';
  validation?: {
    allowedDomains?: string[];
  };
}

export type YearValidation = BaseValidation & {
  type: 'year';
  validation?: {
    minYear?: number;
    maxYear?: number;
    allowFuture?: boolean;
  };
}

export enum GradeClass {
  Freshman = 'Freshman',
  Sophomore = 'Sophomore',
  Junior = 'Junior',
  Senior = 'Senior',
  Graduate = 'Graduate'
}

export type GradeClassValidation = BaseValidation & {
  type: 'gradeClass';
  validation?: {
    gradeClass?: GradeClass;  // Optional: specify which grades are allowed
  };
}

export type FormFieldValidation = TextValidation
  | TextAreaValidation
  | FileValidation
  | UrlValidation
  | DropDownValidation
  | EmailValidation
  | YearValidation
  | GradeClassValidation
;

export type OutputType = 'Markdown' | 'Json' | 'None';

//Associate Label with color here?
export type Label = 'New' | 'Popular' | 'Trending' | 'Coming Soon';

export const tools: Tool[] = [
  // ✅ Fetch Contents - Internal
  {
    id: '07c1b5bb-5fd1-4576-a919-328d0cc1dafb',
    name: 'Fetch URL',
    slug: 'fetch-url',
    description: 'Fetches the contents of a URL.',
    icon: <></>,
    formData: pickFormFields(['url']),
    actions: ['fetch'],
    outputType: 'None',
    hidden: true,
  },

  // ✅ Upload Resume - Internal
  {
    id: '1cbecba6-c08a-4aea-b019-32b6c9979521',
    name: 'Upload Resume',
    slug: 'upload-resume',
    description: 'Uploads and parses PDF. TODO: Save plain text.',
    icon: <></>,
    formData: pickFormFields(['resumeFile']),
    actions: ['save-resume'],
    outputType: 'None',
    hidden: true,
  },
  // ✅ Parse Resume - Internal
  {
    id: '2702feb5-b4fe-4f65-aefc-6741919125a9',
    name: 'Parse Resume',
    slug: 'parse-resume',
    promptKey: 'prompt-resume-extract',
    description: 'Parses a PDF for text.',
    icon: <></>,
    formData: pickFormFields(['resumeText']),
    actions: ['save-resume', 'parse-resume'],
    outputType: 'Json',
    hidden: true,
  },
  // ✅ Sample - Testing
  {
    id: 'sample',
    name: 'Sample',
    slug: 'sample',
    promptKey: 'sample',
    description: 'Sample desc',
    icon: <FileText className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields([
      'resumeFile',
      // 'intervieweeRole',
      // 'interviewerRole',
      // 'question',
      // 'companyWebsiteUrl',
      // 'jobDescriptionUrl',
      // 'intervieweeLinkedInUrl',
      // 'interviewerLinkedInUrl',
      // 'caseStudy',
    ]),
    labels: ['Trending'],
    hidden: true,
  },
  // ✅ Know Your Resume
  {
    id: 'f1354d4e-c1af-4dfc-a0aa-c355f87c7c18',
    name: 'Know Your Resume',
    slug: 'know-your-resume',
    promptKey: 'prompt-tools-know-your-resume',
    description: 'Master the tough resume questions—before your interviewer asks them.',
    icon: <FileText className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile']),
    resumeUploadType: 'upload-resume',
    labels: ['Trending'],
    actions: ['run-gen-ai'],
  },
  // ✅ Interviewer Scout
  {
    id: '48be131b-07dc-4ba9-98c8-b21eb2eb0348',
    name: 'Interviewer Scout',
    slug: 'interviewer-scout',
    promptKey: 'prompt-tools-interviewer-scout',
    description: "Know your interviewer's background in seconds—before you step into the call.",
    icon: <User className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields([ 'resumeFile', 'interviewerLinkedInProfileUrl']),
    resumeUploadType: 'upload-resume',
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ Company Scout
  {
    id: 'dd872877-bb94-4134-92fc-fff6d0d0715c',
    name: 'Company Scout',
    slug: 'company-scout',
    promptKey: 'prompt-tools-company-scout',
    description: 'Research the company in minutes so you can interview with confidence.',
    icon: <Building2 className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['companyWebsiteUrl']),
    actions: ['fetch', 'run-gen-ai']
  },
  // ✅ Question Scout
  {
    id: '11a4bbfe-23bd-4550-ac35-9855c8812a7b',
    name: 'Question Scout',
    slug: 'question-scout',
    promptKey: 'prompt-tools-question-scout',
    description: 'See the types and styles of questions you will get asked for this role at this company.',
    icon: <HelpCircle className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile', 'companyWebsiteUrl', 'jobDescriptionUrl']),
    resumeUploadType: 'parse-resume',
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ Interview Question Predictor
  {
    id: '384581f1-e5fc-4f7c-b526-f9fc40e80292',
    name: 'Interview Question Predictor',
    slug: 'interview-question-predictor',
    promptKey: 'prompt-tools-interview-question-predictor',
    description: 'Get tailored questions based on the role, company, and industry—be one step ahead.',
    icon: <MessageSquare className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile', 'companyWebsiteUrl', 'jobDescriptionUrl']),
    resumeUploadType: 'parse-resume',
    labels: ['New'],
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ STAR Stories Creator
  {
    id: 'f859b2b2-7c5d-42e6-ae8f-a3192a8a1cfa',
    name: 'STAR Stories Creator',
    slug: 'star-stories-creator',
    promptKey: 'prompt-tools-star-stories-creator',
    description: 'Build a arsenal of impactful STAR stories to showcase your skills and experiences.',
    icon: <Star className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile']),
    resumeUploadType: 'upload-resume',
    actions: ['run-gen-ai'],
  },
  // ✅ BYOQuestion
  {
    id: 'a7d33275-d69a-4f90-94bc-39f47311ff47',
    name: 'BYOQuestion',
    slug: 'byoq',
    promptKey: 'prompt-tools-byoq',
    description: 'Get advice on how to approach ANY interview question.',
    icon: <MessageCircleQuestion className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['intervieweeRole', 'question']),
    actions: ['run-gen-ai'],
  },
  // ✅ Tell Me About Yourself Creator
  {
    id: '42bf7564-653f-4cc5-9201-794165de7101',
    name: 'Tell Me About Yourself Creator',
    slug: 'tell-me-about-yourself',
    promptKey: 'prompt-tools-tell-me-about-yourself',
    description: 'Craft a compelling personal pitch that captures attention and sets you apart.',
    icon: <User className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile', 'companyWebsiteUrl']),
    resumeUploadType: 'parse-resume',
    labels: ['New'],
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ Questions To Ask The Interviewer
  {
    id: '2c8c6757-d091-4511-925b-99d2856578f3',
    name: 'Questions To Ask The Interviewer',
    slug: 'questions-to-ask-interviewer',
    promptKey: 'prompt-tools-questions-to-ask-interviewer',
    description: 'Impress interviewers with thought-provoking questions that showcase your expertise.',
    icon: <MessageCircleQuestion className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile', 'jobDescriptionUrl', 'interviewerRole']),
    resumeUploadType: 'parse-resume',
    labels: ['New'],
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ Job Fit Checker
  {
    id: 'e1e377e6-3b49-47e9-acbd-db427bb38944',
    name: 'Job Fit Checker',
    slug: 'job-fit',
    promptKey: 'prompt-tools-job-fit',
    description: 'See how well you fit the job description. Find out what you may need to work on.',
    icon: <Dumbbell className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile', 'jobDescriptionUrl']),
    resumeUploadType: 'parse-resume',
    labels: ['New'],
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ Personalize Your Cover Letter
  {
    id: '25e990b6-9653-4d7f-b4ea-c9ba466dd144',
    name: 'Personalize Your Cover Letter',
    slug: 'cover-letter-generator',
    promptKey: 'prompt-tools-cover-letter-generator',
    description: 'Tailor your cover to your job role and your background in seconds.',
    icon: <FileText className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile', 'jobDescriptionUrl']),
    resumeUploadType: 'parse-resume',
    labels: ['New'],
    actions: ['fetch', 'run-gen-ai'],
  },
  // ✅ Case Study Generator
  {
    id: 'f59585d1-e681-4ba5-8317-1f96f067aa9f',
    name: 'Case Study Generator',
    slug: 'case-study-generator',
    promptKey: 'prompt-tools-case-study-generator',
    description: 'Test your Case Study skills tailored to your target role.',
    icon: <MessageCircleQuestion className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['intervieweeRole', 'caseStudy']),
    labels: ['New'],
    actions: ['run-gen-ai'],
  },
  // ✅ What Can I Do With My Major?
  {
    id: '571ef333-f0d2-45af-aea8-8beb1ec4786e',
    name: 'What Can I Do With My Major?',
    slug: 'what-can-i-do-with-my-major',
    promptKey: 'prompt-tools-what-can-i-do-with-my-major',
    description: 'Get a personalized roadmap for careers based on your major.',
    icon: <User className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['schoolMajor']),
    labels: ['Coming Soon'],
    actions: ['run-gen-ai'],
    disabled: true,
  },
  // ✅ Resume Checker
  {
    id: '797918dd-b1c3-40af-8d96-28c2bd96340d',
    name: 'Resume Checker',
    slug: 'resume-checker',
    promptKey: 'prompt-tools-resume-checker',
    description: "Get quick feedback on your resume and make sure it's aligned with best practices.",
    icon: <FileText className='h-8 w-8 text-emerald-400' />,
    formData: pickFormFields(['resumeFile']),
    resumeUploadType: 'upload-resume',
    labels: ['New'],
    actions: ['run-gen-ai'],
  },

]

export const displayableTools = tools.filter(tool => !tool.hidden);

//Validations
export function createZodSchema(formData: Record<string, FormFieldValidation>) {
  const schema: Record<string, z.ZodType> = {}

  for (const [field, validation] of Object.entries(formData)) {
    let fieldSchema;

    switch (validation.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        if (validation.validation?.minLength) {
          const message = validation.validation.minLength == 1 ? 'Required' : `Must be at least ${validation.validation.minLength} characters`
          fieldSchema = fieldSchema.min(validation.validation.minLength, message)
        }
        if (validation.validation?.maxLength) {
          fieldSchema = fieldSchema.max(validation.validation.maxLength)
        }
        if (validation.validation?.pattern) {
          fieldSchema = fieldSchema.regex(validation.validation.pattern)
        }
        break

      case 'url':
        fieldSchema = z.string()
          .refine((url) => {
            return url.length > 1
          }, {message: 'Required'})
          .refine((url) => {
            try {
              new URL(url)
              return true
            } catch {
              return false
            }
          }, { message: 'Please enter a valid URL that starts with http:// or https://' })
          .refine((url) => {
            try {
              const urlObj = new URL(url)
              const protocolValid = validation.validation?.protocols
                ? validation.validation.protocols.includes(urlObj.protocol.replace(':', '') as 'http' | 'https')
                : true
              const domainValid = validation.validation?.allowedDomains
                ? validation.validation.allowedDomains.some(domain => urlObj.hostname.endsWith(domain))
                : true
              return protocolValid && domainValid
            } catch {
              return false
            }
          }, {
            message: validation.validation?.allowedDomains
              ? `URL must be from: ${validation.validation.allowedDomains.join(', ')}`
              : 'Invalid URL format'
          })
        break

      case 'file':
        // console.log('validating file')
        fieldSchema = z.custom<object>()
        .refine((file: any) => {
          // console.log('validating file: ', file)
          // console.log('validating file name:', file?.name)
          return file?.name;
        }, {
            message: 'Please select a resume'
        })
        .refine((file: any) => {
          // console.log('validating file: ', file)
          // console.log('validating file isFileUploaded:', file?.isFileUploaded)
          return file?.isFileUploaded; //file instanceof File;
        }, {
            message: 'Please wait for the resume to upload'
        })
        // fieldSchema = z.custom<FileList>()
        //   .refine((fileList) => {
        //     console.log('in here fileList: ', fileList);
        //     return fileList?.length > 0
        //   }
        //   ,{
        //     message: 'Please select a resume'
        //   })

        // //   // .refine((file) => file instanceof File, {
        //   //   message: 'Please select a file'
        //   // })
        // // if (validation.validation?.maxSize) {
        // //   fieldSchema = fieldSchema.refine(
        // //     (file) => file?.size <= validation.validation!.maxSize!,
        // //     { message: `File size must be less than ${validation.validation.maxSize / (1024 * 1024)}MB` }
        // //   )
        // // }
        // // if (validation.validation?.allowedTypes) {
        // //   fieldSchema = fieldSchema.refine(
        // //     (file) => {
        // //       const extension = file.name?.split('.').pop()?.toLowerCase()
        // //       return extension ? validation.validation!.allowedTypes!.includes(extension) : false
        // //     },
        // //     { message: `File must be: ${validation.validation.allowedTypes.join(', ')}` }
        // //   )
        // // }
        break

        case 'email':
          fieldSchema = z.string().email();
          if (validation.validation?.allowedDomains) {
            fieldSchema = fieldSchema.refine(
              (email) => validation.validation!.allowedDomains!.some(domain => email.endsWith(`@${domain}`)),
              { message: `Email must be from: ${validation.validation.allowedDomains.join(', ')}` }
            )
          }
          break

      case 'dropdown':
        fieldSchema = z.custom<String>()
          .refine((selectedValue) => selectedValue.length > 0, {
            message: 'Required'
          })
        break

      case 'year':
        fieldSchema = z.number()
          .refine((val) => !isNaN(Number(val)), {
            message: 'Please enter a valid year'
          })
          // .refine((val) => {
          //   const year = Number(val)
          //   const currentYear = new Date().getFullYear()

          //   if (validation.validation?.minYear && year < validation.validation.minYear) {
          //     return false
          //   }
          //   if (validation.validation?.maxYear && year > validation.validation.maxYear) {
          //     return false
          //   }
          //   if (validation.validation?.allowFuture === false && year > currentYear) {
          //     return false
          //   }
          //   return true
          // }, {
          //   message: (val: any) => {
          //     const year = Number(val)
          //     const currentYear = new Date().getFullYear()

          //     if (validation.validation?.minYear && year < validation.validation.minYear) {
          //       return `Year must be after ${validation.validation.minYear}`
          //     }
          //     if (validation.validation?.maxYear && year > validation.validation.maxYear) {
          //       return `Year must be before ${validation.validation.maxYear}`
          //     }
          //     if (validation.validation?.allowFuture === false && year > currentYear) {
          //       return 'Future years are not allowed'
          //     }
          //     return 'Invalid year'
          //   }
          // })
        break

      case 'gradeClass':
        fieldSchema = z.enum([
          GradeClass.Freshman,
          GradeClass.Sophomore,
          GradeClass.Junior,
          GradeClass.Senior,
          GradeClass.Graduate
        ])
        if (validation.validation?.gradeClass) {
          fieldSchema = fieldSchema.refine(
            (val) => validation.validation!.gradeClass!.includes(val as GradeClass),
            {
              message: `Grade must be: ${validation.validation.gradeClass}`
            }
          )
        }
        break

      default:
        fieldSchema = z.any()
    }

    schema[field] = validation.optional ? fieldSchema.optional() : fieldSchema
  }

  return z.object(schema);
}
