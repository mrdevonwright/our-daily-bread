import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, insights, and inspiration from the Our Daily Bread movement.",
};

export const revalidate = 60;

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*, author:profiles(full_name)")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data as BlogPost[]) || [];
  } catch {
    return [];
  }
}

interface SubstackPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

function extractCDATA(raw: string): string {
  const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return cdata ? cdata[1] : raw;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch("https://ourdailybreadclub.substack.com/feed", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: SubstackPost[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const item = match[1];
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
      const linkRaw = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
      const descRaw = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "";
      const pubDateRaw = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "";

      const title = extractCDATA(titleRaw).trim();
      const link = extractCDATA(linkRaw).trim();
      const description = stripHtml(extractCDATA(descRaw)).slice(0, 160);
      const pubDate = pubDateRaw.trim();

      if (title && link) {
        items.push({ title, link, description, pubDate });
      }
    }

    return items;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const [posts, substackPosts] = await Promise.all([getPosts(), getSubstackPosts()]);

  return (
    <div>
      {/* Header */}
      <section className="bg-foreground text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Stories &amp; Inspiration
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4">
            The Blog
          </h1>
          <p className="text-white/70">
            Movement updates, baker stories, scripture reflections, and
            practical baking wisdom.
          </p>
        </div>
      </section>

      {/* Internal posts */}
      <section className="section-padding bg-wheat-texture">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🍞</span>
              <h2 className="font-serif text-2xl font-bold mb-2">
                Posts are on the way
              </h2>
              <p className="text-muted-foreground">
                Check back soon for stories, recipes, and movement updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Substack feed */}
      {substackPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-wheat text-sm font-medium uppercase tracking-widest">
                  Substack
                </span>
                <h2 className="font-serif text-3xl font-bold mt-2">
                  From Our Newsletter
                </h2>
              </div>
              <a
                href="https://substack.com/@ourdailybreadclub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-wheat hover:underline font-medium shrink-0"
              >
                Subscribe on Substack →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {substackPosts.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-cream rounded-2xl border border-wheat/15 shadow-sm p-6 flex flex-col hover:border-wheat/40 hover:shadow-md transition-all"
                >
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                    {post.pubDate
                      ? new Date(post.pubDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-wheat transition-colors leading-snug">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {post.description}…
                    </p>
                  )}
                  <span className="text-xs text-wheat font-medium mt-4">
                    Read on Substack →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
