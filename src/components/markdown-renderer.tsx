import React from 'react';
import ReactMarkdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}



export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex-grow flex justify-center my-6">
        <div className="w-full sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
          <div className="markdown-content text-[#F9FAFB] p-4">
            <ReactMarkdown
              rehypePlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-4xl sm:text-4xl font-bold text-[#10B981] text-center my-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981] mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-[#D1D5DB] mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                a: ({ node, ...props }) => <a className="text-[#10B981] hover:underline" target="_blank" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                table: ({ node, ...props }) => <table className="w-full border-collapse mb-4" {...props} />,
                th: ({ node, ...props }) => <th className="p-2 border border-[#374151] bg-[#374151] text-[#F9FAFB]" {...props} />,
                td: ({ node, ...props }) => <td className="p-2 border border-[#374151] text-[#F9FAFB]" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
