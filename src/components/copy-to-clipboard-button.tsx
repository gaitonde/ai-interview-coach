"use client";

import { useMixpanel } from "@/hooks/use-mixpanel";
import { useToast } from '@/hooks/use-toast';
import { Copy } from "lucide-react";
import { Button } from "./ui/button";

const CopyToClipboardButton = ({
    tool,
    content,
    btnText = "Click to copy"
}: {
    tool: string,
    content: string,
    btnText?: string,
}) => {
    const { toast } = useToast();
    const { track } = useMixpanel();

    const copyContent = () => {
        navigator.clipboard.writeText(content);
        track('ToolContentCopied', { tool });
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        copyContent();

        toast({
            duration: 2000,
            title: "Copied!",
            className: "bg-blue-800 text-white border-0",
            // description: `
            //   Unable to get any interviews for the profile with id.
            //   Either add an is_demo bit to an interview for this profile or remove the is_demo bit from this profile.
            //   `,
          })

      };

    return (
        <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-800 py-2 px-4 rounded-md transition-colors"
            onClick={handleClick}
            color="primary"
        >
            <Copy /> {btnText}
        </Button>
    )
}

export default CopyToClipboardButton;