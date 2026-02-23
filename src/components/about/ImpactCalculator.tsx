"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CALCULATOR } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function ImpactCalculator() {
  const [members, setMembers] = useState<number | "">(300);

  const count = typeof members === "number" && members > 0 ? members : 0;
  const annualRedirect = count * CALCULATOR.annual_spend_per_person;
  const loavesPerYear = count * CALCULATOR.weeks_per_year;
  const loavesPerWeek = Math.ceil(loavesPerYear / 52);
  const bakersNeeded = Math.ceil(loavesPerWeek / 10);

  return (
    <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8 max-w-2xl mx-auto">
      <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
        Impact Calculator
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Enter your church&rsquo;s congregation size to estimate the annual impact.
      </p>

      {/* Input */}
      <div className="mb-8">
        <Label htmlFor="members" className="text-sm font-medium mb-2 block">
          Number of congregation members
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="members"
            type="number"
            min={1}
            max={100000}
            value={members}
            onChange={(e) => {
              const val = e.target.value;
              setMembers(val === "" ? "" : Math.max(1, parseInt(val, 10) || 0));
            }}
            className="w-40 border-wheat/30 focus:border-wheat focus:ring-wheat/20"
          />
          <span className="text-muted-foreground text-sm">members</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ResultCard
          label="Annual $ redirected to your church"
          value={formatCurrency(annualRedirect)}
          highlight
        />
        <ResultCard
          label="Loaves of bread per year"
          value={formatNumber(loavesPerYear)}
        />
        <ResultCard
          label="Loaves needed each week"
          value={formatNumber(loavesPerWeek)}
        />
        <ResultCard
          label="Bakers needed (10 loaves each)"
          value={formatNumber(bakersNeeded)}
        />
      </div>

      {/* Assumptions */}
      <p className="text-xs text-muted-foreground border-t border-wheat/10 pt-4">
        Assumptions: avg. $
        {CALCULATOR.annual_spend_per_person}/person/year on bread ·  $
        {CALCULATOR.loaf_price}/loaf · {CALCULATOR.weeks_per_year} loaves/person/year
      </p>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? "bg-wheat text-white"
          : "bg-cream border border-wheat/15"
      }`}
    >
      <div
        className={`font-serif text-2xl font-bold mb-1 ${
          highlight ? "text-white" : "text-wheat"
        }`}
      >
        {value}
      </div>
      <div
        className={`text-xs ${
          highlight ? "text-white/80" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
