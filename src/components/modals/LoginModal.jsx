import { useState } from 'react';
import { useModal } from '../../context/ModalContext';

export default function LoginModal() {
  const { loginModal, closeLogin, showToast } = useModal();
  const [tab, setTab] = useState('suivi'); // 'suivi' or 'connexion'
  const [trackingNumber, setTrackingNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!loginModal.isOpen) return null;

  const handleTrackingSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setTrackingResult({
        code: trackingNumber.toUpperCase() || 'ISMO-8492',
        device: 'Ordinateur portable HP Pavilion 15',
        owner: 'Client Ismo',
        step: 3, // 1: Dépôt, 2: Diagnostic, 3: Réparation en cours, 4: Prêt
        eta: 'Aujourd\'hui à 17h30',
        technician: 'Koffi A. (Tech Senior)',
      });
      showToast('Dossier de réparation localisé avec succès !');
    }, 700);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      showToast(`Bienvenue sur votre espace client Ismo !`);
    }, 800);
  };

  const handleClose = () => {
    setTrackingResult(null);
    setIsLoggedIn(false);
    closeLogin();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
              Espace Client & Suivi
            </span>
            <h3 className="text-xl font-bold text-white">
              {isLoggedIn ? 'Mon Compte Client' : 'Connexion / Suivi'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        {!isLoggedIn && (
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/30">
            <button
              onClick={() => { setTab('suivi'); setTrackingResult(null); }}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                tab === 'suivi'
                  ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              🔍 Suivre ma réparation
            </button>
            <button
              onClick={() => setTab('connexion')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                tab === 'connexion'
                  ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              🔐 Connexion Compte
            </button>
          </div>
        )}

        <div className="p-6 md:p-8">
          {isLoggedIn ? (
            <div className="flex flex-col gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto text-2xl font-bold">
                👤
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xl font-bold text-white">Bonjour et bienvenue !</h4>
                <p className="text-sm text-slate-400">
                  Connecté avec succès à votre tableau de bord Ismo Maintenance.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-left text-xs flex flex-col gap-2">
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Statut compte</span>
                  <span className="text-emerald-400 font-semibold">● Actif - Client Vérifié</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Historique appareils</span>
                  <span className="text-white">1 appareil en cours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Garantie active</span>
                  <span className="text-purple-400">Jusqu'au 20 Décembre 2026</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition-all"
              >
                Fermer l'espace client
              </button>
            </div>
          ) : tab === 'suivi' ? (
            <div className="flex flex-col gap-6">
              {trackingResult ? (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <p className="text-xs text-slate-400">Appareil</p>
                      <p className="text-sm font-bold text-white">{trackingResult.device}</p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {trackingResult.code}
                    </span>
                  </div>

                  {/* Étapes du suivi */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avancement en atelier</p>
                    <div className="relative pl-6 flex flex-col gap-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                      <div className="relative flex items-center gap-2">
                        <span className="absolute -left-6 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 text-slate-900 text-[10px] font-bold flex items-center justify-center">✓</span>
                        <span className="text-xs text-slate-300">Dépôt & Enregistrement</span>
                      </div>
                      <div className="relative flex items-center gap-2">
                        <span className="absolute -left-6 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 text-slate-900 text-[10px] font-bold flex items-center justify-center">✓</span>
                        <span className="text-xs text-slate-300">Diagnostic technique complet</span>
                      </div>
                      <div className="relative flex items-center gap-2">
                        <span className="absolute -left-6 w-4 h-4 rounded-full bg-purple-500 animate-pulse ring-4 ring-purple-500/20"></span>
                        <span className="text-xs font-semibold text-purple-400">Réparation en cours (Pièce neuve montée)</span>
                      </div>
                      <div className="relative flex items-center gap-2">
                        <span className="absolute -left-6 w-4 h-4 rounded-full bg-slate-700"></span>
                        <span className="text-xs text-slate-500">Contrôle qualité & Remise au client</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-950/20 border border-purple-800/30 rounded-xl text-xs text-purple-200">
                    ⚡ Estimation de fin : <strong className="text-white">{trackingResult.eta}</strong> • Pris en charge par <span className="text-purple-300">{trackingResult.technician}</span>.
                  </div>

                  <button
                    onClick={() => setTrackingResult(null)}
                    className="text-xs text-slate-400 hover:text-white underline text-center"
                  >
                    Rechercher un autre numéro
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTrackingSearch} className="flex flex-col gap-4">
                  <p className="text-xs text-slate-400">
                    Saisissez votre code de ticket ou numéro de téléphone pour voir l'avancement de votre appareil en temps réel.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Numéro de dossier ou Téléphone *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: ISMO-8492 ou 07000000"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Recherche en atelier...' : 'Consulter le statut'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email ou Téléphone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>

              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <a href="#contact" onClick={handleClose} className="hover:text-purple-400">Créer un compte</a>
                <a href="#contact" onClick={handleClose} className="hover:text-purple-400">Mot de passe oublié ?</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
