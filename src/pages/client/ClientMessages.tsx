import { useState, useRef, useEffect, useMemo } from "react";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import {
  useClientMessages,
  useMessageReplies,
  useReplyMutation,
  useComposeMessage,
  useRealtimeReplies,
  useMarkAsRead,
  type ContactMessage,
} from "@/features/client/hooks/useClientMessages";
import { cn } from "@/shared/utils/utils";
import { Card, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { FormDialog } from "@/shared/components/common/FormDialog";
import {
  MessageSquare, Search, Plus, Send, Inbox,
  Mail, Clock, ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Baru", variant: "default" },
  replied: { label: "Dibalas", variant: "secondary" },
  closed: { label: "Ditutup", variant: "outline" },
};

function statusBadge(status: string | null) {
  const s = STATUS_MAP[status || "new"] || STATUS_MAP.new;
  return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>;
}

export default function ClientMessages() {
  const { data: messages = [], isLoading } = useClientMessages();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "replied" | "closed">("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const [mobileShowConvo, setMobileShowConvo] = useState(false);

  const filtered = useMemo(() => {
    let result = messages;
    if (filter !== "all") result = result.filter((m) => (m.status || "new") === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q));
    }
    return result;
  }, [messages, filter, search]);

  const selectedMessage = messages.find((m) => m.id === selectedId) || null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileShowConvo(true);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Hero */}
        <RevealCard>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">Pesan</h1>
                  <p className="text-sm text-muted-foreground">Komunikasi langsung dengan tim kami</p>
                </div>
              </div>
              <Button onClick={() => setComposeOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Pesan Baru
              </Button>
            </div>
          </div>
        </RevealCard>

        {/* Stat Cards */}
        <RevealCard delay={50}>
          <div className="grid grid-cols-3 gap-3" role="group" aria-label="Ringkasan pesan">
            {[
              { label: "Total", count: messages.length, icon: Mail },
              { label: "Baru", count: messages.filter((m) => (m.status || "new") === "new").length, icon: Inbox },
              { label: "Belum Dibaca", count: messages.filter((m) => m.unread_count > 0).length, icon: MessageSquare },
            ].map((s) => (
              <Card key={s.label} className="p-4">
                <div className="flex items-center gap-3" aria-label={`${s.label}: ${s.count}`}>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{s.count}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RevealCard>

        {/* Main Content */}
        <RevealCard delay={100}>
          <div className="grid lg:grid-cols-5 gap-4 min-h-[500px]">
            {/* Inbox List */}
            <Card className={cn("lg:col-span-2 flex flex-col", mobileShowConvo && "hidden lg:flex")}>
              <CardHeader className="pb-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Cari pesan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" aria-label="Cari pesan" />
                </div>
                <div className="flex gap-1" role="tablist" aria-label="Filter pesan">
                  {(["all", "new", "replied", "closed"] as const).map((f) => (
                    <Button key={f} role="tab" aria-selected={filter === f} variant={filter === f ? "default" : "ghost"} size="sm" className="text-xs h-7 px-2.5" onClick={() => setFilter(f)}>
                      {f === "all" ? "Semua" : STATUS_MAP[f]?.label || f}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <ScrollArea className="flex-1">
                <div className="px-3 pb-3 space-y-1">
                  {isLoading ? (
                    <div className="text-center py-10 text-sm text-muted-foreground">Memuat...</div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                      <p className="text-sm text-muted-foreground">Belum ada pesan</p>
                      <Button variant="outline" size="sm" onClick={() => setComposeOpen(true)}>
                        <Plus className="w-3 h-3 mr-1" /> Kirim Pesan Baru
                      </Button>
                    </div>
                  ) : (
                    filtered.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => handleSelect(msg.id)}
                        className={cn(
                          "w-full text-left rounded-lg p-3 transition-colors hover:bg-muted/50 border",
                          selectedId === msg.id ? "border-primary bg-primary/5" : "border-transparent"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {msg.unread_count > 0 && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                              <p className="text-sm font-medium text-foreground truncate">{msg.subject}</p>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{msg.message}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {statusBadge(msg.status)}
                            <span className="text-[10px] text-muted-foreground">
                              {msg.created_at ? format(new Date(msg.created_at), "dd MMM", { locale: idLocale }) : ""}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Conversation Panel */}
            <Card className={cn("lg:col-span-3 flex flex-col", !mobileShowConvo && "hidden lg:flex")}>
              {selectedMessage ? (
                <ConversationPanel message={selectedMessage} onBack={() => setMobileShowConvo(false)} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">Pilih pesan untuk melihat percakapan</p>
                </div>
              )}
            </Card>
          </div>
        </RevealCard>

        <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
      </div>
    </ClientLayout>
  );
}

function ConversationPanel({ message, onBack }: { message: ContactMessage; onBack: () => void }) {
  const { data: replies = [] } = useMessageReplies(message.id);
  const replyMutation = useReplyMutation();
  const markAsRead = useMarkAsRead();
  const markAsReadRef = useRef(markAsRead);
  markAsReadRef.current = markAsRead;
  const [replyText, setReplyText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useRealtimeReplies(message.id);

  // Mark as read on mount - using ref to avoid dependency issues
  useEffect(() => {
    if (message.unread_count > 0) markAsReadRef.current.mutate(message.id);
  }, [message.id, message.unread_count]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies.length]);

  const handleSend = () => {
    const body = replyText.trim();
    if (!body) return;
    replyMutation.mutate({ messageId: message.id, body }, {
      onSuccess: () => setReplyText(""),
      onError: () => toast.error("Gagal mengirim balasan"),
    });
  };

  return (
    <>
      <div className="border-b border-border p-4 space-y-2">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="lg:hidden p-1 hover:bg-muted rounded-md" aria-label="Kembali ke daftar pesan">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{message.subject}</h3>
            <div className="flex items-center gap-2 mt-1">
              {statusBadge(message.status)}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {message.created_at ? format(new Date(message.created_at), "dd MMM yyyy, HH:mm", { locale: idLocale }) : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground p-3">
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              <p className="text-[10px] opacity-70 mt-1 text-right">
                {message.created_at ? format(new Date(message.created_at), "dd MMM, HH:mm", { locale: idLocale }) : ""}
              </p>
            </div>
          </div>

          {replies.map((r) => {
            const isClient = r.sender_type === "client";
            return (
              <div key={r.id} className={cn("flex", isClient ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-2xl p-3", isClient ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm")}>
                  {!isClient && <p className="text-[10px] font-semibold mb-1 opacity-70">Admin</p>}
                  <p className="text-sm whitespace-pre-wrap">{r.body}</p>
                  <p className={cn("text-[10px] mt-1 text-right", isClient ? "opacity-70" : "text-muted-foreground")}>
                    {format(new Date(r.created_at), "dd MMM, HH:mm", { locale: idLocale })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Textarea
            placeholder="Tulis balasan..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
            aria-label="Tulis balasan"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button size="icon" onClick={handleSend} disabled={!replyText.trim() || replyMutation.isPending} className="shrink-0 self-end" aria-label="Kirim balasan">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function ComposeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const compose = useComposeMessage();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) { toast.error("Subjek dan pesan harus diisi"); return; }
    compose.mutate({ subject: subject.trim(), message: message.trim() }, {
      onSuccess: () => { toast.success("Pesan berhasil dikirim!"); setSubject(""); setMessage(""); onOpenChange(false); },
      onError: () => toast.error("Gagal mengirim pesan"),
    });
  };

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="Pesan Baru" description="Kirim pesan baru ke tim kami">
      <div className="space-y-4 pt-2">
        <div className="space-y-2"><Label>Subjek</Label><Input placeholder="Topik pesan Anda" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
        <div className="space-y-2"><Label>Pesan</Label><Textarea placeholder="Tulis pesan Anda..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} /></div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSend} disabled={compose.isPending}>{compose.isPending ? "Mengirim..." : <><Send className="w-4 h-4 mr-1" /> Kirim</>}</Button>
        </div>
      </div>
    </FormDialog>
  );
}
