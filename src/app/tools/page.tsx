'use client';

export default function Tools() {
    const tools = [
        {
            icon: '🔧',
            name: 'Company Scouting Report',
            description: 'This is the Company Scouting Report.',
            slug: '/tools/company-scouting-report'
        },
        {
            icon: '🔨',
            name: 'Interviewer Scouting Report',
            description: 'This is the Interviewer Scouting Report.',
            slug: '/tools/interviewer-scouting-report'
        },
        {
            icon: '🛠️',
            name: 'Question Scouting Report',
            description: 'This is the Question Scouting Report.',
            slug: '/tools/question-scouting-report'
        }
    ];

    return (
      <div className="flex flex-col min-h-screen bg-[#111827]">
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 my-6">
          <div className="w-full max-w-4xl sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
            <div className="text-[#F9FAFB] p-4">
              <h1 className="text-4xl font-bold text-emerald-400 mb-2">Tools</h1>
              <ul className="space-y-8 py-8">
                  {tools.map((tool) => (
                      <li key={tool.slug}>
                          <a href={tool.slug}>
                              <span>{tool.icon}</span>
                              <strong>{tool.name}</strong>
                              <p>{tool.description}</p>
                          </a>
                      </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
}
