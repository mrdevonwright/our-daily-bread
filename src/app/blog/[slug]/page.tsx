import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*, author:profiles(full_name)")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return (data as BlogPost) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div>
      {/* Back link */}
      <div className="bg-white border-b border-wheat/20 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-wheat transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image && (
        <div className="w-full max-h-[400px] overflow-hidden bg-cream">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            {post.published_at ? formatDate(post.published_at) : ""}
            {post.author && (
              <>
                <span>·</span>
                <span>{post.author.full_name}</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-wheat/40 pl-4 font-serif italic">
              {post.excerpt}
            </p>
          )}
        </header>

        <div
          className="prose prose-stone max-w-none prose-headings:font-serif prose-a:text-wheat prose-blockquote:border-wheat prose-blockquote:text-burgundy"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
