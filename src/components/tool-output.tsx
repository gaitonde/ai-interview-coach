// MarkdownOutput.tsx
import MarkdownRenderer from "@/components/markdown-renderer";

interface BaseOutputProps {
  content: string;
}

export function MarkdownOutput({ content }: BaseOutputProps) {
  return <div><MarkdownRenderer content={content} /></div>;
}

// HtmlOutput.tsx
export function HtmlOutput({ content }: BaseOutputProps) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// ToolOutput.tsx as a wrapper
export function ToolOutput({ children, content }: { children: React.ReactNode, content: string }) {
  return (
    <div className="w-full max-w-full sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
      <div className="text-[#F9FAFB] p-4">
        {children}
      </div>
    </div>
  );
}