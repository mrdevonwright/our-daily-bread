"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  church_name: z.string().optional(),
  story: z
    .string()
    .min(30, "Please share at least a few sentences about your experience"),
});

type FormData = z.infer<typeof schema>;

export default function StoryForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("story_submissions")
        .insert({ ...data, approved: false });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Thank you! Your story will be reviewed soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 bg-wheat/5 rounded-2xl border border-wheat/20">
        <CheckCircle2 className="w-12 h-12 text-wheat mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold mb-2">Story Received!</h3>
        <p className="text-muted-foreground text-sm">
          Thank you for sharing. Your story will appear here after review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="story-name">Your Name *</Label>
        <Input
          id="story-name"
          {...register("name")}
          placeholder="Jane Smith"
          className="mt-1.5"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="story-church">Church Name (optional)</Label>
        <Input
          id="story-church"
          {...register("church_name")}
          placeholder="Grace Community Church, Nashville TN"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="story-text">Your Story *</Label>
        <Textarea
          id="story-text"
          {...register("story")}
          rows={5}
          placeholder="Tell us about your experience baking for your church. How did it start? What impact has it had?..."
          className="mt-1.5 resize-none"
        />
        {errors.story && (
          <p className="text-xs text-destructive mt-1">{errors.story.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-wheat hover:bg-wheat-dark text-white py-5"
      >
        {isSubmitting ? "Submitting…" : "Submit My Story"}
      </Button>
    </form>
  );
}
