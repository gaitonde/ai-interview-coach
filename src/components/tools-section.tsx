import { Card } from "@/components/ui/card";
import { tools } from "@/data/tools";
import { useMixpanel } from "@/hooks/use-mixpanel";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ToolsSection() {
  const router = useRouter();
  const { track } = useMixpanel();
  const { isSignedIn } = useAuth();
  const { openSignUp } = useClerk();

  const handleToolClick = (slug: string | undefined) => {
    track('ViewToolAttempt', {tool: slug});
    if (isSignedIn) {
      if (slug) {
        router.push(slug);
      }
    } else {
      track('ViewSignup')
      openSignUp({forceRedirectUrl: slug});
    }
  }

  return (
    <section className="px-4 py-4">
      <div className="mx-auto max-w-7xl">
{/*
        <div className="mb-12 text-center">
          <h2 className="mb-2 flex items-center justify-center gap-2 text-4xl font-bold text-emerald-400">
            <Sparkles className="h-8 w-8 text-emerald-400" />
            Tools for Job Seekers
            <Sparkles className="h-8 w-8 text-emerald-400" />
          </h2>
          <p className="text-xl text-gray-300">
            Our tools are designed to help you interview with confidence—
            <span className="text-emerald-400">100% Free!</span>
          </p>
        </div>
 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              className={`group relative flex flex-col bg-gray-800/50 p-6 text-white transition-all ${
                tool.disabled ? 'opacity-75 cursor-not-allowed' :
                tool.slug ? 'cursor-pointer hover:bg-gray-700/50' :
                'opacity-75 cursor-not-allowed'
              }`}
              onClick={() => !tool.disabled && handleToolClick(tool.slug)}
            >
              {tool.label && (
                <div
                  className={`absolute right-2 top-2 rounded-full px-3 py-1 text-sm text-white font-semibold ${
                    tool.label === "New" ? "bg-emerald-600" : "bg-purple-500"
                  }`}
                >
                  {tool.label}
                </div>
              )}
              {/* Uncomment when ready to implement */}
              {/* {tool.users && (
                <div className="absolute right-2 top-2 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
                  {tool.users}
                </div>
              )}
              {tool.trending && (
                <div className="absolute right-2 top-10 rounded-full bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
                  🔥 Trending
                </div>
              )}
              {tool.popular && (
                <div className="absolute right-2 top-10 rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                  ⭐⭐⭐⭐⭐ Popular
                </div>
              )} */}
              <div className="absolute left-2 top-2 ml-4 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">{tool.icon}</div>
              <h3 className="mt-12 mb-2 text-xl font-semibold text-emerald-400">{tool.title}</h3>
              <p className="mb-4 flex-grow text-gray-300">{tool.description}</p>
              {/* Hide button if no slug */}
              {tool.slug && (
                <div className={`w-full rounded-md py-2 text-center text-white transition-colors ${
                  tool.disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-500 group-hover:bg-emerald-600'
                }`}>
                  Try {tool.title}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

