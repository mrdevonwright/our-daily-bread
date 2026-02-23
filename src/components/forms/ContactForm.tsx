"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import type { ContactInput } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Please enter a message"),
});

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12 bg-wheat/5 rounded-2xl border border-wheat/20">
        <CheckCircle2 className="w-12 h-12 text-wheat mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold mb-2">Message Received!</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. We&rsquo;ll respond within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact-name">Name *</Label>
          <Input
            id="contact-name"
            {...register("name")}
            placeholder="Your name"
            className="mt-1.5"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="mt-1.5"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          {...register("subject")}
          placeholder="How can we help?"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          {...register("message")}
          rows={5}
          placeholder="Tell us about your church, your questions, or how you heard about the movement..."
          className="mt-1.5 resize-none"
        />
        {errors.message && (
          <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
