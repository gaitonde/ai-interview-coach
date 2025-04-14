import CopyToClipboardButton from "@/components/copy-to-clipboard-button";
import { createZodSchema, UrlValidation } from "@/data/tools";
import { Tool } from "@/types/tools";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FileUploadButton from "./FileUploadButton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type DynamicFormProps = {
  tool: Tool
  onSubmit: (data: any) => void
  setToolRuns: (data: any) => void
  content?: string
}

function DynamicForm({ tool, onSubmit, setToolRuns, content }: DynamicFormProps) {
  const [, forceUpdate] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Thinking...');
  const [inputType, setInputType] = useState<"url" | "text">("url");
  const [zodSchema, setZodSchema] = useState(createZodSchema(tool.formData));
  const [showCopyButton, setShowCopyButton] = useState(false);
  // Get the paired fields if they exist
  const pairedFields = tool.pairedFields;
  const pairedUrlField = pairedFields?.pair1.urlField;
  const pairedTextField = pairedFields?.pair1.textField;
  const pairedUrlFieldKey = pairedFields?.pair1.urlField ? Object.keys(pairedFields?.pair1.urlField)[0] : '';
  const pairedTextFieldKey = pairedFields?.pair1.textField ? Object.keys(pairedFields?.pair1.textField)[0] : '';

  const form = useForm({
    resolver: zodResolver(zodSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    console.log('take out the textarea desc to start')
    updateValidationSchema(inputType)
  }, [inputType])

  const updateValidationSchema = async(newType: string) => {
    console.log('updateValidationSchema, tool.formData: ', tool.formData)
    console.log('updateValidationSchema, newType: ', newType)
    const fd = structuredClone(tool.formData);
    if (newType === 'text') {
      delete fd[pairedUrlFieldKey]
    } else {
      delete fd[pairedTextFieldKey]
    }

    console.log('updateValidationSchema, fd out: ', fd)

    const zodSchema = createZodSchema(fd);
    setZodSchema(zodSchema);
  }

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

  // Clear the other field when switching input types
  const toggleInputType = () => {
    const newType = inputType === "url" ? "text" : "url";
    setInputType(newType);
    updateValidationSchema(newType);

    // // Clear the inactive field
    // if (newType === "url") {
    //   form.setValue(pairedTextFieldKey, "");
    // } else {
    //   form.setValue(pairedUrlFieldKey, "");
    // }
  };

  const handleSubmit = async (data: any) => {
    console.log('HS: ', data)
    // if (newType === "url") {
    //   form.setValue(pairedTextFieldKey, "");
    // } else {
    //   form.setValue(pairedUrlFieldKey, "");
    // }
    setIsSubmitting(true);
    setRanOnce(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {pairedFields && pairedUrlField && pairedTextField && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">

            <Label
              // htmlFor={inputType === "url" ? pairUrlField['urlField'].type : pairTextField['textField'].type}
              className="text-white"
            >
              {inputType === "url"
                ? (pairedFields.pair1.urlField[Object.keys(pairedFields.pair1.urlField)[0]]).label
                : (pairedFields.pair1.textField[Object.keys(pairedFields.pair1.textField)[0]]).label
              }
            </Label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleInputType}
              className="text-white hover:text-black flex items-center gap-1 hover:cursor-pointer"
            >
              {inputType === "url" ? (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Use Text Instead</span>
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  <span>Use URL Instead</span>
                </>
              )}
            </Button>
          </div>

          {inputType === "url" ? (
            <>
              <Input
                type="url"
                id={pairedUrlFieldKey}
                placeholder={pairedFields.pair1.urlField[pairedUrlFieldKey] && (pairedFields.pair1.urlField[pairedUrlFieldKey] as UrlValidation).placeholderText}
                {...form.register(pairedUrlFieldKey, {
                  onChange: (e) => {
                    const value = e.target.value;
                    // Only modify the URL if there's a value
                    if (value) {
                      const urlValue = value.startsWith('http://') || value.startsWith('https://')
                        ? value
                        : `https://${value}`;
                      form.setValue(pairedUrlFieldKey, urlValue);
                    }
                    form.trigger(pairedUrlFieldKey);
                  }
                })}
                // {...form.register(pairedUrlFieldKey)}

                // {...form.register(pairedUrlFieldKey, {
                //   onChange: (e) => {
                //     const value = e.target.value;
                //     const urlValue = value.startsWith('http://') || value.startsWith('https://')
                //       ? value
                //       : `https://${value}`;
                //     form.setValue(pairedUrlFieldKey, urlValue);
                //     form.trigger(pairedUrlFieldKey);
                //   }
                // })}
                className="block bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
              />

              {form.formState.errors[pairedUrlFieldKey!] && (
                <>
                  <p className="text-sm text-red-500">
                    {form.formState.errors[pairedUrlFieldKey!]?.message as string}
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <Textarea
                id={pairedTextFieldKey}
                placeholder={pairedFields.pair1.textField[pairedTextFieldKey] && (pairedFields.pair1.textField[pairedTextFieldKey] as UrlValidation).placeholderText}
                {...form.register(pairedTextFieldKey, {
                  onChange: (e) => {
                    const value = e.target.value;
                    form.setValue(pairedTextFieldKey, value);
                    form.trigger(pairedTextFieldKey);
                  }
                })}
                // {...form.register(pairedTextFieldKey!)}
                className="block w-full rounded-md border bg-white text-black"
              />

              {form.formState.errors[pairedTextFieldKey!] && (
                <>
                  <p className="text-sm text-red-500">
                    {form.formState.errors[pairedTextFieldKey!]?.message as string}
                  </p>
                </>
              )}

            </>
          )}
        </div>
      )}
      {Object.entries(tool.formData).map(([fieldName, fieldConfig]) => {
        const urlKey = pairedFields?.pair1.urlField ? Object.keys(pairedFields.pair1.urlField)[0] : '';
        const textKey = pairedFields?.pair1.textField ? Object.keys(pairedFields.pair1.textField)[0] : '';
        // Skip paired fields as they're handled separately
        // console.log('urlKey aa: ', urlKey)
        if (pairedFields && (fieldName === urlKey || fieldName === textKey)) {
          // console.log('skipped: ', fieldName)
          return null;
        }

        return (
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

            {fieldConfig.type === 'file' && fieldConfig.validation?.allowedTypes && (
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
              <div className="w-full space-y-2">
                <Select
                  onValueChange={(val) => {
                    form.setValue(fieldName, val);
                    form.trigger(fieldName);
                  }}
                  defaultValue={form.getValues(fieldName)}
                >
                  <SelectTrigger id={fieldName} className="w-full bg-white text-black">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectGroup>
                      <SelectLabel>Select an option</SelectLabel>
                      {fieldConfig.validation?.allowedValues?.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
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
        );
      })}

      <div className="space-y-4 w-full">
        {showCopyButton && content && (
          <div className="mt-8">
            <CopyToClipboardButton
              content={content}
              tool={tool.slug}
              btnText = "Click to copy results below"
            />
            <div className="flex justify-center mt-4">
              or
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
          disabled={isSubmitting}
          onBlur={() => forceUpdate({})}
        >
          {isSubmitting ? statusMessage : ranOnce ? `Run Again` : `Run ${tool.name}`}
        </Button>
      </div>
    </form>
  )
}

export default DynamicForm;