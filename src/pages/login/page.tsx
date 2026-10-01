import { useState, type FormEvent } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { api, messageForError } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { navigate } = useModal();
  const { saveSession } = useAuth();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const session = await api('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      saveSession(session);
      navigate(session.user.role === 'super_admin' ? '/super-admin/tableau-de-bord' : session.user.role === 'admin' ? '/proprietaire/tableau-de-bord' : '/');
    } catch (caught) { setError(messageForError(caught)); } finally { setLoading(false); }
  };
  return <main className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:pt-36"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,.2),_transparent_33%)]" /><div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl lg:grid-cols-5"><aside className="bg-slate-950 p-8 text-white lg:col-span-2"><p className="text-sm font-black uppercase tracking-[.24em] text-green-400">GrandH</p><h1 className="mt-5 text-4xl font-black">Bienvenue.</h1><p className="mt-5 text-sm leading-6 text-slate-300">Connectez-vous à votre espace client, hôtel ou administration.</p></aside><section className="p-7 sm:p-10 lg:col-span-3"><p className="text-sm font-bold uppercase tracking-widest text-orange-600">Espace personnel</p><h2 className="mt-2 text-3xl font-black">Se connecter</h2><form onSubmit={handleSubmit} className="mt-7 space-y-5"><label className="block text-sm font-bold text-slate-700">Adresse e-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-green-500" /></label><label className="block text-sm font-bold text-slate-700">Mot de passe<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-green-500" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-green-600 py-4 font-bold text-white disabled:opacity-60">{loading ? 'Connexion…' : 'Ouvrir ma session'}</button></form><p className="mt-7 text-center text-sm text-slate-500">Pas encore de compte ? <button onClick={() => navigate('/inscription')} className="font-bold text-green-700 hover:underline">Créer un compte</button></p><button onClick={() => navigate('/secret-administration')} className="mx-auto mt-5 block text-xs font-medium text-slate-400 hover:text-violet-700">Accès super-administrateur</button></section></div></main>;
}
