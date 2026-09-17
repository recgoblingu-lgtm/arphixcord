import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Check, Loader2, MessageCircle, ShieldAlert } from "lucide-react";
import { useLocation, useParams } from "wouter";

export default function Invite() {
  const { code } = useParams<{ code: string }>();
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const joinInvite = trpc.community.joinInvite.useMutation({ onSuccess: () => setLocation("/") });

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#090b10] text-slate-400"><Loader2 className="animate-spin" /></div>;
  if (!isAuthenticated || !user) return <main className="grid min-h-screen place-items-center bg-[#090b10] px-6 text-white"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151821] p-8 text-center shadow-2xl"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500"><MessageCircle size={26} /></div><h1 className="mt-6 text-2xl font-bold">You have been invited</h1><p className="mt-2 text-sm leading-6 text-slate-400">Sign in to ArphixCord to join this community.</p><button onClick={() => startLogin()} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-bold hover:bg-violet-400">Sign in to join <ArrowRight size={16} /></button></div></main>;
  return <main className="grid min-h-screen place-items-center bg-[#090b10] px-6 text-white"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151821] p-8 text-center shadow-2xl"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-slate-950"><Check size={28} /></div><h1 className="mt-6 text-2xl font-bold">Join this ArphixCord server</h1><p className="mt-2 text-sm leading-6 text-slate-400">You are signed in as <span className="font-semibold text-slate-200">{user.name || user.email}</span>.</p>{joinInvite.error ? <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"><ShieldAlert size={16} /> {joinInvite.error.message}</div> : null}<button onClick={() => code && joinInvite.mutate({ code })} disabled={!code || joinInvite.isPending} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-bold hover:bg-violet-400 disabled:opacity-50">{joinInvite.isPending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />} Join server</button></div></main>;
}
