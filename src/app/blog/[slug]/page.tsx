import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { Metadata } from "next";
import { PortableText, type SanityDocument } from "next-sanity";
import Link from "next/link";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // This would typically fetch data from a CMS or database
  const title = "test";
  // params.slug
  //   .split("-")
  //   .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //   .join(" ")

  return {
    title: `${title} - Interview Playbook Blog`,
    description: `Learn more about ${title.toLowerCase()} and improve your interview skills with Interview Playbook.`,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {

  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;

  return (
    <div className="min-h-screen bg-[#1F2937] text-white">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {postImageUrl && (
          <div className="flex justify-center my-8">
            <img
              src={postImageUrl}
              alt={post.title}
              className="aspect-video rounded-xl"
              width="550"
              height="310"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-emerald-400 mb-2">{post.title}</h1>

        <Link href="/blog" className="hover:underline">
          ← Back to posts
        </Link>

        <div className="prose prose-invert prose-emerald mt-8">
          {Array.isArray(post.body) && <PortableText value={post.body} />}
        </div>
      </article>
    </div>
  )
}

