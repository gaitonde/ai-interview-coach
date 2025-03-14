import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface FileUploadProps {
  fieldName: string;
  register: UseFormRegister<any>;
  fileName?: String;
  toolSlug?: string;
  allowedTypes?: string[];
  setToolRuns: (data: any) => void
}


export function FileUpload({
  fieldName,
  register,
  fileName,
  toolSlug,
  allowedTypes,
  setToolRuns
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFile = async () => {
    uploadFile().then(uploaded => {
      console.log('resume uploaded: ', uploaded)
      if (uploaded) {
      } else {
        // track('UploadResumeFailed');
      }
    })
  }

  const uploadFile = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/pdf'

      input.onchange = async (e) => {
        console.log('on change')
        const file = (e.target as HTMLInputElement).files?.[0]
        console.log('file: ', file)
        if (!file) {
          resolve(false)
          return
        }

        try {
          setIsUploading(true);
          // track('SubmittedResumeUpload');
          const profileId = Cookies.get('profileId') as string;
          const formData = new FormData();
          formData.append('profileId', profileId);
          formData.append('toolSlug', toolSlug as string);
          formData.append('resumeFile', file);

          const response = await fetch('/api/v2/tools', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Upload failed');

          const r2 = await response.json();
          console.log('payload: ', r2.payload)
          setToolRuns(r2.payload.toolRuns)
          // setContent(`# ${tool?.displayName}\n\n` + r2.payload.finalOutput);
          // setShowOutput(true);
          // console.log('Res Text: ', r2.payload.output.resume.text)
          // console.log('URL: ', r2.payload.output.resume.url)
          // setIsResumeUploaded(true);
          // const resumeFileName = (file.name.length > 20) ? `${file.name.substring(0, 20)}...` : file.name;
          // setResumeFileName(resumeFileName);
          // track('UploadResumeSuccess');
          resolve(true)
        } catch (error) {
          console.error('Upload error:', error)
          resolve(false)
        } finally {
          setIsUploading(false)
        }
      }

      input.click()
    })
  }

  function xxx(): void {
    console.log('handle..')
    // throw new Error("Function not implemented.");
  }

  return (
    <>
      <Button
        size="lg"
        className="text-sm w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-gray-800"
        onClick={(e) => {
          e.preventDefault();
          handleUploadFile();
        }}
        disabled={isUploading}
      >
        <span className="min-w-[200px]">
          {isUploading ? "Uploading..." : fileName ? `Selected Resume: ${fileName}` : "Choose Resume"}
        </span>
      </Button>
{/*
      <input
        type="file"
        id={fieldName}
        {...register(fieldName)}
        accept={allowedTypes?.map(type => `.${type}`).join(',')}
        className="block w-full"
      /> */}

    </>
  );
}