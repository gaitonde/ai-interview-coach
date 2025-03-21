import { Card } from "@/components/ui/card";
import { displayableTools } from "@/data/tools";
import { useMixpanel } from "@/hooks/use-mixpanel";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ToolsSection() {
  const router = useRouter();
  const { track } = useMixpanel();
  const { isSignedIn } = useAuth();
  const { openSignUp } = useClerk();
  const { user } = useUser();

  const isProd = typeof window !== 'undefined' && window.location.hostname.split('.')[0] === 'www';

  const handleToolClick = (slug: string | undefined) => {
    const path = `/tools/${slug}`;
    track('v2.ViewToolAttempt', { slug });
    if (isSignedIn) {
      if (slug) {
        router.push(path);
      }
    } else {
      track('v2.ViewSignup')
      openSignUp({forceRedirectUrl: path});
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
          {displayableTools.map((tool) => (
            <Card
              key={tool.slug}
              className={`group relative flex flex-col bg-gray-800/50 p-6 text-white transition-all ${
                ((!tool.disabled || !isProd) && tool.slug)? 'cursor-pointer hover:bg-gray-700/50' :
                  'opacity-75 cursor-not-allowed'
              }`}
              onClick={() => (!isProd || !tool.disabled) && handleToolClick(tool.slug)}
            >
              {tool.labels?.includes('New') && (
                <div
                  className={"absolute right-2 top-2 rounded-full px-3 py-1 text-sm text-white font-semibold bg-blue-500"}
                >
                  New
                </div>
              )}

              {tool.labels?.includes('Trending') && (
                <div
                  className={"absolute right-2 top-2 rounded-full px-3 py-1 text-sm text-white font-semibold bg-purple-500"}
                >
                  Trending
                </div>
              )}

              {tool.labels?.includes('Coming Soon') && (
                <div
                className={"absolute right-2 top-2 rounded-full px-3 py-1 text-sm text-white font-semibold bg-orange-500"}
              >
                Coming Soon
              </div>
              )}

              {/* Uncomment when ready to implement */}
              {/* {tool.users && (
                <div className="absolute right-2 top-2 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
                  {tool.users}
                </div>
              )}
                */}
              {tool.labels?.includes('Trending') && (
                <div className="absolute top-2 right-2 rounded-full bg-purple-500 px-3 py-1 text-sm font-semibold text-white">
                  🔥 Trending
                </div>
              )}
              {/*}
              {tool.popular && (
                <div className="absolute right-2 top-10 rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                  ⭐⭐⭐⭐⭐ Popular
                </div>
              )} */}
              <div className="absolute left-2 top-2 ml-4 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">{tool.icon}</div>
              <h3 className="mt-12 mb-2 text-xl font-semibold text-emerald-400">{tool.name}</h3>
              <p className="mb-4 flex-grow text-gray-300">{tool.description}</p>
              {/* Hide button if no slug */}
              {tool.slug && (
                <div className={`w-full rounded-md py-2 text-center text-white transition-colors ${
                  (isProd && tool.disabled) ? 'bg-orange-500 cursor-not-allowed' : 'bg-emerald-500 group-hover:bg-emerald-600'
                }`}>
                  {(isProd && tool.disabled) ? 'Coming soon' : `Try ${tool.name}`}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
      {/* TODO: remove debug */}
      <div className="text-[#1a1f2b]">
        Debug: env: {process.env.NODE_ENV} ({isProd})
        <div>
          Debug: hostname: {window?.location?.hostname})
          Debug: host[0]: {window.location.hostname.split('.')[0]}
        </div>
      </div>
    </section>
  )
}

