import { createZodSchema, FormFieldValidation } from "@/data/tools";
import { Tool } from "@/types/tools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FileUploadButton from "./FileUploadButton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { LinkIcon, FileText } from "lucide-react"
import CopyToClipboardButton from "@/components/copy-to-clipboard-button";

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
  const zodSchema = createZodSchema(tool.formData);
  const [value, setValue] = useState("");
  const [inputType, setInputType] = useState<"url" | "text">("url");

  const [orTextField, setOrTextField] = useState<FormFieldValidation>();
  const [orUrlField, setOrUrlField] = useState<FormFieldValidation>();
  const [orTextFieldName, setOrTextFieldName] = useState('jobDescriptionText');
  const [orUrlFieldName, setOrUrlFieldName] = useState('jobDescriptionUrl');
  const hasRegistered = useRef(false);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    mode: 'onChange'
  });

  // useEffect(() => {
  //   if (!hasRegistered.current) {
  //     console.log('inputType has changed...');

  //     const urlOrTextField = tool.formData['urlOrTextField'] as UrlOrTextValidation;
  //     console.log('xx urlOrTextField: : ', urlOrTextField);

  //     if (urlOrTextField) {
  //       const textFieldKey = urlOrTextField.textField;
  //       const urlFieldKey = urlOrTextField.urlField;

  //       console.log('textFieldKey: ', textFieldKey)
  //       console.log('urlFieldKey: ', urlFieldKey)

  //       setOrTextFieldName(textFieldKey);
  //       setOrUrlFieldName(urlFieldKey);

  //       const formDataForOr = tool.formDataForOr;

  //       console.log('formDataForOr', formDataForOr)
  //       // console.log('formDataForOr.form??', formDataForOr.form)

  //       if (formDataForOr) {
  //         const textField = formDataForOr[textFieldKey];
  //         const urlField = formDataForOr[urlFieldKey];
  //         console.log('textField: ', textField)
  //         console.log('urlField: ', urlField)

  //         setOrTextField(textField)
  //         setOrUrlField(urlField)
  //         // (tool.formDataForOr?.[(tool.formData['urlOrTextField'] as UrlOrTextValidation)['urlField']] as UrlOrTextValidation)['label'] :
  //         // (tool.formDataForOr?.[(tool.formData['urlOrTextField'] as UrlOrTextValidation)['textField']] as UrlOrTextValidation)['label']
  //       }
  //       hasRegistered.current = true;
  //     }

  //   }

  // }, [orTextFieldName, orUrlFieldName]);

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
    console.log('in handleSubmit')
    // console.log('Form errors:', form.formState.errors);
    // console.log('Is form valid:', form.formState.isValid);
    // console.log('Dirty fields:', form.formState.dirtyFields);

    // Check if we're in URL mode and validate URL field
    // if (inputType === 'url') {
    //   const urlValue = form.getValues(orUrlFieldName);
    //   if (!urlValue) {
    //     form.setError(orUrlFieldName, {
    //       type: 'required',
    //       message: 'URL is required xx'
    //     });
    //     return;
    //   }
    // }

    // // Check if we're in text mode and validate text field
    // if (inputType === 'text') {
    //   const textValue = form.getValues(orTextFieldName);
    //   if (!textValue) {
    //     form.setError(orTextFieldName, {
    //       type: 'required',
    //       message: 'Text is required'
    //     });
    //     return;
    //   }
    // }

    // // If there are any errors, don't submit
    // if (!form.formState.isValid) {
    //   console.log('Form is invalid, not submitting');
    //   return;
    // }

    setIsSubmitting(true);
    try {
      console.log('submitting data:', data);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
      setRanOnce(true);
    }
  };

  // // Add this useEffect to watch form state changes
  // useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => {
  //     console.log('Form value changed:', name, value, type);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch]);

  // const toggleInputType = () => {
  //   setInputType(inputType === "url" ? "text" : "url");
  //   // const formDataForOr = tool.formDataForOr;
  //   // let field;
  //   // if (inputType === "url") {
  //   // //   field = formDataForOr?.jobDescriptionUrl;
  //   //   setOrUrlName('jobDescriptionUrl');
  //   // } else {
  //   // //   field = formDataForOr?.jobDescriptionText;
  //   //   setOrTextName('jobDescriptionText')
  //   // }


  //   // const urlField = formDataForOr?.jobDescriptionUrl;
  //   // const textField = formDataForOr?.jobDescriptionText;
  //   // console.log('formDataForOr', formDataForOr)
  //   // console.log('formDataForOr.jobDescriptionUrl Field', urlField?.label)
  //   // console.log('formDataForOr.jobDescriptionText Field', textField?.label)
  //   // console.log('XXX field: ', field)
  //   // console.log('XXX label: ', label)
  //   // console.log('XXX key: ', fieldName)
  // }

  // // console.log('trying')
  // // if (!orTextFieldName || !orUrlFieldName) {
  // //   // console.log('no names yet, return')
  // //   return null;
  // // }
  // // console.log('finally have it... ', orTextFieldName, orUrlFieldName);
  // // console.log('finally have it... ', textFieldKey, urlFieldKey);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {Object.entries(tool.formData).map(([fieldName, fieldConfig]) => (
        <div key={fieldName} className="space-y-2">
          <label htmlFor={fieldName} className="block text-sm font-medium">
            {fieldConfig.label}
            {fieldConfig.optional && <span> (Optional)</span>}
          </label>
{/*
          {fieldConfig.type === 'urlOrText' && orUrlField && orTextField && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={inputType === "url" ? orUrlFieldName : orTextFieldName} className="text-white">
                  {inputType === "url" ? `${orUrlField.label}` : orTextField.label}
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
                    id={orUrlFieldName}
                    placeholder={"Enter URL starting with http:// or https://"}
                    {...form.register(orUrlFieldName, {
                      onChange: (e) => {
                        const value = e.target.value;
                        console.log('Input changed:', value);
                        // Ensure URL has protocol
                        const urlValue = value.startsWith('http://') || value.startsWith('https://')
                          ? value
                          : `https://${value}`;
                        form.setValue(orUrlFieldName, urlValue);
                        form.trigger(orUrlFieldName);
                      }
                    })}
                    className="block bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                  />
                  {form.formState.errors[orUrlFieldName] && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors[orUrlFieldName]?.message as string}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Textarea
                    id={orTextFieldName}
                    placeholder={'orTextField.placeholderText'}
                    {...form.register(orTextFieldName)}
                    className="block w-full rounded-md border bg-white text-black"
                  />
                  {form.formState.errors[orTextFieldName] && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors[orTextFieldName]?.message as string}
                    </p>
                  )}
                </>
              )}
            </div>
          )} */}

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
      ))}

      <div className="space-y-4 w-full">
        {content && (
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
          onBlur={() => forceUpdate({})}
        >
          {isSubmitting ? statusMessage : ranOnce ? `Run Again` : `Run ${tool.name}`}
        </Button>
      </div>
    </form>
  )
}

export default DynamicForm;