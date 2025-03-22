import { useState, useRef, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { useMixpanel } from "@/hooks/use-mixpanel";

interface FileUploadButtonProps {
  fieldName: string;
  // onFileSelected: (file: File | null) => void;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  allowedTypes?: string[];
  toolSlug?: string;
  setToolRuns: (data: any) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  fieldName,
  // onFileSelected,
  register,
  setValue,
  trigger,
  allowedTypes,
  toolSlug,
  setToolRuns,
}) => {
  const { track } = useMixpanel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>();
  // const [isFileUploaded, setIsFileUploaded] = useState(false);
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (!hasRegistered.current) {
      register(fieldName, { required: "Please select a file" });
      hasRegistered.current = true;
    }
  }, [fieldName, register]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const resumeFileName = (file.name.length > 20) ? `${file.name.substring(0, 20)}...` : file.name;
      setFileName(resumeFileName);

      //TODO: restrict file size
      // if (file.size > MAX_FILE_SIZE) {
      //   alert('File size exceeds 4MB limit');
      //   return;
      // }

      try {
        setIsUploading(true);
        const profileId = Cookies.get('profileId') as string;
        track('v2.SubmittedResumeUploadAttempt', { profileId, slug: toolSlug });

        const formData = new FormData();
        formData.append('profileId', profileId);
        formData.append('toolSlug', toolSlug as string);
        formData.append('resumeFile', file);

        const response = await fetch('/api/v2/tools', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        track('v2.SubmittedResumeUploadSuccess', { profileId, slug: toolSlug });
        const r2 = await response.json();
        console.log('payload: ', r2.payload);
        setToolRuns(r2.payload.toolRuns);
        // setIsFileUploaded(true);
      // Convert File to object for zod validation
      const fileObj = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        isFileUploaded: true
      };

      setValue(fieldName, fileObj, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      setValue(fieldName, null);
      await trigger(fieldName);
    }
  };

  return (
    <>
      <input
        id={fieldName}
        type="file"
        ref={fileInputRef}
        name={fieldName}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept={allowedTypes?.map(type => `.${type}`).join(',')}
      />

      <Button
        type="button"
        size="lg"
        className="text-sm w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-gray-800"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        <span className="min-w-[200px]">
          {isUploading ? "Uploading..." : fileName ? `Selected: ${fileName}` : "Choose Resume"}
        </span>
      </Button>

    </>
  );
};

export default FileUploadButton;