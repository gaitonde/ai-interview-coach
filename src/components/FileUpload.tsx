import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import { UseFormRegister, UseFormSetValue, FormState, UseFormClearErrors, UseFormTrigger } from "react-hook-form";
interface FileUploadProps {
  fieldName: string;
  register: UseFormRegister<any>;
  toolSlug?: string;
  setValue: UseFormSetValue<any>;
  allowedTypes?: string[];
  setToolRuns: (data: any) => void;
  clearErrors: UseFormClearErrors<any>;
  trigger: UseFormTrigger<any>;
}

export function FileUpload({
  fieldName,
  register,
  toolSlug,
  setValue,
  allowedTypes,
  setToolRuns,
  clearErrors,
  trigger,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>();
  const hasRegistered = useRef(false);

  // useEffect(() => {
  //   if (!hasRegistered.current) {
  //     console.log('registering fieldNameX; ', fieldName);
  //     // Register the field for validation but hide the actual input
  //     register(fieldName, { required: "Please select a file" });
  //     hasRegistered.current = true;
  //   }
  // }, [fieldName, register]);

  useEffect(() => {
    if (!hasRegistered.current) {
      const input = document.getElementById(fieldName) as HTMLInputElement;
      console.log('registering fieldNameX; ', fieldName);
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        console.log('file changed..', file)
        if (!file) return;
        setFileName(file.name);
        const fileObj = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        setValue(fieldName, fileObj, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        await trigger(fieldName);

      }
      hasRegistered.current = true;
    }
  }, [fieldName, register]);



  const handleUploadClick = async () => {
    // console.log('clearErrors: ', fieldName)
    // clearErrors(fieldName);
    const input = document.getElementById(fieldName) as HTMLInputElement;

    console.log('did i get it? ', input)
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.accept = allowedTypes?.join(',') || '';
    input.click();

  //   input.onchange = async (e) => {
  //     const file = (e.target as HTMLInputElement).files?.[0];
  //     console.log('file changed..', file)
  //     if (!file) return;

  //     // if (file.size > MAX_FILE_SIZE) {
  //     //   alert('File size exceeds 4MB limit');
  //     //   return;
  //     // }

  //     setFileName(file.name);
  //     // Convert File to plain object to work with zod
  //     const fileObj = {
  //       name: file.name,
  //       size: file.size,
  //       type: file.type,
  //       lastModified: file.lastModified,
  //     };
  //     setValue(fieldName, fileObj, {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //       shouldTouch: true
  //     });
  //     await trigger(fieldName);

  //     // try {
  //     setIsUploading(true);
  //     clearErrors(fieldName);
  //     // track('SubmittedResumeUpload');
  //     const profileId = Cookies.get('profileId') as string;
  //     const formData = new FormData();
  //     formData.append('profileId', profileId);
  //     formData.append('toolSlug', toolSlug as string);
  //     formData.append('resumeFile', file);

  //     // const response = await fetch('/api/v2/tools', {
  //     //   method: 'POST',
  //     //   body: formData,
  //     // });

  //     // if (!response.ok) throw new Error('Upload failed');

  //     // const r2 = await response.json();
  //     // console.log('payload: ', r2.payload)
  //     // setToolRuns(r2.payload.toolRuns)
  //     // resolve(true)
  //   // } catch (error) {
  //   //   console.error('Upload error:', error)
  //   //   resolve(false)
  //   // } finally {
  //   //   setIsUploading(false)
  //   // }

  //   };
  };

  return (
    <div>
      <Button
        id="resume-upload-btn"
        size="lg"
        className="text-sm w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-gray-800"
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        <span className="min-w-[200px]">
          {isUploading ? "Uploading..." : fileName ? `Selected: ${fileName}` : "Choose Resume"}
        </span>
      </Button>
      <input
        type="file"
        id={fieldName}
        {...register(fieldName)}
        accept={allowedTypes?.map(type => `.${type}`).join(',')}
        className="block w-full"
        //
      />

    </div>
  );
}