import { useState } from 'react';
import { useModal } from '../context/ModalContext';

export default function SignUpPage() {
  const { navigate, showToast } = useModal();
  const [created, setCreated] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      prenom: prenom.trim() || 'Client',
      nom: nom.trim() || 'GrandH',
      email: email.trim(),
      telephone: telephone.trim() || '+225 07 00 00 00 00',
      role: 'client',
      statut: 'actif',
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'token-client-' + Date.now());

    showToast('Compte créé avec succès ! Bienvenue sur GrandH.', 'success');
    setCreated(true);

    // Redirection automatique vers le tableau de bord
    setTimeout(() => {
      navigate('/client/tableau-de-bord');
    }, 1200);
  };

  return (
    <main className="relative isolate min-h-[680px] overflow-hidden px-4 pb-16 pt-32 sm:pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,_rgba(249,115,22,.16),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(34,197,94,.18),_transparent_30%)]" />
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white p-7 shadow-2xl shadow-slate-300/50 sm:p-10">
        {created ? (
          <div className="py-12 text-center animate-fadeIn">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700 animate-bounce">✓</div>
            <h1 className="mt-5 text-3xl font-black text-slate-900">Bienvenue, {prenom || 'sur GrandH'} !</h1>
            <p className="mt-3 text-slate-600">Votre compte client a été créé avec succès.</p>
            <p className="mt-1 text-xs text-green-600 font-semibold">Redirection vers votre tableau de bord client en cours...</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/client/tableau-de-bord')}
                className="rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <span>Accéder à mon tableau de bord</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-xl border border-slate-200 px-5 py-3.5 font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Découvrir les hôtels
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">GrandH</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Créer votre compte</h1>
            <p className="mt-2 text-sm text-slate-500">Quelques informations suffisent pour commencer et accéder à votre espace.</p>
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">
                Prénom
                <input
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Ex: Emmanuel"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:ring-4 focus:ring-green-100"
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Nom
                <input
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Amussou"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:ring-4 focus:ring-green-100"
                />
              </label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                Adresse e-mail
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:ring-4 focus:ring-green-100"
                  placeholder="vous@exemple.com"
                />
              </label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                Numéro de téléphone (Mobile Money)
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:ring-4 focus:ring-green-100"
                  placeholder="+225 07 00 00 00 00"
                />
              </label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                Mot de passe
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:ring-4 focus:ring-green-100"
                  placeholder="6 caractères minimum"
                />
              </label>
              <label className="flex gap-2 text-sm text-slate-500 sm:col-span-2">
                <input required type="checkbox" defaultChecked className="mt-1 accent-green-600 rounded" />
                J'accepte les conditions d'utilisation et la politique de confidentialité.
              </label>
              <button
                type="submit"
                className="rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700 sm:col-span-2"
              >
                Créer mon compte & Ouvrir mon espace
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">
              Déjà inscrit ?{' '}
              <button onClick={() => navigate('/connexion')} className="font-bold text-green-700 hover:underline">
                Se connecter
              </button>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
