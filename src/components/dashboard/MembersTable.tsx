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
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MembersTableProps {
  members: Profile[];
  currentUserId: string;
}

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function MembersTable({ members, currentUserId }: MembersTableProps) {
  const [memberList, setMemberList] = useState<Profile[]>(members);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Profile | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [removing, setRemoving] = useState(false);

  const filtered = search.trim()
    ? memberList.filter(
        (m) =>
          m.full_name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : memberList;

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

  const handleRemove = async () => {
    if (!memberToRemove) return;
    setRemoving(true);
    try {
      const res = await fetch(`/api/members/${memberToRemove.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to remove member");
        return;
      }
      setMemberList((prev) => prev.filter((m) => m.id !== memberToRemove.id));
      toast.success(`${memberToRemove.full_name} has been removed from the church`);
      setMemberToRemove(null);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  if (memberList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-wheat/15 p-10 text-center">
        <span className="text-4xl block mb-3">🍞</span>
        <p className="text-muted-foreground">
          No bakers have joined your church yet. Share the link to /signup with your
          congregation!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search bakers…"
        className="max-w-xs bg-white"
      />

      <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream border-b border-wheat/20">
            <tr>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Baker</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden sm:table-cell">Role</th>
              <th className="text-right px-5 py-3 text-muted-foreground font-medium">Loaves</th>
              <th className="text-right px-5 py-3 text-muted-foreground font-medium">Raised</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wheat/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No results for &ldquo;{search}&rdquo;
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr key={member.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{member.full_name}</span>
                      {member.id === currentUserId && (
                        <span className="text-xs text-muted-foreground">(You)</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.email}
                      {member.created_at && (
                        <span className="ml-2 text-wheat/70">
                          · Joined {formatJoinDate(member.created_at)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {member.role === "church_admin" || member.role === "super_admin" ? (
                      <Badge className="bg-wheat/15 text-wheat border-0 hover:bg-wheat/15 text-xs font-medium">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs font-medium">
                        Baker
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {formatNumber(member.loaves_sold)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-wheat">
                    {formatCurrency(Number(member.money_raised))}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        className="text-muted-foreground hover:text-wheat"
                        title="Send message"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      {member.id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Remove from church"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
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
                placeholder="Write your message here…"
                className="mt-1.5 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedMember(null)}>
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

      {/* Remove confirmation dialog */}
      <Dialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif">Remove Baker</DialogTitle>
            <DialogDescription>
              Remove <strong>{memberToRemove?.full_name}</strong> from the church? They&rsquo;ll
              lose access to the dashboard until they join another church.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setMemberToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? "Removing…" : "Remove"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
