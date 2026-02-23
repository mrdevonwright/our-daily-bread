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
import { format } from "date-fns";
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
  onSuccess?: () => void;
}

export function SalesLogForm({ bakerId, churchId, onSuccess }: SalesLogFormProps) {
  const [lastSale, setLastSale] = useState<SaleLogInput | null>(null);

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
      reset({ sold_at: format(new Date(), "yyyy-MM-dd") });
      toast.success(
        `Logged ${data.loaves_count} loaves for $${data.amount_raised}!`
      );
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to log sale");
    }
  };

  return (
    <div>
      {lastSale && (
        <div className="mb-6 p-4 bg-wheat/5 border border-wheat/20 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-wheat shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Last sale logged successfully!</p>
            <p className="text-muted-foreground">
              {lastSale.loaves_count} loaves · ${lastSale.amount_raised} raised on{" "}
              {lastSale.sold_at}
            </p>
          </div>
        </div>
      )}

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
    </div>
  );
}
