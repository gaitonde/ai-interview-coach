import { DynamicForm } from "@/components/DynamicForm";
import { tools } from "@/data/tools";
import { Tool } from "@/types/tools";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import MarkdownRenderer from "./markdown-renderer";
import { JsonRenderer, ToolOutput } from "./tool-output";
import { useMixpanel } from "@/hooks/use-mixpanel";

export function ToolForm({slug}: {slug: string}) {
  const [showOutput, setShowOutput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [tool, setTool] = useState<Tool>();
  const [toolRuns, setToolRuns] = useState([]);
  const { track } = useMixpanel();

  const getToolBySlug = (slug: string) => {
    return tools.find(tool => tool.slug === slug);
  }

  useEffect(() => {
    const tool = getToolBySlug(slug);
    setTool(tool);
  })

  const renderMarkdown = (payload: any) => {
    if (payload?.finalOutput?.content) {
      setContent(`# ${tool?.name}\n\n` + payload.finalOutput.content);
    }
  }

  const generateResults = async (formData: FormData) => {
    if (!tool) return;

    // console.log('formData: ',  Array.from(formData.entries()));

    const profileId = Cookies.get('profileId') as string;

    // console.log('tool params toolName: ', tool.slug);
    // console.log('tool params profileId: ', profileId);

    try {
      track('v2.ToolRunAttempt', { slug, profileId });
      // const formData = new FormData()
      formData.append('profileId', profileId);
      formData.append('toolSlug', tool.slug);
      formData.append('toolRuns', JSON.stringify(toolRuns));

      const response = await fetch(`/api/v2/tools`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(`Unable to run tool: ${tool.slug}`, response);
        return;
      }

      track('v2.ToolRunSuccess', { slug, profileId });

      const result = await response.json();
      return result.payload;
      // return {finalOutput: {content: '# fixme'}};
    } catch (error) {
      console.error('Error in generating response for tool:', error);
      throw error;
    }
  }

  const handleSubmit = async (data: any) => {
    // data: any
    console.log('Form data:', data)
    // TODO: Handle form submission
    // e.preventDefault();
    setIsSubmitting(true);
    setShowOutput(false);

    const formData = jsonToFormData(data);
    const payload = await generateResults(formData);

    if (tool?.outputType === 'Json') {
      console.error(`TODO: implement json`);
    } else {
      renderMarkdown(payload);
    }
    setShowOutput(true);
    setIsSubmitting(false);

  }

  if (!tool) {
    return null
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#111827]">
        <div className="flex flex-col space-y-4 px-4 sm:px-6 lg:px-8 my-6">

          {/* Tool Metadata */}
          <div className="w-full max-w-full sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
            <div className="text-[#F9FAFB] p-4">
              <div className="max-w-3xl">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-700">
                    {tool.icon}
                  </div>
                  <h1 className="text-4xl font-bold text-emerald-400 mb-2 ml-4">{tool.name}</h1>
                </div>
                <Link href="/" className="hover:underline">
                  ← Back
                </Link>

                <div className="prose prose-invert prose-emerald mt-8">
                  {tool.description}
                </div>
              </div>
            </div>
          </div>

          {/* Input(s) */}
          <div className="w-full max-w-full sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
            <div className="text-[#F9FAFB] p-4">
              <h2 className="mt-2 text-3xl font-bold text-white mb-8">Inputs</h2>
              <div className="space-y-4">
                <DynamicForm tool={tool} onSubmit={handleSubmit} setToolRuns={setToolRuns} />
              </div>
              <p className="text-sm mt-1 text-center">
                {isSubmitting && (
                  'Takes about 30 seconds, please be patient. Thank you.'
                )}
              </p>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>

          {/* Tool Output */}
          {showOutput && (
            <ToolOutput content={content}>
              {tool?.outputType === 'Json'
                ? <JsonRenderer content={content} />
                : <MarkdownRenderer content={content} />}
            </ToolOutput>
          )}

        </div>
      </div>
    </>
)}

export function jsonToFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Handle File objects specially
    if (value instanceof File) {
      formData.append(key, value)
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach(item => formData.append(`${key}[]`, item))
    }
    // Handle nested objects
    else if (value instanceof Object) {
      formData.append(key, JSON.stringify(value))
    }
    // Handle null or undefined
    else if (value === null || value === undefined) {
      formData.append(key, '')
    }
    // Handle all other types
    else {
      console.log('just putting in string, string ')
      formData.append(key, String(value))
    }
  })

  return formData
}