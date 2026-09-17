import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";

export default function Direct() {
  const { user, loading, isAuthenticated } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [, setLocation] = useLocation();
  const otherUserId = Number(userId);
  const [draft, setDraft] = useState("");
  const input = useMemo(() => ({ otherUserId }), [otherUserId]);
  const { data: other } = trpc.profile.user.useQuery({ userId: otherUserId }, { enabled: isAuthenticated && Number.isInteger(otherUserId) && otherUserId > 0 });
  const { data: messages = [], isLoading } = trpc.direct.messages.useQuery(input, { enabled: isAuthenticated && input.otherUserId > 0, refetchInterval: 1500 });
  const utils = trpc.useUtils();
  const send = trpc.direct.send.useMutation({ onSuccess: async () => { setDraft(""); await utils.direct.messages.invalidate(input); } });
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#090b10] text-slate-400"><Loader2 className="animate-spin" /></div>;
  if (!isAuthenticated || !user) return <main className="grid min-h-screen place-items-center bg-[#090b10] text-white"><button onClick={() => startLogin()} className="rounded-xl bg-violet-500 px-5 py-3 font-bold">Sign in</button></main>;
  const sendMessage = () => { if (draft.trim() && otherUserId > 0 && !send.isPending) send.mutate({ recipientId: otherUserId, content: draft.trim() }); };
  return <main className="flex min-h-screen flex-col bg-[#0d0f15] text-slate-200"><header className="flex items-center gap-4 border-b border-white/5 bg-[#151821] px-6 py-4"><button onClick={() => setLocation("/")} className="text-slate-500 hover:text-white"><ArrowLeft size={18} /></button><div className="grid h-9 w-9 place-items-center rounded-full bg-violet-400 font-bold text-slate-950">{(other?.name || other?.email || "M").slice(0, 1).toUpperCase()}</div><div><p className="font-bold text-white">{other?.name || other?.email || "Direct message"}</p><p className="text-xs text-emerald-400">Direct conversation</p></div></header><div className="flex-1 overflow-y-auto px-6 py-8"><div className="mx-auto max-w-3xl">{isLoading ? <div className="grid min-h-[300px] place-items-center text-slate-500"><Loader2 className="animate-spin" /></div> : messages.length === 0 ? <div className="flex min-h-[300px] flex-col items-center justify-center text-center"><MessageCircle className="text-violet-300" size={32} /><h2 className="mt-4 text-lg font-bold text-white">Start a private conversation</h2><p className="mt-2 text-sm text-slate-500">Messages here are visible only to you and {other?.name || "this member"}.</p></div> : <div className="space-y-5">{messages.map(message => <div key={message.id} className={`flex gap-3 ${message.senderId === user.id ? "justify-end" : ""}`}><div className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.senderId === user.id ? "bg-violet-500 text-white" : "bg-[#1a1d27] text-slate-200"}`}><p className="text-xs font-bold opacity-70">{message.senderName || "Member"}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p></div></div>)}<div ref={bottom} /></div>}</div></div><div className="border-t border-white/5 bg-[#151821] px-6 py-4"><div className="mx-auto flex max-w-3xl items-end gap-3 rounded-xl border border-white/10 bg-[#0d0f15] px-4 py-3"><textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={1} placeholder={`Message ${other?.name || "member"}`} className="max-h-32 flex-1 resize-none bg-transparent py-1 text-sm text-white outline-none placeholder:text-slate-600" /><button onClick={sendMessage} disabled={!draft.trim() || send.isPending} className="text-violet-300 disabled:opacity-30"><Send size={18} /></button></div></div></main>;
}
