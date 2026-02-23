"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DONATION_AMOUNTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DonateClient() {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  const finalAmount = isCustom ? parseFloat(customAmount) || 0 : amount;

  const handleDonate = async () => {
    if (finalAmount < 1) {
      toast.error("Please enter an amount of at least $1");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, is_recurring: isRecurring }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* One-time vs Recurring */}
      <div className="grid grid-cols-2 gap-2 bg-cream rounded-xl p-1">
        <button
          onClick={() => setIsRecurring(false)}
          className={cn(
            "py-2.5 rounded-lg text-sm font-medium transition-colors",
            !isRecurring
              ? "bg-white text-foreground shadow-sm border border-wheat/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          One-Time
        </button>
        <button
          onClick={() => setIsRecurring(true)}
          className={cn(
            "py-2.5 rounded-lg text-sm font-medium transition-colors",
            isRecurring
              ? "bg-white text-foreground shadow-sm border border-wheat/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
      </div>

      {/* Preset amounts */}
      <div>
        <Label className="mb-3 block">Select Amount</Label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {DONATION_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setAmount(preset);
                setIsCustom(false);
              }}
              className={cn(
                "py-3 rounded-xl border text-sm font-semibold transition-all",
                !isCustom && amount === preset
                  ? "bg-wheat border-wheat text-white"
                  : "bg-white border-wheat/20 text-muted-foreground hover:border-wheat hover:text-wheat"
              )}
            >
              ${preset}
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className={cn(
              "py-3 rounded-xl border text-sm font-semibold transition-all",
              isCustom
                ? "bg-wheat border-wheat text-white"
                : "bg-white border-wheat/20 text-muted-foreground hover:border-wheat hover:text-wheat"
            )}
          >
            Custom
          </button>
        </div>

        {isCustom && (
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                type="number"
                min={1}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="pl-8"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {finalAmount >= 1 && (
        <div className="bg-cream rounded-xl p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Donation amount</span>
            <span className="font-semibold">
              ${finalAmount.toFixed(2)}
              {isRecurring ? "/month" : ""}
            </span>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Processing fee (Stripe)</span>
            <span>~${(finalAmount * 0.029 + 0.30).toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleDonate}
        disabled={loading || finalAmount < 1}
        className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base font-semibold"
      >
        {loading
          ? "Redirecting to Checkout…"
          : `Donate $${finalAmount >= 1 ? finalAmount.toFixed(2) : "—"}${isRecurring ? "/month" : ""}`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Payments are processed securely by Stripe. You will be redirected to a
        secure checkout page.
      </p>
    </div>
  );
}
