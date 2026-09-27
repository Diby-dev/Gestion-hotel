import { useState, type FormEvent } from 'react';
import { useModal } from '../../context/ModalContext';

export default function LoginPage() {
  const [accountType, setAccountType] = useState<'client' | 'pro'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { navigate } = useModal();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (accountType === 'pro') {
      navigate('/proprietaire/tableau-de-bord');
    } else {
      setSubmitted(true);
    }
  };

  return (
    <main className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,.2),_transparent_33%),radial-gradient(circle_at_90%_20%,_rgba(249,115,22,.16),_transparent_25%)]" />
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-slate-300/50 lg:grid-cols-5">
        <aside className="relative overflow-hidden bg-slate-950 p-8 text-white lg:col-span-2 lg:p-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-500/20 blur-2xl" />
          <p className="relative text-sm font-black uppercase tracking-[.24em] text-green-400">GrandH</p>
          <h1 className="relative mt-5 text-4xl font-black leading-tight">
            Bienvenue
            <br />
            parmi nous.
          </h1>
          <p className="relative mt-5 max-w-xs text-sm leading-6 text-slate-300">
            Retrouvez vos réservations, vos informations et les offres adaptées à votre séjour.
          </p>
          <div className="relative mt-10 space-y-3 text-sm text-slate-200">
            <p className="flex gap-3">
              <span className="text-green-400">✓</span> Réservations centralisées
            </p>
            <p className="flex gap-3">
              <span className="text-green-400">✓</span> Paiement d'acompte sécurisé
            </p>
            <p className="flex gap-3">
              <span className="text-green-400">✓</span> Assistance à tout moment
            </p>
          </div>
        </aside>

        <section className="p-7 sm:p-10 lg:col-span-3">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
                ✓
              </div>
              <h2 className="mt-6 text-2xl font-black">Connexion réussie</h2>
              <p className="mt-2 text-slate-500">Heureux de vous revoir, {email}.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-8 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
              >
                Découvrir les hôtels
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Espace personnel</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Se connecter</h2>
              <p className="mt-2 text-sm text-slate-500">Saisissez vos informations pour continuer.</p>
              <div className="mt-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">
                {(
                  [
                    ['client', 'Client'],
                    ['pro', 'Propriétaire'],
                  ] as const
                ).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                      accountType === type
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <label className="block text-sm font-bold text-slate-700">
                  Adresse e-mail
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    placeholder="vous@exemple.com"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  Mot de passe
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    placeholder="Votre mot de passe"
                  />
                </label>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-500">
                    <input type="checkbox" className="accent-green-600" /> Se souvenir de moi
                  </label>
                  <button type="button" className="font-bold text-green-700 hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
                <button className="w-full rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/25 transition hover:-translate-y-0.5 hover:bg-green-700">
                  {accountType === 'pro' ? 'Accéder à mon tableau de bord' : 'Ouvrir ma session'}
                </button>
              </form>
              <p className="mt-7 text-center text-sm text-slate-500">
                Pas encore de compte ?{' '}
                <button onClick={() => navigate('/inscription')} className="font-bold text-green-700 hover:underline">
                  Créer un compte
                </button>
              </p>
              <button
                onClick={() => navigate('/secret-administration')}
                className="mx-auto mt-5 block text-xs font-medium text-slate-400 transition hover:text-violet-700 hover:underline"
              >
                Accès super-administrateur
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
