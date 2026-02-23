import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { StorySubmission } from "@/lib/types";
import StoryForm from "./StoryForm";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Stories and testimonials from Our Daily Bread bakers across the country.",
};

export const revalidate = 60;

async function getApprovedStories(): Promise<StorySubmission[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("story_submissions")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);
    return (data as StorySubmission[]) || [];
  } catch {
    return [];
  }
}

export default async function SocialPage() {
  const stories = await getApprovedStories();

  return (
    <div>
      {/* Header */}
      <section className="bg-foreground text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            The Community
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4">
            Stories from Bakers
          </h1>
          <p className="text-white/70">
            Real stories from real bakers across America. Every loaf has a story.
          </p>
        </div>
      </section>

      {/* X / Social embed */}
      <section className="section-padding bg-white border-b border-wheat/20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Follow the Movement
          </span>
          <h2 className="font-serif text-2xl font-bold mt-3 mb-2">
            Join the Conversation
          </h2>
          <p className="text-muted-foreground mb-8">
            Use{" "}
            <strong className="text-wheat">#OurDailyBreadMovement</strong> to
            share your loaves and stories on X (Twitter) and Instagram.
          </p>

          {/* Static X post embed — replace with real post URL */}
          <div className="max-w-xl mx-auto bg-cream border border-wheat/20 rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Social feed coming soon — follow us and tag your loaves!
            </p>
            <p className="font-serif text-xl font-bold text-wheat">
              #OurDailyBreadMovement
            </p>
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="section-padding bg-wheat-texture">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-wheat text-sm font-medium uppercase tracking-widest">
              From the Community
            </span>
            <h2 className="font-serif text-3xl font-bold mt-3 mb-3">
              Baker Stories
            </h2>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-5xl block mb-4">🙏</span>
              <p>Be among the first to share your story.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl p-6 border border-wheat/15 shadow-sm"
                >
                  {story.photo_url && (
                    <img
                      src={story.photo_url}
                      alt={`${story.name}'s bread`}
                      className="w-full aspect-square object-cover rounded-xl mb-4"
                    />
                  )}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-serif italic">
                    &ldquo;{story.story}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{story.name}</p>
                    {story.church_name && (
                      <p className="text-muted-foreground text-xs">{story.church_name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Story */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-wheat text-sm font-medium uppercase tracking-widest">
              Share Yours
            </span>
            <h2 className="font-serif text-3xl font-bold mt-3 mb-3">
              Submit Your Story
            </h2>
            <p className="text-muted-foreground">
              Have a testimony from your bread ministry? We&rsquo;d love to hear it.
              Approved stories appear on this page.
            </p>
          </div>
          <StoryForm />
        </div>
      </section>
    </div>
  );
}
