"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Share2, Pencil, Trash2, Check, X as XIcon, Twitter, Instagram } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { SaleLog } from "@/lib/types";

interface Props {
  sales: SaleLog[];
  churchName: string;
  bakerName: string;
  bakerId: string;
}

export function RecentSalesTable({ sales, churchName, bakerName, bakerId }: Props) {
  const router = useRouter();
  const [shareId, setShareId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ loaves_count: 0, amount_raised: 0, sold_at: "", notes: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submittedStories, setSubmittedStories] = useState<Set<string>>(new Set());

  const church = churchName || "our church";

  async function submitStory(sale: SaleLog) {
    if (submittedStories.has(sale.id)) return;
    setSubmittedStories(prev => { const next = new Set(prev); next.add(sale.id); return next; });
    const story =
      `On ${formatDate(sale.sold_at)}, ${church} sold ${sale.loaves_count} loaf${sale.loaves_count !== 1 ? "s" : ""} of sourdough bread, raising $${sale.amount_raised} for our ministry.` +
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

  function handleShareX(sale: SaleLog) {
    const text = `🍞 On ${formatDate(sale.sold_at)}, we sold ${sale.loaves_count} sourdough loaf${sale.loaves_count !== 1 ? "s" : ""}, raising $${sale.amount_raised} for ${church}'s ministry! #OurDailyBreadMovement ourdailybread.club`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    submitStory(sale);
    setShareId(null);
  }

  function handleShareInstagram(sale: SaleLog) {
    const text = `🍞 On ${formatDate(sale.sold_at)}, we sold ${sale.loaves_count} sourdough loaf${sale.loaves_count !== 1 ? "s" : ""}, raising $${sale.amount_raised} for ${church}'s bread ministry! #OurDailyBreadMovement #ChurchBread`;
    navigator.clipboard.writeText(text).then(() => toast.success("Copied! Paste in Instagram."));
    submitStory(sale);
    setShareId(null);
  }

  function handleShareSubstack(sale: SaleLog) {
    const text = `## 🍞 Sunday Bread Report\n\nOn ${formatDate(sale.sold_at)} at **${church}**, we sold **${sale.loaves_count} loaf${sale.loaves_count !== 1 ? "s" : ""}** of sourdough, raising **$${sale.amount_raised}**.${sale.notes ? `\n\n${sale.notes}` : ""}\n\n[Join the movement](https://ourdailybread.club)\n\n#OurDailyBreadMovement`;
    navigator.clipboard.writeText(text).then(() => toast.success("Copied! Paste into Substack."));
    window.open("https://substack.com/publish/post/new", "_blank");
    submitStory(sale);
    setShareId(null);
  }

  function startEdit(sale: SaleLog) {
    setEditId(sale.id);
    setEditValues({ loaves_count: sale.loaves_count, amount_raised: Number(sale.amount_raised), sold_at: sale.sold_at, notes: sale.notes || "" });
    setShareId(null);
    setDeleteId(null);
  }

  async function saveEdit(saleId: string) {
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast.success("Sale updated.");
      setEditId(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function deleteSale(saleId: string) {
    try {
      const res = await fetch(`/api/sales/${saleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast.success("Sale deleted.");
      setDeleteId(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-wheat/15 p-10 text-center">
        <span className="text-4xl block mb-3">🍞</span>
        <p className="text-muted-foreground mb-4">
          No sales logged yet. Start selling and log your first Sunday!
        </p>
        <Link href="/dashboard/sales">
          <Button className="bg-wheat hover:bg-wheat-dark text-white">Log My First Sale</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-cream border-b border-wheat/20">
          <tr>
            <th className="text-left px-5 py-3 text-muted-foreground font-medium">Date</th>
            <th className="text-right px-5 py-3 text-muted-foreground font-medium">Loaves</th>
            <th className="text-right px-5 py-3 text-muted-foreground font-medium">Raised</th>
            <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden md:table-cell">Notes</th>
            <th className="px-5 py-3 w-px" />
          </tr>
        </thead>
        <tbody className="divide-y divide-wheat/10">
          {sales.map((sale) => {
            // ── Edit row ────────────────────────────────────────────────────
            if (editId === sale.id) {
              return (
                <tr key={sale.id} className="bg-cream/60">
                  <td className="px-3 py-2">
                    <Input type="date" value={editValues.sold_at}
                      onChange={e => setEditValues(v => ({ ...v, sold_at: e.target.value }))}
                      className="h-8 text-xs w-36" />
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" min={1} value={editValues.loaves_count}
                      onChange={e => setEditValues(v => ({ ...v, loaves_count: +e.target.value }))}
                      className="h-8 text-xs w-16 ml-auto" />
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" step="0.01" min={0} value={editValues.amount_raised}
                      onChange={e => setEditValues(v => ({ ...v, amount_raised: +e.target.value }))}
                      className="h-8 text-xs w-20 ml-auto" />
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    <Input value={editValues.notes}
                      onChange={e => setEditValues(v => ({ ...v, notes: e.target.value }))}
                      className="h-8 text-xs" placeholder="Notes…" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => saveEdit(sale.id)} className="p-1.5 rounded-lg bg-wheat text-white hover:bg-wheat-dark transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-muted hover:bg-muted/70 transition-colors">
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }

            // ── Delete confirm row ───────────────────────────────────────────
            if (deleteId === sale.id) {
              return (
                <tr key={sale.id} className="bg-red-50/60">
                  <td colSpan={5} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground">
                        Delete {sale.loaves_count} loaves · {formatCurrency(Number(sale.amount_raised))} on {formatDate(sale.sold_at)}? This reverses your stats.
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => deleteSale(sale.id)} className="text-sm font-medium text-red-600 hover:underline">
                          Delete
                        </button>
                        <button onClick={() => setDeleteId(null)} className="text-sm text-muted-foreground hover:underline">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }

            // ── Normal row ───────────────────────────────────────────────────
            return (
              <tr key={sale.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-5 py-3 text-foreground">{formatDate(sale.sold_at)}</td>
                <td className="px-5 py-3 text-right font-medium">{sale.loaves_count}</td>
                <td className="px-5 py-3 text-right font-medium text-wheat">{formatCurrency(Number(sale.amount_raised))}</td>
                <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{sale.notes || "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-0.5 justify-end">
                    {shareId === sale.id ? (
                      <>
                        <button onClick={() => handleShareX(sale)} title="Share on X" className="p-1.5 rounded-lg hover:bg-wheat/10 text-muted-foreground hover:text-wheat transition-colors">
                          <Twitter className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleShareInstagram(sale)} title="Copy for Instagram" className="p-1.5 rounded-lg hover:bg-wheat/10 text-muted-foreground hover:text-wheat transition-colors">
                          <Instagram className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleShareSubstack(sale)} title="Copy for Substack" className="p-1.5 rounded-lg hover:bg-wheat/10 text-muted-foreground hover:text-wheat transition-colors text-xs font-bold leading-none">
                          S
                        </button>
                        <button onClick={() => setShareId(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors ml-1">
                          <XIcon className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setShareId(sale.id); setDeleteId(null); setEditId(null); }} title="Share" className="p-1.5 rounded-lg hover:bg-wheat/10 text-muted-foreground hover:text-wheat transition-colors">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => startEdit(sale)} title="Edit" className="p-1.5 rounded-lg hover:bg-wheat/10 text-muted-foreground hover:text-wheat transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setDeleteId(sale.id); setShareId(null); setEditId(null); }} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
