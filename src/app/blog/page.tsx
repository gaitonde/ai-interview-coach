import Link from "next/link";
// import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Clock } from "lucide-react";
import { PortableText, SanityDocument } from "next-sanity";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, image, publishedAt, readTime, body}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

const categories = ["All", "Med School Prep", "Interview Techniques", "Ethics", "Internships", "Application Process"]

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
  console.log('posts: ', posts)

  const post0ImageUrl = (posts.length > 0 && posts[0].image)
  ? urlFor(posts[0].image)?.width(550).height(310).url()
  : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F2937] to-[#111827] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8 text-emerald-400 text-center">Interview Insights</h1>
        <p className="text-xl mb-12 text-gray-300 text-center max-w-3xl mx-auto">
          Discover expert advice, proven strategies, and insider tips to excel in your interviews and
          secure prestigious entry level jobs and internships.
        </p>

        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-emerald-400">Featured Article</h2>
            <div className="bg-white/5 rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                {post0ImageUrl && (
                  <img
                    src={post0ImageUrl}
                    alt={posts[0].title}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover md:w-48"
                  />
                )}
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-emerald-400 font-semibold">
                    {posts[0].category}
                  </div>
                  <Link
                    href={`/blog/${posts[0].slug.current}`}
                    className="block mt-1 text-2xl leading-tight font-bold text-white hover:text-emerald-300 transition-colors duration-200"
                  >
                    {posts[0].title}
                  </Link>

                  {Array.isArray(posts[0].body) && <PortableText value={posts[0].body} />}

                  <div className="mt-4 flex items-center text-gray-400 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>{posts[0].readTime} {(posts[0].readTime === 1) ? ' minute' : ' minutes'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.slice(1).map((post) => {
            const imageUrl = post.image
              ? urlFor(post.image)?.width(550).height(310).url()
              : "/placeholder.svg?height=200&width=400&text=Placeholder+Image"; // Use placeholder image if post.image is undefined or null
            return (
              <article
                key={post.id}
                className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
              >
                <Link href={`/blog/${post.slug.current}`}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                )}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-400">{post.date}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-white hover:text-emerald-300 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock size={16} className="mr-1" />
                      <span>{post.readTime} {(post.readTime === 1) ? ' minute' : ' minutes'}</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  )
}

