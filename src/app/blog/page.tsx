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

export default async function BlogPage() {
  const posts = await getPosts();

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

      {/* Posts */}
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
    </div>
  );
}
