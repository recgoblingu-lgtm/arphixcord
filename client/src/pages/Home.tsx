import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Bell,
  Clipboard,
  Paperclip,
  ChevronDown,
  Hash,
  Headphones,
  HelpCircle,
  LogOut,
  MessageCircle,
  Mic,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  SmilePlus,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const accentAvatars = ["#a78bfa", "#34d399", "#fbbf24", "#60a5fa", "#fb7185"];

function initials(name?: string | null) {
  return (name || "Member").split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function LoginScreen() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#090b10] text-white">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(139,92,246,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[140px]" />
      <section className="relative mx-auto flex w-full max-w-6xl flex-col justify-between px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500 font-black shadow-lg shadow-violet-500/25">A</div><span className="text-lg font-bold tracking-tight">ArphixCord</span></div>
          <div className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs text-slate-400">Private beta · built for your communities</div>
        </header>
        <div className="grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[.22em] text-violet-300"><Sparkles size={16} /> Your space. Your people.</p>
            <h1 className="text-5xl font-black leading-[1.02] tracking-[-.05em] text-white sm:text-7xl">Make room for <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">better conversations.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">ArphixCord is a focused, community-first chat workspace with the familiar rhythm of Discord and a cleaner home for the way your group actually works.</p>
            <button onClick={() => startLogin()} className="mt-9 inline-flex items-center gap-3 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 hover:bg-violet-400 active:scale-[.98]"><MessageCircle size={18} /> Continue with Manus</button>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500"><span className="flex items-center gap-2"><Shield size={14} className="text-emerald-400" /> Secure sign-in</span><span className="flex items-center gap-2"><Users size={14} className="text-cyan-400" /> Invite-only ready</span><span className="flex items-center gap-2"><WandSparkles size={14} className="text-fuchsia-400" /> Built to extend</span></div>
          </div>
          <div className="relative rounded-3xl border border-white/10 bg-[#11141d]/90 p-3 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
            <div className="flex h-8 items-center gap-1.5 border-b border-white/5 px-3"><span className="h-2 w-2 rounded-full bg-rose-400/70" /><span className="h-2 w-2 rounded-full bg-amber-300/70" /><span className="h-2 w-2 rounded-full bg-emerald-400/70" /><span className="ml-3 text-[10px] text-slate-600">arphixcord / lounge</span></div>
            <div className="grid min-h-[360px] grid-cols-[54px_148px_1fr] overflow-hidden rounded-b-2xl bg-[#0e1118]">
              <div className="space-y-3 bg-[#0b0d13] p-2"><div className="grid h-10 place-items-center rounded-xl bg-violet-500 font-bold">A</div><div className="grid h-10 place-items-center rounded-xl bg-slate-800 text-xs text-slate-400">N</div><div className="grid h-10 place-items-center rounded-xl border border-dashed border-slate-700 text-slate-600">+</div></div>
              <div className="border-r border-white/5 bg-[#131620] p-3"><div className="mb-5 flex items-center justify-between text-xs font-bold text-slate-300">Arphix Lounge <ChevronDown size={13} /></div><p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">Text channels</p><div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-2 text-xs text-slate-200"><Hash size={14} className="text-slate-500" /> general</div><div className="mt-1 flex items-center gap-2 px-2 py-2 text-xs text-slate-500"><Hash size={14} /> ideas</div></div>
              <div className="flex flex-col"><div className="flex items-center gap-2 border-b border-white/5 px-4 py-3 text-xs font-semibold text-slate-200"><Hash size={15} className="text-slate-500" /> general <span className="ml-auto text-slate-600">⋯</span></div><div className="flex-1 space-y-4 p-4"><div className="flex gap-2"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-400/80 text-[10px] font-bold text-slate-900">J</div><div><p className="text-[10px] font-bold text-cyan-300">Jordan <span className="ml-1 font-normal text-slate-600">Today at 9:14 AM</span></p><p className="mt-1 text-xs text-slate-400">Welcome to the new space.</p></div></div><div className="flex gap-2"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-400/80 text-[10px] font-bold text-slate-900">A</div><div><p className="text-[10px] font-bold text-violet-300">Aria <span className="ml-1 font-normal text-slate-600">Today at 9:16 AM</span></p><p className="mt-1 text-xs text-slate-400">Let’s make it ours.</p></div></div></div><div className="m-3 rounded-lg border border-white/5 bg-white/[.03] px-3 py-2 text-[10px] text-slate-600">Message #general</div></div>
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-600"><span>ArphixCord · an independent community platform</span><span>More features are on the way</span></footer>
      </section>
    </main>
  );
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { data: serverData, isLoading: serversLoading } = trpc.community.listServers.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentPreview, setAttachmentPreview] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const messageInput = useMemo(() => ({ channelId: selectedChannelId ?? 0 }), [selectedChannelId]);
  const { data: messages = [], isLoading: messagesLoading } = trpc.community.messages.useQuery(messageInput, { enabled: isAuthenticated && Boolean(selectedChannelId), refetchInterval: 1500 });
  const createServer = trpc.community.createServer.useMutation({ onSuccess: async () => { await utils.community.listServers.invalidate(); } });
  const createChannel = trpc.community.createChannel.useMutation({ onSuccess: async () => { await utils.community.listServers.invalidate(); } });
  const sendMessage = trpc.community.sendMessage.useMutation({ onSuccess: async () => { setDraft(""); await utils.community.messages.invalidate(messageInput); } });
  const sendAttachment = trpc.community.sendAttachment.useMutation({ onSuccess: async () => { setDraft(""); setAttachmentName(""); setAttachmentPreview(""); setUploadPercent(0); if (attachmentRef.current) attachmentRef.current.value = ""; await utils.community.messages.invalidate(messageInput); } });
  const createInvite = trpc.community.createInvite.useMutation({ onSuccess: async ({ code }) => { const invite = `${window.location.origin}/invite/${code}`; await navigator.clipboard?.writeText(invite); window.alert(`Invite copied:\n${invite}`); } });
  const toggleReaction = trpc.community.toggleReaction.useMutation({ onSuccess: async () => { await utils.community.messages.invalidate(messageInput); } });
  const deleteMessage = trpc.community.deleteMessage.useMutation({ onSuccess: async () => { await utils.community.messages.invalidate(messageInput); } });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const servers = serverData ?? [];
  const selectedServer = servers.find(server => server.id === selectedServerId) ?? servers[0];
  const selectedChannel = selectedServer?.channels.find(channel => channel.id === selectedChannelId) ?? selectedServer?.channels[0];
  const { data: members = [] } = trpc.community.members.useQuery({ serverId: selectedServer?.id ?? 0 }, { enabled: isAuthenticated && Boolean(selectedServer?.id) });
  const { data: notifications = [] } = trpc.notifications.list.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 3000 });
  const markAllRead = trpc.notifications.markAllRead.useMutation({ onSuccess: async () => { await utils.notifications.list.invalidate(); } });

  useEffect(() => {
    if (!selectedServer && servers[0]) setSelectedServerId(servers[0].id);
    if (selectedServer && selectedServer.channels[0] && !selectedServer.channels.some(channel => channel.id === selectedChannelId)) setSelectedChannelId(selectedServer.channels[0].id);
  }, [selectedServer, servers, selectedChannelId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length, selectedChannelId]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#090b10] text-slate-400"><div className="flex items-center gap-3 text-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />Warming up your space…</div></div>;
  if (!isAuthenticated || !user) return <LoginScreen />;

  const handleCreateServer = () => { const name = window.prompt("Name your new server"); if (name?.trim()) createServer.mutate({ name: name.trim() }); };
  const handleCreateChannel = () => { if (!selectedServer) return; const name = window.prompt("Name your new channel"); if (name?.trim()) createChannel.mutate({ serverId: selectedServer.id, name: name.trim() }); };
  const handleSend = () => { if (selectedChannel && draft.trim() && !sendMessage.isPending) sendMessage.mutate({ channelId: selectedChannel.id, content: draft.trim() }); };
  const handleInvite = () => { if (selectedServer && !createInvite.isPending) createInvite.mutate({ serverId: selectedServer.id }); };
  const handleAttachment = (file?: File) => { if (!selectedChannel || !file) return; if (file.size > 8_000_000) { window.alert("Files must be 8 MB or smaller."); return; } setAttachmentName(file.name); setAttachmentPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : ""); setUploadPercent(0); const reader = new FileReader(); reader.onprogress = event => { if (event.lengthComputable) setUploadPercent(Math.round((event.loaded / event.total) * 100)); }; reader.onload = () => { const dataUrl = String(reader.result); sendAttachment.mutate({ channelId: selectedChannel.id, content: draft.trim(), attachment: { dataUrl, fileName: file.name, contentType: file.type || "application/octet-stream", size: file.size } }); }; reader.readAsDataURL(file); };

  return (
    <div onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); handleAttachment(event.dataTransfer.files?.[0]); }} className="flex h-screen min-h-[620px] max-md:min-h-[100dvh] max-md:flex-col overflow-hidden bg-[#0d0f15] text-slate-200">
      <aside className="flex w-[72px] shrink-0 flex-col max-md:hidden items-center gap-3 bg-[#090b10] py-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500 font-black text-white shadow-lg shadow-violet-500/20">A</div>
        <div className="h-px w-8 bg-white/10" />
        {serversLoading ? <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/5" /> : servers.map(server => <button key={server.id} title={server.name} onClick={() => { setSelectedServerId(server.id); setSelectedChannelId(server.channels[0]?.id ?? null); }} className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold transition-all ${server.id === selectedServer?.id ? "rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/25" : "bg-[#191d28] text-slate-400 hover:rounded-xl hover:bg-violet-500/20 hover:text-violet-200"}`}>{server.icon}</button>)}
        <button onClick={handleCreateServer} title="Add a server" className="grid h-11 w-11 place-items-center rounded-2xl border border-dashed border-slate-700 text-emerald-400 transition hover:rounded-xl hover:border-emerald-400 hover:bg-emerald-400/10"><Plus size={19} /></button>
        <div className="mt-auto grid h-11 w-11 place-items-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">{initials(user.name)}</div>
      </aside>

      <aside className="flex w-[250px] shrink-0 flex-col max-md:hidden border-r border-white/5 bg-[#151821]">
        <button className="flex h-[62px] items-center justify-between border-b border-white/5 px-5 text-left hover:bg-white/[.02]"><span className="truncate text-sm font-bold text-white">{selectedServer?.name ?? "Your workspace"}</span><ChevronDown size={16} className="text-slate-500" /></button>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 flex items-center justify-between px-2"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Channels</p><button onClick={handleCreateChannel} title="Create channel" className="text-slate-500 hover:text-white"><Plus size={15} /></button></div>
          <div className="space-y-1">{selectedServer?.channels.map(channel => <button key={channel.id} onClick={() => setSelectedChannelId(channel.id)} className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${channel.id === selectedChannel?.id ? "bg-white/[.08] font-semibold text-white" : "text-slate-500 hover:bg-white/[.04] hover:text-slate-300"}`}><Hash size={17} className={channel.id === selectedChannel?.id ? "text-slate-300" : "text-slate-600"} />{channel.name}<span className="ml-auto hidden text-slate-600 group-hover:block">⋯</span></button>)}</div>
          <div className="mb-3 mt-8 flex items-center justify-between px-2"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Voice channels</p><Plus size={15} className="text-slate-600" /></div>
          <button onClick={() => selectedServer && selectedChannel && (window.location.href = `/voice/${selectedServer.id}/${selectedChannel.id}`)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-400 hover:text-white"><Volume2 size={16} /> Huddle <span className="ml-auto rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] text-emerald-300">JOIN</span></button>
        </div>
        <div className="flex items-center gap-2 border-t border-white/5 bg-[#10121a] px-3 py-3"><button onClick={() => { window.location.href = "/profile"; }} className="relative grid h-8 w-8 place-items-center rounded-full bg-violet-400 text-[10px] font-black text-slate-900">{initials(user.name)}</button><button onClick={() => { window.location.href = "/profile"; }} className="min-w-0 flex-1 text-left"><p className="truncate text-xs font-semibold text-white">{user.name || "Member"}</p><p className="text-[10px] text-emerald-400">● online</p></button><button onClick={() => logout()} title="Log out" className="text-slate-500 hover:text-white"><LogOut size={15} /></button></div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-[#1a1d27] max-md:min-h-0">
        <header className="flex h-[62px] shrink-0 items-center gap-3 border-b border-white/5 px-6"><Hash size={20} className="text-slate-500" /><h2 className="text-sm font-bold text-white">{selectedChannel?.name ?? "general"}</h2><div className="hidden h-5 w-px bg-white/10 sm:block" /><p className="hidden truncate text-xs text-slate-500 sm:block">A friendly place to start the conversation.</p><div className="ml-auto flex items-center gap-4 text-slate-500"><button title="Create invite" onClick={handleInvite} className="hover:text-white"><UserPlus size={18} /></button><button title="Notifications" onClick={() => { const unread = notifications.filter(notification => !notification.readAt); window.alert(unread.length ? unread.map(notification => `${notification.title}\n${notification.body}`).join("\n\n") : "No new notifications."); if (unread.length) markAllRead.mutate(); }} className="relative hover:text-white"><Bell size={18} />{notifications.some(notification => !notification.readAt) && <span className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-rose-400" />}</button><button title="Pinned messages" className="hover:text-white"><Shield size={17} /></button><button title="Search" className="hidden hover:text-white sm:block"><Search size={18} /></button><button title="Help" className="hidden hover:text-white md:block"><HelpCircle size={18} /></button></div></header>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-7"><div className="mx-auto max-w-4xl">{messagesLoading ? <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-slate-500">Loading messages…</div> : messages.length === 0 ? <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-violet-500/10 text-violet-300"><MessageCircle size={30} /></div><h3 className="text-lg font-bold text-white">Welcome to #{selectedChannel?.name ?? "general"}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">This is the beginning of the channel. Send the first message and make it yours.</p></div> : <div className="space-y-6">{messages.map((message, index) => <div key={message.id} className="group flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-black text-slate-900" style={{ backgroundColor: accentAvatars[index % accentAvatars.length] }}>{initials(message.authorName || message.authorEmail)}</div><div className="min-w-0 flex-1"><div className="flex items-baseline gap-2"><span className="text-sm font-bold text-white">{message.authorName || message.authorEmail || "Member"}</span><span className="text-[10px] text-slate-600">{formatTime(message.createdAt)}</span><div className="ml-auto hidden items-center gap-2 text-slate-600 group-hover:flex"><button title="React" onClick={() => toggleReaction.mutate({ messageId: message.id, emoji: "👍" })} className="hover:text-violet-300"><SmilePlus size={14} /></button>{selectedServer && <button title="Delete message" onClick={() => deleteMessage.mutate({ messageId: message.id, serverId: selectedServer.id })} className="hover:text-rose-300"><Trash2 size={14} /></button>}</div></div><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{message.content}</p>{message.attachmentUrl && <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-violet-200 hover:bg-white/[.08]"><Paperclip size={13} /> <span className="truncate">{message.attachmentName || "Open attachment"}</span></a>}{message.reactions.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{Object.entries(message.reactions.reduce<Record<string, number>>((counts, reaction) => { counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1; return counts; }, {})).map(([emoji, count]) => <button key={emoji} onClick={() => toggleReaction.mutate({ messageId: message.id, emoji })} className="rounded-md border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-xs text-violet-200 hover:bg-violet-400/20">{emoji} {count}</button>)}</div>}</div></div>)}<div ref={messagesEndRef} /></div>}</div></div>
        <div className="px-4 pb-5 pt-2 sm:px-7">{attachmentName && <div className="mx-auto mb-2 flex max-w-4xl items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-400/5 px-3 py-2 text-xs text-violet-200">{attachmentPreview && <img src={attachmentPreview} alt="Attachment preview" className="h-10 w-10 rounded object-cover" />}<span className="min-w-0 flex-1 truncate">{attachmentName}</span><span>{uploadPercent}%</span></div>}<div className="mx-auto flex max-w-4xl items-end gap-3 rounded-xl border border-white/5 bg-[#11141c] px-4 py-3 shadow-lg shadow-black/10"><input ref={attachmentRef} type="file" className="hidden" onChange={event => handleAttachment(event.target.files?.[0])} /><button title="Add attachment" onClick={() => attachmentRef.current?.click()} className="mb-1 grid h-7 w-7 place-items-center rounded-full bg-slate-700 text-slate-300 transition hover:bg-violet-500"><Paperclip size={16} /></button><textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }} rows={1} placeholder={`Message #${selectedChannel?.name ?? "general"}`} className="max-h-32 min-h-7 flex-1 resize-none bg-transparent py-1 text-sm text-white outline-none placeholder:text-slate-600" /><button onClick={handleSend} disabled={!draft.trim() || sendMessage.isPending} title="Send message" className="mb-1 text-violet-400 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-30"><Send size={18} /></button></div><p className="mx-auto mt-2 max-w-4xl text-[10px] text-slate-600">Press Enter to send · Shift + Enter for a new line</p></div>
      </main>

      <aside className="hidden w-[230px] shrink-0 max-md:hidden border-l border-white/5 bg-[#151821] px-4 py-5 xl:block"><div className="mb-7 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Members — {members.length}</p><button onClick={() => { window.location.href = "/profile"; }} title="Edit profile"><Settings size={16} className="text-slate-600 hover:text-white" /></button></div><p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Online — {members.length}</p><div className="space-y-1">{members.map(member => <a href={`/dm/${member.userId}`} key={member.userId} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[.04]"><div className="relative grid h-8 w-8 place-items-center rounded-full bg-violet-400 text-[10px] font-black text-slate-900">{initials(member.name || member.email)}</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-300">{member.name || member.email || "Member"}</p><p className="text-[10px] text-emerald-400">{member.role} · DM</p></div></a>)}</div><div className="mt-8 rounded-xl border border-violet-500/10 bg-violet-500/[.06] p-4"><WandSparkles size={17} className="text-violet-300" /><p className="mt-3 text-xs font-semibold text-slate-300">Realtime workspace</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Messages refresh live. DMs, profiles, and Huddle are ready.</p></div></aside>
    </div>
  );
}
