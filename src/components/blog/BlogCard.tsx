import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDateShort, truncate } from "@/lib/utils";
import { ArrowRight, Calendar } from "lucide-react";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-2xl border border-wheat/15 shadow-sm overflow-hidden group hover:border-wheat/40 transition-colors">
      {post.cover_image && (
        <div className="aspect-[16/9] overflow-hidden bg-cream">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {!post.cover_image && (
        <div className="aspect-[16/9] bg-gradient-to-br from-wheat/10 to-wheat/5 flex items-center justify-center">
          <span className="text-5xl">🍞</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="w-3 h-3" />
          {post.published_at ? formatDateShort(post.published_at) : ""}
          {post.author && (
            <>
              <span>·</span>
              <span>{post.author.full_name}</span>
            </>
          )}
        </div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-wheat transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {truncate(post.excerpt, 140)}
          </p>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-wheat hover:text-wheat-dark transition-colors"
        >
          Read more
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
