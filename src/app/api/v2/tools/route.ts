import { fetchPromptByKey, PromptData } from '@/app/api/utils/fetchPrompt';
import { tools } from "@/data/tools";
import { getTable } from '@/lib/db';
import { getPromptByKey } from "@/lib/prompts";
import { Tool, ToolPayload, ToolRun } from "@/types/tools";
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import PDFParser from 'pdf2json';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

const getToolBySlug = (slug: string) => {
  return tools.find(tool => tool.slug === slug);
}

const getPayload = (toolRuns: ToolRun[]) => {
  //TODO: handle < 1 ToolRun
  let payload: ToolPayload = {
    toolRuns,
    finalOutput: toolRuns[toolRuns.length-1].output
  }

  return payload;
}
interface ToolOutput {
  output: {
    [key: string]: {
      graduationYear?: any;
      text: string;
      url?: string;
    }
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const profileId = formData.get('profileId') as string;
  const toolSlug = (formData.get('toolSlug') as string);

  const error = await validateInput(profileId, toolSlug);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  console.log("Tool slug: ", toolSlug);
  const tool = getToolBySlug(toolSlug);
  if (!tool) {
    return NextResponse.json({ error: `Tool not supported: ${toolSlug}` }, { status: 400 });
  }

  console.log('ACTIONS: ', tool.actions)

  let toolRuns: ToolRun[] = [];

  const toolActions = tool.actions;
  if (toolActions) {
    for (const toolAction of toolActions) {
      console.log('Processing tool action:', toolAction);
      if (toolAction == 'save-resume') {
        await runToolSaveResume(profileId, formData, toolRuns);
      } else if (toolAction == 'parse-resume') {
        await runToolParseResume(profileId, toolRuns);
      } else if (toolAction == 'fetch') {
        // Get all form data entries and find keys ending with 'Url'
        const urlEntries = Array.from(formData.entries())
          .filter(([key]) => key.endsWith('Url'));

        console.log('urlEntries: ', urlEntries)

        // Process each URL entry
        for (const [key, value] of urlEntries) {
          const url = value as string;
          console.log('fetching tool url: ', url)
          // Create the corresponding Text key (e.g., companyUrl -> companyText)
          const textKey = key.slice(0, -3) + 'Text'; // Replace 'Url' with 'Text'
          const toolRun = await handleFetch(profileId, textKey, url, toolRuns);
          formData.append(textKey, toolRun.output[textKey]);
        }
      } else if (toolAction == 'run-gen-ai') {
        await handleGenAI(profileId, tool, formData, toolRuns);
      } else {
        console.error(`Unsupported toolAction: ${toolAction}`);
      }
    }

    let payload: ToolPayload = {
      toolRuns,
      finalOutput: toolRuns[toolRuns.length-1].output,
    }

    // let payload: ToolPayload = {
    //   toolRuns: [],
    //   finalOutput: '# fix me 4'
    // }

    // console.log('SERVER OUTPUT PAYLOAD 1: ', payload)

    return NextResponse.json({ payload });
  }

  //TODO: fix crummy way of handling multiple actions
  /*
  if (tool.actions?.includes('save-resume')) {
    const toolRun = await runToolSaveResume(profileId, tool.slug, formData, toolRuns);

    await runToolParseResume(profileId, toolRuns);
    const payload = getPayload(toolRuns);
    return NextResponse.json({ payload });
  } else {
    // // Get all form data entries and find keys ending with 'Url'
    // const urlEntries = Array.from(formData.entries())
    //   .filter(([key]) => key.endsWith('Url'));

    // // Process each URL entry
    // for (const [key, value] of urlEntries) {
    //   const url = value as string;
    //   // Create the corresponding Text key (e.g., companyUrl -> companyText)
    //   const textKey = key.slice(0, -3) + 'Text'; // Remove 'Url' and add 'Text'

    //   const toolRun = await handleFetch(profileId, textKey, url);

    //   // Add the fetched content to formData with the new key
    //   if (toolRun?.output?.companyWebsiteText) {
    //     formData.set(textKey, toolRun.output.companyWebsiteText);
    //   }
    //   toolRuns.push(toolRun);

    // }

    // // Make sure we're not creating a new FormData object each time
    // let previousToolRunsStr = formData.get('toolRuns')
    // console.log('Previous tool runs:', previousToolRunsStr)

    // // If it exists, parse it, if not, create new array
    // try {
    //   toolRuns = previousToolRunsStr ? JSON.parse(previousToolRunsStr as string) : []
    // } catch (e) {
    //   console.error('Error parsing toolRuns:', e)
    //   toolRuns = []
    // }

    // // Add new toolRun
    // // toolRuns.push(toolRun)

    // // Set the updated array
    // formData.set('toolRuns', JSON.stringify(toolRuns))

    // // Verify the update
    // console.log('Updated toolRuns:', formData.get('toolRuns'))

    return await handleGenAI(profileId, tool, formData, toolRuns);
  }
  */
}

async function uploadResume(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file uploaded')
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Uploaded file must be a PDF')
  }

