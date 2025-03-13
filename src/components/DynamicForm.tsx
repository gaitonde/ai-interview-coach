import { createZodSchema } from "@/data/tools";
import { Tool } from "@/types/tools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FileUploadButton from "./FileUploadButton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type DynamicFormProps = {
  tool: Tool
  onSubmit: (data: any) => void
  setToolRuns: (data: any) => void
}

export function DynamicForm({ tool, onSubmit, setToolRuns }: DynamicFormProps) {
  const [, forceUpdate] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Thinking...');
  const zodSchema = createZodSchema(tool.formData);
  const [value, setValue] = useState("");

  const form = useForm({
    resolver: zodResolver(zodSchema),
    mode: 'onChange'
  });

  //Go button text updating
  useEffect(() => {
    if (!isSubmitting) return

    const messages = ['Thinking...', 'Researching...', 'Analyzing...', 'Generating...']
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length
      setStatusMessage(messages[currentIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [isSubmitting])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
      setRanOnce(true);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {Object.entries(tool.formData).map(([fieldName, fieldConfig]) => (
        <div key={fieldName} className="space-y-2">
          <label htmlFor={fieldName} className="block text-sm font-medium">
            {fieldConfig.label}
            {fieldConfig.optional && <span> (Optional)</span>}
          </label>

          {fieldConfig.type === 'text' && (
            <Input
              type="text"
              id={fieldName}
              placeholder={fieldConfig.placeholderText}
              {...form.register(fieldName)}
              className="block bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
            />
          )}

          {fieldConfig.type === 'textarea' && (
            <Textarea
              id={fieldName}
              placeholder={fieldConfig.placeholderText}
              {...form.register(fieldName)}
              className="block w-full rounded-md border bg-white text-black"
            />
          )}

          {fieldConfig.type === 'url' && (
            <Input
              type="url"
              id={fieldName}
              placeholder={fieldConfig.placeholderText}
              {...form.register(fieldName)}
              className="block bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
            />
          )}

          {fieldConfig.type === 'file' && fieldConfig?.validation?.allowedTypes && (
            <>
            <FileUploadButton
              fieldName={fieldName}
              // onFileSelected={onFileSelected}
              register={form.register}
              setValue={form.setValue}
              trigger={form.trigger}
              allowedTypes={fieldConfig.validation.allowedTypes}
              toolSlug={tool.resumeUploadType}
              setToolRuns={setToolRuns}
            />
{/*
            <FileUpload
              fieldName={fieldName}
              register={form.register}
              setValue={form.setValue}
              trigger={form.trigger}
              toolSlug={tool.resumeUploadType}
              allowedTypes={fieldConfig.validation.allowedTypes}
              setToolRuns={setToolRuns}
            /> */}
            </>
          )}

          {fieldConfig.type === 'dropdown' && (
            <>
            <div className="w-full space-y-2">
              <Select value={value} onValueChange={(val) => setValue(val)}>
                <SelectTrigger id="do-i-need-this-academic-year" className="w-full bg-white text-black">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectGroup>
                    <SelectLabel>Case Study</SelectLabel>
                    {fieldConfig.validation?.allowedValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
{/*
            <select
                id={fieldName}
                {...form.register(fieldName)}
                className="block w-full rounded-md border text-black"
              >
                <option value="">Select an option</option>
                {fieldConfig.validation?.allowedValues?.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
               */}
            </>
          )}

{/*
          {fieldConfig.type === 'gradeClass' && (
            <select
              id={fieldName}
              {...form.register(fieldName)}
              className="block w-full rounded-md border"
            >
              <option value="">Select Grade Level</option>
              {(fieldConfig.validation?.gradeClass || Object.values(GradeClass)).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          )}
           */}

          {form.formState.errors[fieldName] && (
            <p className="text-sm text-red-500">
              {form.formState.errors[fieldName]?.message as string}
            </p>
          )}
        </div>
      ))}

      <Button
        type="submit"
        className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
        onBlur={() => forceUpdate({})}
      >
        {isSubmitting ? statusMessage : ranOnce ? `Run Again` : `Run ${tool.name}`}
      </Button>
    </form>
  )
}