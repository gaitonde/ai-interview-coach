import { FormFieldValidation, Label, OutputType } from "@/data/tools";

export type Tool = {
  id: string;
  name: string;
  slug: string;
  promptKey?: string;
  description: string;
  icon: JSX.Element;
  labels?: Label[];
  hidden?: boolean;
  disabled?: boolean;
  actions?: string[];
  outputType?: OutputType;
  resumeUploadType?: string;
  formData: {
    [key: string]: FormFieldValidation;
  };
};

// type DisplayableTool = Tool & {

// }

// type InternalTool = Tool & {

// }

export type ToolRun = {
  tool: Tool
  output: object
}

export type ToolPayload = {
  finalOutput: object | string
  toolRuns?: ToolRun[]
  prompt?: Prompt
}

export type Resume = {
  name: string
  type: string
  size: number
  text?: string
  url?: string
}

export type Prompt = {
  key: string
  meta: object
  constructed: {
    system: string
    user: string
  }
}

