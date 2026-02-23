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
import { CheckCircle2, Twitter, Instagram, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import type { SaleLogInput } from "@/lib/types";

const schema = z.object({
  loaves_count: z
    .number({ invalid_type_error: "Enter a number" })
    .min(1, "Must be at least 1 loaf"),
  amount_raised: z
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Cannot be negative"),
  sold_at: z.string().min(1, "Please select a date"),
  notes: z.string().optional(),
});

interface SalesLogFormProps {
  bakerId: string;
  churchId: string;
  churchName?: string;
  bakerName?: string;
  onSuccess?: () => void;
}

export function SalesLogForm({ bakerId, churchId, churchName, bakerName, onSuccess }: SalesLogFormProps) {
  const [lastSale, setLastSale] = useState<SaleLogInput | null>(null);
  const [storySubmitted, setStorySubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaleLogInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      sold_at: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: SaleLogInput) => {
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, baker_id: bakerId, church_id: churchId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to log sale");
      }
      setLastSale(data);
      setStorySubmitted(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to log sale");
    }
  };

  const church = churchName || "our church";

  async function submitStory(sale: SaleLogInput) {
    if (storySubmitted) return;
    setStorySubmitted(true);
    const story =
      `This Sunday at ${church}, we sold ${sale.loaves_count} loaf${sale.loaves_count !== 1 ? "s" : ""} of sourdough bread, raising $${sale.amount_raised} for our ministry.` +
      (sale.notes ? ` ${sale.notes}` : "");
    const supabase = createClient();
    await supabase.from("story_submissions").insert({
      name: bakerName || "Baker",
      church_name: churchName || null,
      story,
      submitted_by: bakerId,
      approved: false,
    });
  }

  function handleShareX(sale: SaleLogInput) {
    const text = `🍞 We sold ${sale.loaves_count} loaf${sale.loaves_count !== 1 ? "s" : ""} of sourdough this Sunday, raising $${sale.amount_raised} for ${church}'s bread ministry! #OurDailyBreadMovement ourdailybread.club`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    submitStory(sale);
  }

  function handleShareInstagram(sale: SaleLogInput) {
    const text = `🍞 We sold ${sale.loaves_count} loaf${sale.loaves_count !== 1 ? "s" : ""} of sourdough this Sunday, raising $${sale.amount_raised} for ${church}'s bread ministry! Every loaf is a blessing. ✨\n\n#OurDailyBreadMovement #ChurchBread #SourdoughMinistry`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied! Open Instagram and paste as your caption.");
    });
    submitStory(sale);
  }

  function handleShareSubstack(sale: SaleLogInput) {
    const text = `## 🍞 Sunday Bread Report\n\nThis Sunday at **${church}**, we sold **${sale.loaves_count} loaf${sale.loaves_count !== 1 ? "s" : ""}** of sourdough bread, raising **$${sale.amount_raised}** for our ministry.${sale.notes ? `\n\n${sale.notes}` : ""}\n\nBakers across America are selling homemade sourdough bread to support their church's mission. Join the movement at [ourdailybread.club](https://ourdailybread.club).\n\n#OurDailyBreadMovement`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied! Paste into your Substack draft.");
    });
    window.open("https://substack.com/publish/post/new", "_blank");
    submitStory(sale);
  }

  // ── Share card (replaces form after a successful log) ────────────────────────
  if (lastSale) {
    return (
      <div className="space-y-6">
        {/* Success summary */}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-wheat shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Sale logged!</p>
            <p className="text-sm text-muted-foreground">
              {lastSale.loaves_count} loaf{lastSale.loaves_count !== 1 ? "s" : ""} · ${lastSale.amount_raised} raised · {lastSale.sold_at}
            </p>
          </div>
        </div>

        {/* Share section */}
        <div className="border-t border-wheat/15 pt-5">
          <p className="text-sm font-medium text-foreground mb-1">Share the news</p>
          <p className="text-xs text-muted-foreground mb-4">
            Spread the word and your story will be added to the{" "}
            <a href="/social" className="text-wheat hover:underline" target="_blank">stories feed</a> for review.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => handleShareX(lastSale)}
              variant="outline"
              className="gap-2 border-wheat/30 hover:border-wheat hover:bg-wheat/5"
            >
              <Twitter className="w-4 h-4" />
              Share on X
            </Button>
            <Button
              onClick={() => handleShareInstagram(lastSale)}
              variant="outline"
              className="gap-2 border-wheat/30 hover:border-wheat hover:bg-wheat/5"
            >
              <Instagram className="w-4 h-4" />
              Copy for Instagram
            </Button>
            <Button
              onClick={() => handleShareSubstack(lastSale)}
              variant="outline"
              className="gap-2 border-wheat/30 hover:border-wheat hover:bg-wheat/5"
            >
              <span className="text-base leading-none font-bold">S</span>
              Post to Substack
            </Button>
          </div>
        </div>

        {/* Log another */}
        <div className="border-t border-wheat/15 pt-5">
          <button
            onClick={() => {
              setLastSale(null);
              reset({ sold_at: format(new Date(), "yyyy-MM-dd") });
            }}
            className="flex items-center gap-1.5 text-sm text-wheat hover:underline"
          >
            <PlusCircle className="w-4 h-4" />
            Log another sale
          </button>
        </div>
      </div>
    );
  }

  // ── Log form ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="loaves-count">Number of Loaves *</Label>
          <Input
            id="loaves-count"
            type="number"
            min={1}
            {...register("loaves_count", { valueAsNumber: true })}
            placeholder="5"
            className="mt-1.5"
          />
          {errors.loaves_count && (
            <p className="text-xs text-destructive mt-1">{errors.loaves_count.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="amount-raised">Total $ Raised *</Label>
          <Input
            id="amount-raised"
            type="number"
            step="0.01"
            min={0}
            {...register("amount_raised", { valueAsNumber: true })}
            placeholder="36.00"
            className="mt-1.5"
          />
          {errors.amount_raised && (
            <p className="text-xs text-destructive mt-1">{errors.amount_raised.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="sold-at">Date *</Label>
          <Input
            id="sold-at"
            type="date"
            {...register("sold_at")}
            className="mt-1.5"
          />
          {errors.sold_at && (
            <p className="text-xs text-destructive mt-1">{errors.sold_at.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          rows={2}
          placeholder="Sold out in 20 minutes! Demand for 10 next week."
          className="mt-1.5 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-wheat hover:bg-wheat-dark text-white px-8 py-5 text-base"
      >
        {isSubmitting ? "Logging Sale…" : "Log This Sale"}
      </Button>
    </form>
  );
}
