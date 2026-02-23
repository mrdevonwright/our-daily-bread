"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { Mail } from "lucide-react";
import { toast } from "sonner";

interface MembersTableProps {
  members: Profile[];
}

export function MembersTable({ members }: MembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedMember || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedMember.email,
          to_name: selectedMember.full_name,
          subject: subject || "Message from your church admin",
          message,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success(`Message sent to ${selectedMember.full_name}`);
      setSelectedMember(null);
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-wheat/15 p-10 text-center">
        <span className="text-4xl block mb-3">🍞</span>
        <p className="text-muted-foreground">
          No bakers have joined your church yet. Share the link to
          /signup/baker with your congregation!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream border-b border-wheat/20">
            <tr>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Baker</th>
              <th className="text-right px-5 py-3 text-muted-foreground font-medium">Loaves</th>
              <th className="text-right px-5 py-3 text-muted-foreground font-medium">Raised</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wheat/10">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-foreground">{member.full_name}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </td>
                <td className="px-5 py-3 text-right font-medium">
                  {formatNumber(member.loaves_sold)}
                </td>
                <td className="px-5 py-3 text-right font-medium text-wheat">
                  {formatCurrency(Number(member.money_raised))}
                </td>
                <td className="px-5 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMember(member)}
                    className="text-muted-foreground hover:text-wheat"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif">
              Message {selectedMember?.full_name}
            </DialogTitle>
            <DialogDescription>
              This will be sent to {selectedMember?.email} via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="msg-subject">Subject</Label>
              <Input
                id="msg-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message from your church admin"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="msg-body">Message</Label>
              <Textarea
                id="msg-body"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your message here..."
                className="mt-1.5 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedMember(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                className="bg-wheat hover:bg-wheat-dark text-white"
              >
                {sending ? "Sending…" : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
