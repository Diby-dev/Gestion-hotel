import { useState } from 'react';
import { useModal } from '../../context/ModalContext';

export default function LoginModal() {
  const { loginModal, closeLogin, showToast } = useModal();
  const [tab, setTab] = useState('client'); // 'client' or 'pro'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!loginModal.isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      showToast(
        tab === 'client'
          ? 'Bienvenue sur votre espace voyageur GrandH !'
          : 'Bienvenue sur votre portail propriétaire GrandH Pro !'
      );
    }, 800);
  };

  const handleClose = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    closeLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-green-400">
              Espace Connexion GrandH
            </span>
            <h3 className="text-xl font-bold text-white">
              {isLoggedIn ? 'Mon Compte' : 'Se connecter'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors text-base"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        {!isLoggedIn && (
          <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setTab('client')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                tab === 'client'
                  ? 'border-green-600 text-green-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              👤 Client / Voyageur
            </button>
            <button
              onClick={() => setTab('pro')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                tab === 'pro'
                  ? 'border-green-600 text-green-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              🏨 Espace Propriétaire
            </button>
          </div>
        )}

        <div className="p-6 md:p-8">
          {isLoggedIn ? (
            <div className="flex flex-col gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xl font-bold text-gray-900">
                  {tab === 'client' ? 'Session Voyageur Active' : 'Session Propriétaire Active'}
                </h4>
                <p className="text-sm text-gray-600">
                  Connecté en tant que <strong className="text-gray-800">{email || 'utilisateur@grandh.ci'}</strong>
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left text-xs flex flex-col gap-2.5">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Statut compte</span>
                  <span className="text-green-600 font-bold">● Vérifié Abidjan</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">
                    {tab === 'client' ? 'Réservations en cours' : 'Hôtels référencés'}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {tab === 'client' ? '1 réservation active' : '2 résidences vérifiées'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Solde Mobile Money lié</span>
                  <span className="font-semibold text-gray-800">Wave / OM configuré</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all cursor-pointer"
              >
                Fermer l'espace
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <p className="text-xs text-gray-500">
                {tab === 'client'
                  ? 'Connectez-vous pour retrouver vos réservations, reçus d\'acomptes et hôtels favoris.'
                  : 'Gérez vos chambres, vos disponibilités et encaissez vos acomptes automatiquement.'}
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Email ou Numéro Mobile Money *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 07 00 00 00 00 ou client@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-98 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-green-600/25 flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <button
                  type="button"
                  onClick={() => showToast('Formulaire de création de compte prêt !')}
                  className="hover:text-green-600 cursor-pointer"
                >
                  Créer un compte
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Lien de réinitialisation envoyé par SMS/Email')}
                  className="hover:text-green-600 cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