  const { url } = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return url;
}

async function extractText(resume: File): Promise<string> {
  let parsedText = '';

    // Convert ArrayBuffer to Buffer
    const fileBuffer = Buffer.from(await resume.arrayBuffer());

    const parsePDF = () => {
      return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.error(errData.parserError);
          reject(errData.parserError);
        })

        pdfParser.on('pdfParser_dataReady', () => {
          const text = (pdfParser as any).getRawTextContent();
          resolve(text);
        })

        // Parse directly from buffer instead of file
        pdfParser.parseBuffer(fileBuffer);
      })
    }

    try {
      const rawText = (await parsePDF()) as string
      // Convert the raw text to markdown format
      // This is a simple conversion - you might want to add more formatting rules
      parsedText = rawText
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/\f/g, '\n\n') // Replace form feeds with double newlines
        .trim(); // Remove leading/trailing whitespace
    } catch (error) {
      throw new Error('Failed to parse PDF');
    }

    return parsedText;
}

async function getToolRunRecord(uuid: string) {
  try {
    const table = getTable('tool_runs')
    const query = `
      SELECT * FROM ${table}
      WHERE ID = '${uuid}'
    `

    const result = await sql.query(query)
    return result.rows[0];
  } catch {
    console.error('Unable to get tool: ', uuid);
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function validateInput(profileId: string, toolSlug: string) {
  let error = null;

  if (!profileId || !toolSlug) {
    error = 'profileId and toolSlug are required';
  }
  else {
    const tool = getToolBySlug(toolSlug);
    if (!tool) {
      error = `Tool not supported: ${toolSlug}`;
    }
  }
  return error;
}

async function handleFetch(profileId: string, textKey: string, url: string, toolRuns: ToolRun[]) {
  const fetchTool = getToolBySlug('fetch-url') as Tool;
  let content = url ? await fetchUrlContents(url) : null;
  if (content && content.length > 100000) {
    console.log('original content length: ', content.length);
    content = content.slice(0, 100000);
    console.log('truncated content length: ', content.length);
  }

  const toolRun = await insertToolRun(profileId, fetchTool.slug, { url }, { [textKey]: content })
  toolRuns.push(toolRun);
  return toolRun;
}

async function handleGenAI(profileId: string, tool: Tool, formData: FormData, toolRunsIn: ToolRun[]) {
  // console.log('Running an AI generate tool...', Object.fromEntries(formData.entries()));
  console.log('Running an AI generate tool...');
  const promptKey = tool.promptKey;
  console.log('Prompt key, ', promptKey)

  if (!promptKey) {
    return NextResponse.json({ error: `GenAI tools need a prompt. No prompt: ${promptKey}` }, { status: 400 });
  }

  let stdVars: Record<string, string> = {};
  const today = new Date();
  const todaysDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  stdVars.todaysDate = todaysDate;

  const prompt = await getPromptByKey(promptKey);
  const userPrompt = prompt.user_prompt;
  let constructuredUserPrompt = userPrompt;

  for (const [key, value] of formData.entries()) {
    stdVars[key] = value.toString();
  }

  const prevToolRunsStr = formData.get('toolRuns') as string;
  const prevToolRuns = prevToolRunsStr ? JSON.parse(prevToolRunsStr) : [];

  for (const toolRun of prevToolRuns) {
    console.log('toolRun ids: ', toolRun.id, toolRun.tool_id)
    constructuredUserPrompt = replacePathVars(constructuredUserPrompt, toolRun);
  }

  //conditional
  if (prevToolRuns.length > 0) {
    const toolRunRecord = prevToolRuns[1] as ToolOutput;

    if (toolRunRecord?.output?.resume?.graduationYear) {
      const gradYear = Number(toolRunRecord.output.resume.graduationYear);
      const gradeClass = fetchGradeClass(gradYear);
      stdVars['gradeClass'] = gradeClass;
    }
  }

  console.log('stdVars: ', stdVars);
  constructuredUserPrompt = replaceStdVars(constructuredUserPrompt, stdVars);
  prompt.user_prompt = constructuredUserPrompt;

  const input = {
    user_prompt: prompt.user_prompt
  };
  const content = await runToolPrompt(profileId, tool.slug, prompt);
  const output = { content };
  const toolRun = await insertToolRun(profileId, tool.slug, input, output);
  toolRunsIn.push(toolRun);
  return toolRun;
}

async function runToolSaveResume(profileId: string, formData: FormData, toolRuns: ToolRun[]) {
  console.log('in runToolSaveResume')
  const resume = formData.get('resumeFile') as File;
  if (!resume) {
    throw new Error(`Missing form data: 'resume'`)
  }
  const resumeUrl = await uploadResume(resume);
  const resumeText = await extractText(resume);

  const input = {
    resume: {
      size: resume.size,
      type: resume.type,
      name: resume.name,
    }
  };

  const output = {
    resume: {
      // size: resume.size,
      // type: resume.type,
      // name: resume.name,
      url: resumeUrl,
      text: resumeText
    }
  };

  const toolSlug = 'save-resume';
  const toolRun = await insertToolRun(profileId, toolSlug, input, output);
  toolRuns.push(toolRun);
  return toolRun;
}

async function runToolParseResume(profileId: string, toolRuns: ToolRun[]) {
  if (toolRuns?.length < 1) return;
  const promptData: PromptData = await fetchPromptByKey('prompt-resume-extract');

  const resumeText = (toolRuns[toolRuns.length-1] as ToolOutput).output.resume.text;
  promptData.userPrompt = promptData.userPrompt.replace('${resumeText}', resumeText);

  const completion = await openai.chat.completions.create({
    model: promptData.model,
    messages: [
      { role: "system", content: promptData.systemPrompt },
      { role: "user", content: promptData.userPrompt }
    ],
    max_completion_tokens: promptData.maxCompletionTokens,
    temperature: promptData.temperature as number,
  });

  const input = {
    resume: {
      text: resumeText
    }
  };
  const content = completion.choices[0].message.content || '';
  const jsonContent = JSON.parse(content);

  const output = {
    resume: jsonContent
  };

  const toolSlug = 'parse-resume';
  const toolRun = await insertToolRun(profileId, toolSlug, input, output);
  toolRuns.push(toolRun);
  return toolRun;
}

async function insertToolRun(profileId: string, toolSlug: string, input?: object, output?: object) {
  try {
    const table = getTable('tool_runs');
    const query = `
      INSERT INTO ${table} (profile_id, tool_id, input, output)
      VALUES ($1, $2, $3, $4)
      RETURNING id, profile_id, tool_id, input, output
    `

    const result = await sql.query(query, [profileId, toolSlug, input, output]);
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting tool run:', error)
    throw new Error(`Failed to insert new tool run record. ProfileId: ${profileId} ToolId: ${toolSlug}`)
  }
}

const promptVarsToKeys = {
  resumeText: "output.resume.text", //save-resume
  // resumeURL: "output.resume.url", //save-resume
  schoolName: "output.resume.school", //parse-resume
  schoolMajor: "output.resume.major", //parse-resume
  schoolConcentration: "output.resume.concentration", //parse-resume
  gradYear: "output.resume.graduationYear", //parse-resume
  companyWebsiteUrl: "input.companyWebsiteUrl",
  companyWebsiteText: "output.companyWebsiteText",
  jobDescriptionURL: "input.jobDescriptionURL",
  jobDescriptionText: "output.jobDescription",
  interviewerName: "output.interviewerName",
  interviewerRole: "input.interviewerRole",
  interviewerLinkedInProfileURL: "input.interviewerLinkedInProfileURL",
  interviewerLinkedInProfileText: "output.interviewerLinkedInProfileText",
  intervieweeRole: "input.intervieweeRole",
  intervieweeLinkedInProfileURL: "output.resume.linkedInURL", //parse-resume
  intervieweeLinkedInProfileText: "output.intervieweeLinkedInProfileText",
  question: "input.question",
  transcription: "input.transcription",
  content: "input.content",
  caseStudy: "input.caseStudy"
  // $[gradeClass} //parse-resume, computed
} as Record<string, string>;

function getValueByPath(obj: any, path: string): any {
  // console.log('getValueByPath obj: ', obj)
  // console.log('getValueByPath path: ', path)
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function replacePathVars(template: string, toolRun: any): string {
  return template.replace(/\${([^}]+)}/g, (match, variable) => {
    const path = promptVarsToKeys[variable];
    if (path) {
      // console.log('YY ToolRun: ', toolRun)
      // console.log('YY PATH: ', path)
      const value = getValueByPath(toolRun, path);
      // console.log('YY Value: ', value)
      return value || match;
    } else {
      console.error('No match for this var: ', variable)
    }
    return match;
  });
}

function replaceStdVars(template: string, variables: Record<string, string>): string {
  // console.log('XX all variables: ', variables);
  return template.replace(/\${([^}]+)}/g, (match, variable) => {
    const value = variables[variable];
    // console.log('XX variable: ', variable);
    // console.log('XX match: ', match);
    // console.log('XX value: ', value);
    return value;
  });
}

//store output???
//extract derived content
//generate computed content
//store derived and computed content
async function runToolPrompt(profileId: string, toolName: string, prompt: { model: any; system_prompt: any; user_prompt: any; max_completion_tokens: any; temperature: any; }) {
    const completion = await openai.chat.completions.create({
      model: prompt.model,
      messages: [
        { role: "system", content: prompt.system_prompt },
        { role: "user", content: prompt.user_prompt }
      ],
      max_completion_tokens: prompt.max_completion_tokens,
      temperature: prompt.temperature,
    });

    const content = completion.choices[0]?.message?.content;
    const usage = JSON.stringify(completion.usage);
    const table = getTable('tool_responses');
    const query = `
      INSERT INTO ${table} (profile_id, tool_name, content, usage)
      VALUES ($1, $2, $3, $4)
    `;

    await sql.query(query, [profileId, toolName, content, usage]);

    // console.log('Final content back from ai: ', content);
    return content;
}

async function fetchUrlContents(url: string): Promise<string | null> {
  if (!url) return null;
  const AbortController = globalThis.AbortController || await import('abort-controller')
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  try {
    // Set timeout and store the timeout ID
    timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    console.log('loading url: ', url)
    const response = await fetch(url, {
      signal: controller.signal,
      // follow: 10
    });

    console.log('loaded response without timeout: ', url)
    const html = await response.text()
    const $ = cheerio.load(html)
    console.log('cheerio loaded html')
    $('script').remove()
    $('[onload], [onclick], [onmouseover], [onfocus], [onsubmit], [oninput]').each((_, element) => {
      Object.keys(element.attribs).forEach(attr => {
        if (attr.startsWith('on')) {
          $(element).removeAttr(attr)
        }
      });
    });
    console.log('6')

    // Get the cleaned HTML
    const cleanHtml = $('body').html()
    const markdown = turndownService.turndown(cleanHtml || '')
    return markdown
  } catch (error) {
    console.error('Error in fetchUrlContents:', error)
    throw error
  } finally {
    // Clear timeout using the stored ID
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

// const gradYear = new Date(graduationDate).getFullYear();
function fetchGradeClass(graduationYear: number): string {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const delta = graduationYear - currentYear;

  if (delta < 0) return 'Graduate';
  if (delta === 0) return 'Senior';
  if (delta === 1) return currentMonth < 5 ? 'Junior' : 'Senior';
  if (delta === 2) return currentMonth < 5 ? 'Sophomore' : 'Junior';
  if (delta === 3) return currentMonth >= 5 ? 'Sophomore' : 'Freshman';
  return 'Freshman';
}

// Create a registry of post-processors
// const postProcessors: Record<string, PostProcessor> = {
//   'company-scout': runToolCompanyScout,
//   // Add more processors as needed:
//   // 'y': runToolY,
//   // 'z': runToolZ,
// };


  // Run post-processor if one exists for this tool
  // const postProcessor = postProcessors[toolName];
  // if (postProcessor && content) {
  //   await postProcessor({ profileId, interviewId }, content);
  // }


    // await insertResumeRecord(profileId, fileName, resumeUrl, resumeText)

// async function saveInputs(profileId: string, toolName: string) {
//   try {
//     const table = getTable('tool_runs')
//     const query = `
//       INSERT INTO ${table} (profile_id, tool_id)
//       VALUES ($1, $2)
//     `

//     const result = await sql.query(query, [profileId, toolName])
//     return result;
//   } catch (error) {
//     console.error('Error:', error);
//     return null;
//   }

// }

//'string' only refers to a type, but is being used as a value here.

    // formData.forEach((value, key) => {
    //   if (key.startsWith('input_') && typeof value === 'string') {
    //     console.log('Found input key:', key);
    //     console.log('value: ', value, typeof(value))
    //     const dotIndex = value.indexOf('.');
    //     const path = value.substring(dotIndex + 1);
    //     const value2 = getValueByPath(toolRun, path);
    //     console.log(`Value for ${key}:`, value2);
    //     const keyIndex = key.indexOf('_');
    //     const key2 = key.substring(keyIndex + 1)

    //     prompt.user_prompt = prompt.user_prompt
    //       .replace(`${key2}`, value2 || '')
    //       .replace(`\${`, '')
    //       console.log('UP NOW 2!!', prompt.user_prompt)
    //   }
    // });

    // console.log('UP NOW 3!!', prompt.user_prompt)


// const getToolById = (uuid: string) => {
//   return tools.find(tool => tool.id === uuid);
// }

  //based on tool, get formData
  //get keys that end with 'Url'
  //get value for each key ('url')
  //do handleFetch for each 'url'
  //store as '*Text' key in formData (eg. jdUrl => jdText or companyUrl => companyText)
  // tool.formData

