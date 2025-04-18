import type { FormFieldValidation } from './tools'

const commonFields = {
  gradYear: {
    type: 'year',
    label: 'Graduation Year',
    validation: {
      minYear: 1980
    }
  },
  schoolName: {
    type: 'text',
    label: 'School Name',
    validation: {
      minLength: 1,
    }
  },
  schoolMajor: {
    type: 'text',
    placeholderText: 'eg. Sports Analytics',
    label: 'School Major',
    validation: {
      minLength: 1,
    }
  },
  schoolConcentration: {
    type: 'text',
    label: 'School Concentration',
    validation: {
      minLength: 1,
    }
  },
  intervieweeRole: {
    type: 'text',
    label: 'Target Role',
    placeholderText: 'eg. Financial Analyst Intern or Product Manager at TikTok',
    validation: {
      minLength: 1,
      maxLength: 100
    }
  },
  interviewerRole: {
    type: 'text',
    label: 'Interviewer Role',
    placeholderText: 'eg. Director of Product Management',
    validation: {
      minLength: 1,
      maxLength: 100
    }
  },
  interviewerName: {
    type: 'text',
    label: 'Interviewer Name',
    validation: {
      minLength: 1,
    }
  },
  question: {
    type: 'textarea',
    label: 'Question',
    placeholderText: "Type or paste your question here. eg. What strategies would you implement to enhance customer engagement for Acme's products?",
    validation: {
      minLength: 1,
      maxLength: 5000
    }
  },
  transcription: {
    type: 'textarea',
    label: 'Transcription',
    validation: {
      minLength: 1,
    }
  },
  content: {
    type: 'textarea',
    label: 'Content',
    validation: {
      minLength: 1,
    }
  },
  url: {
    type: 'url',
    label: 'URL',
    validation: {
      protocols: ['http', 'https'],
    }
  },
  companyWebsiteUrl: {
    type: 'url',
    label: 'Company Website URL',
    placeholderText: 'https://acme.com',
    validation: {
      protocols: ['http', 'https'],
    }
  },
  companyWebsiteText: {
    type: 'textarea',
    label: 'Company Website Text',
    validation: {
      minLength: 1,
    }
  },
  jobDescriptionUrl: {
    type: 'url',
    label: 'Job Description URL',
    placeholderText: 'https://careers.example.com/job-description',
    validation: {
      protocols: ['http', 'https'] as const,
    }
  },
  jobDescriptionText: {
    type: 'textarea',
    label: 'Job Description Text',
    placeholderText: 'Copy and paste the job description here...',
    validation: {
      minLength: 1,
    }
  },
  intervieweeLinkedInProfileUrl: {
    type: 'url',
    label: 'Interviewee Linkedin URL',
    placeholderText: 'eg. https://www.linkedin.com/in/johndoe',
    validation: {
      protocols: ['https'],
      allowedDomains: ['linkedin.com']
    }
  },
  intervieweeLinkedInProfileText: {
    type: 'text',
    label: 'Interviewee LinkedIn Profile Text',
    validation: {
      minLength: 1,
    }
  },
  interviewerLinkedInProfileUrl: {
    type: 'url',
    label: 'Interviewer LinkedIn URL',
    placeholderText: 'eg. https://www.linkedin.com/in/johndoe',
    validation: {
      protocols: ['https'] as const,
      allowedDomains: ['linkedin.com']
    }
  },
  interviewerLinkedInProfileText: {
    type: 'text',
    label: 'Interviewer LinkedIn Text',
    placeholderText: 'Copy and paste the interviewer LinkedIn profile here...',
    validation: {
      minLength: 1,
    }
  },
  resumeFile: {
    type: 'file',
    label: 'Resume',
    validation: {
      // maxSize: 4 * 1024 * 1024, // 4MB
      allowedTypes: ['pdf']
    }
  },
  resumeText: {
    type: 'text',
    label: 'Resume Text',
    validation: {
      minLength: 1,
    }
  },
  caseStudy: {
    type: 'dropdown',
    label: 'Case Study',
    validation: {
      allowedValues: [
        'All Topics [Default]',
        'Market Sizing & Estimation',
        'Profitability Analysis',
        'Market Entry Strategy',
        'Growth Strategy',
        'Pricing Strategy',
        'Competitive Strategy',
        'Mergers & Acquisitions (M&A)',
        'New Product Launch',
        'Operations & Efficiency',
        'Risk & Crisis Management',
      ]
    }
  },
} as const satisfies Record<string, FormFieldValidation>

// Helper function to pick specific fields
export function pickFormFields<T extends keyof typeof commonFields>(
  fields: T[]
): Pick<typeof commonFields, T> {
  return fields.reduce((acc, field) => {
    acc[field] = commonFields[field]
    return acc
  }, {} as any)
}

export { commonFields };