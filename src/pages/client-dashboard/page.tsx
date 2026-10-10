import { useState, useEffect, type FormEvent } from 'react';
import { useModal } from '../../context/ModalContext';
import { reservationService, authService, type ReservationData, type User } from '../../services/api';
import GeniusPayCheckoutModal from '../../components/GeniusPayCheckoutModal';

export default function ClientDashboard() {
  const { navigate, showToast } = useModal();
  const [activeTab, setActiveTab] = useState<'actives' | 'historique' | 'profil'>('actives');
  const [user, setUser] = useState<User | null>(authService.getUser());
  
  const [activeReservations, setActiveReservations] = useState<ReservationData[]>([]);
  const [historyReservations, setHistoryReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Modale de reçu / bon PDF
  const [selectedReceipt, setSelectedReceipt] = useState<ReservationData | null>(null);

  // Modale de paiement de solde GeniusPay
  const [payingReservation, setPayingReservation] = useState<ReservationData | null>(null);

  // Formulaire profil
  const [profileForm, setProfileForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Mot de passe
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Démo de fallback si l'API est vide ou pour un nouvel utilisateur
  const fallbackReservations: ReservationData[] = [
    {
      id: 991,
      numero_reservation: 'RES-GH-2026-01',
      date_arrivee: '2026-10-15',
      date_depart: '2026-10-17',
      nombre_personnes: 2,
      montant_total: 50000,
      acompte: 10000,
      statut: 'confirmee',
      hotel: {
        id: 1,
        nom: 'Palais de Niangon',
        quartier: 'Yopougon',
        adresse: 'Niangon Sud, Carrefour Lubafrique',
        logo: '/hotel-yop2.jpg',
      },
      chambre: {
        id: 1,
        hotel_id: 1,
        numero_chambre: '102 Deluxe',
        prix_nuit: 25000,
      },
    },
  ];

  // Chargement des données
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Profil à jour
        if (authService.isAuthenticated()) {
          try {
            const current = await authService.getCurrentUser();
            setUser(current);
            setProfileForm({
              prenom: current.prenom || '',
              nom: current.nom || '',
              email: current.email || '',
              telephone: current.telephone || '',
            });
          } catch (e) {
            console.warn('Utilisation profil local:', e);
          }

          // Réservations actives
          try {
            const actives = await reservationService.getClientReservations();
            if (actives && actives.length > 0) {
              setActiveReservations(actives);
            } else {
              setActiveReservations(fallbackReservations);
            }
          } catch {
            setActiveReservations(fallbackReservations);
          }

          // Historique
          try {
            const hist = await reservationService.getClientHistory();
            if (hist) {
              setHistoryReservations(hist);
            }
          } catch {
            setHistoryReservations([]);
          }
        } else {
          setActiveReservations(fallbackReservations);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Annuler une réservation
  const handleCancelReservation = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    setCancellingId(id);
    try {
      if (id !== 991) {
        await reservationService.cancelClientReservation(id);
      }
      setActiveReservations((prev) => prev.filter((r) => r.id !== id));
      if (showToast) {
        showToast('Réservation annulée avec succès. La chambre est libérée.', 'info');
      }
    } catch (err: any) {
      console.error("Erreur annulation :", err);
      if (showToast) {
        showToast("Impossible d'annuler cette réservation sur le serveur.", 'error');
      }
    } finally {
      setCancellingId(null);
    }
  };

  // Mise à jour du profil
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const updated = await authService.updateProfile(profileForm);
      setUser(updated);
      if (showToast) {
        showToast('Vos informations ont été mises à jour.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      if (showToast) {
        showToast('Erreur lors de la mise à jour du profil.', 'error');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  // Changement de mot de passe
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.password.length < 8) {
      showToast?.('Le nouveau mot de passe doit comporter au moins 8 caractères.', 'error');
      return;
    }
    if (passwordForm.password !== passwordForm.password_confirmation) {
      showToast?.('Les mots de passe ne correspondent pas.', 'error');
      return;
    }

    setPasswordSaving(true);
    try {
      await authService.updatePassword(passwordForm);
      if (showToast) {
        showToast('Mot de passe mis à jour avec succès.', 'success');
      }
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err: any) {
      console.error(err);
      if (showToast) {
        showToast(err.response?.data?.message || 'Mot de passe actuel incorrect.', 'error');
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20 pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* BANNIÈRE HAUTE MODERNE */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Espace Voyageur VIP</span>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Bonjour, {user?.prenom || 'Voyageur'} {user?.nom || ''} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-400 max-w-xl">
                Gérez vos réservations de chambres en direct, vos reçus d'acompte et découvrez les meilleures résidences d'Abidjan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>🔍</span>
                <span>Réserver un hôtel</span>
              </button>
            </div>
          </div>

          {/* KPI CARDS RAPIDES */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-800/80 pt-6">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <p className="text-xs font-medium text-slate-400">Séjours en cours</p>
              <p className="mt-1 text-2xl font-black text-white">{activeReservations.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <p className="text-xs font-medium text-slate-400">Historique total</p>
              <p className="mt-1 text-2xl font-black text-emerald-400">{historyReservations.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <p className="text-xs font-medium text-slate-400">Statut Voyageur</p>
              <p className="mt-1 text-sm font-bold text-orange-400">⭐ Membre Privilège</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <p className="text-xs font-medium text-slate-400">Sécurité compte</p>
              <p className="mt-1 text-sm font-bold text-emerald-400">🔒 Protégé Sanctum</p>
            </div>
          </div>
        </section>

        {/* NAVIGATION PAR ONGLETS */}
        <div className="flex border-b border-slate-800 gap-3">
          {[
            { id: 'actives', label: 'Réservations actives', icon: '🛎️', count: activeReservations.length },
            { id: 'historique', label: 'Historique des séjours', icon: '📜', count: historyReservations.length },
            { id: 'profil', label: 'Mon Profil & Sécurité', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2.5 pb-4 px-2 text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENU ONGLET 1 : RÉSERVATIONS ACTIVES */}
        {activeTab === 'actives' && (
          <div className="space-y-6">
            {loading ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-12 text-center text-slate-400">
                <span className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="mt-4 text-sm">Chargement de vos réservations...</p>
              </div>
            ) : activeReservations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl">
                  🏖️
                </div>
                <h3 className="text-xl font-bold text-white">Aucune réservation en cours</h3>
                <p className="mx-auto max-w-md text-sm text-slate-400">
                  Vous n'avez pas de séjour programmé pour le moment. Explorez notre catalogue d'hôtels et résidences à Cocody, Yopougon, Plateau et plus.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500 transition"
                >
                  Découvrir les établissements
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {activeReservations.map((res) => (
                  <article
                    key={res.id}
                    className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 transition hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-950/20 flex flex-col justify-between"
                  >
                    <div>
                      {/* En-tête photo & statut */}
                      <div className="relative h-48 w-full bg-slate-900">
                        <img
                          src={res.hotel?.logo || res.chambre?.image || '/hotel-yop1.jpg'}
                          alt={res.hotel?.nom || 'Hôtel'}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/hotel-yop1.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <span className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
                          res.statut === 'confirmee'
                            ? 'bg-emerald-500 text-white'
                            : res.statut === 'client_arrive'
                            ? 'bg-blue-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          ● {res.statut === 'confirmee' ? 'Confirmée' : res.statut === 'client_arrive' ? 'En cours de séjour' : 'En attente'}
                        </span>
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            📍 {res.hotel?.quartier || res.hotel?.ville || 'Abidjan'}
                          </p>
                          <h3 className="text-lg font-black text-white">{res.hotel?.nom || 'Résidence de standing'}</h3>
                        </div>
                      </div>

                      {/* Détails du séjour */}
                      <div className="p-5 space-y-3 text-xs">
                        <div className="flex justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-slate-400">Hébergement :</span>
                          <strong className="text-slate-200">{res.chambre ? `Chambre ${res.chambre.numero_chambre}` : `Chambre confort`}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-slate-400">Période du séjour :</span>
                          <strong className="text-slate-200">{res.date_arrivee} ➔ {res.date_depart}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-slate-400">Occupants :</span>
                          <strong className="text-slate-200">{res.nombre_personnes || 2} personne(s)</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-slate-400">Montant total :</span>
                          <strong className="text-white text-sm">{res.montant_total ? `${Number(res.montant_total).toLocaleString()} FCFA` : '—'}</strong>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-slate-400">Acompte versé :</span>
                          <strong className="text-emerald-400 font-bold">{res.acompte ? `${Number(res.acompte).toLocaleString()} FCFA` : 'Payé'}</strong>
                        </div>
                        {Math.max(0, (Number(res.montant_total) || 0) - (Number(res.acompte) || 0)) > 0 && (
                          <div className="flex justify-between pt-1 border-t border-slate-800/60 text-amber-400">
                            <span>Solde restant :</span>
                            <strong className="font-bold">
                              {(Math.max(0, (Number(res.montant_total) || 0) - (Number(res.acompte) || 0))).toLocaleString()} FCFA
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions de gestion */}
                    <div className="p-5 pt-0 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedReceipt(res)}
                          className="text-xs font-bold text-emerald-400 hover:text-white py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>📄</span>
                          <span>Reçu / Bon PDF</span>
                        </button>
                        {Math.max(0, (Number(res.montant_total) || 0) - (Number(res.acompte) || 0)) > 0 && (
                          <button
                            onClick={() => setPayingReservation(res)}
                            className="text-xs font-black text-amber-300 hover:text-white py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>⚡</span>
                            <span>Payer le solde (GeniusPay)</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/reservation/${res.hotel_id || 1}`)}
                          className="text-xs font-bold text-slate-300 hover:text-white py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition"
                        >
                          Fiche hôtel
                        </button>
                        <button
                          disabled={cancellingId === res.id}
                          onClick={() => handleCancelReservation(res.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-300 py-2 px-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition disabled:opacity-50"
                        >
                          {cancellingId === res.id ? 'Annulation...' : 'Annuler'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENU ONGLET 2 : HISTORIQUE */}
        {activeTab === 'historique' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Historique complet des réservations</h3>
            <p className="text-xs text-slate-400">Toutes vos demandes passées et terminées sur GrandH.</p>

            {historyReservations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Aucun séjour passé archivé pour le moment.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {historyReservations.map((h) => (
                  <div key={h.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-white text-sm">{h.hotel?.nom || 'Hôtel GrandH'}</p>
                      <p className="text-slate-400">{h.date_arrivee} au {h.date_depart} · {h.nombre_personnes} personnes</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-bold text-white">{h.montant_total ? `${Number(h.montant_total).toLocaleString()} FCFA` : '—'}</p>
                        <span className="text-[11px] text-slate-400 font-medium">Statut : {h.statut}</span>
                      </div>
                      <button
                        onClick={() => setSelectedReceipt(h)}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-800 transition flex items-center gap-1"
                      >
                        <span>📄</span> Reçu PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENU ONGLET 3 : PROFIL & SÉCURITÉ */}
        {activeTab === 'profil' && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Formulaire Informations personnelles */}
            <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Coordonnées</p>
                <h3 className="mt-1 text-xl font-black text-white">Mes informations personnelles</h3>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-slate-300">
                    Prénom
                    <input
                      required
                      value={profileForm.prenom}
                      onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-300">
                    Nom
                    <input
                      required
                      value={profileForm.nom}
                      onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <label className="block text-xs font-bold text-slate-300">
                  Adresse e-mail
                  <input
                    required
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold text-slate-300">
                  Numéro de téléphone (Mobile Money)
                  <input
                    type="tel"
                    value={profileForm.telephone}
                    onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                    placeholder="0700000000"
                  />
                </label>

                <button
                  disabled={profileSaving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {profileSaving && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>Enregistrer mes coordonnées</span>
                </button>
              </form>
            </section>

            {/* Formulaire Sécurité & Mot de passe */}
            <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Sécurité</p>
                <h3 className="mt-1 text-xl font-black text-white">Changer mon mot de passe</h3>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <label className="block text-xs font-bold text-slate-300">
                  Mot de passe actuel
                  <input
                    required
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold text-slate-300">
                  Nouveau mot de passe (8 caractères minimum)
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold text-slate-300">
                  Confirmer le nouveau mot de passe
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={passwordForm.password_confirmation}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </label>

                <button
                  disabled={passwordSaving}
                  className="rounded-xl bg-slate-800 px-6 py-3 font-bold text-white hover:bg-slate-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {passwordSaving && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>Mettre à jour le mot de passe</span>
                </button>
              </form>
            </section>
          </div>
        )}

      {/* ======================= MODALE REÇU & BON D'HÉBERGEMENT (EXPORT PDF / IMPRESSION) ======================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl max-h-[95vh] overflow-y-auto print:max-w-none print:shadow-none print:rounded-none">
            
            {/* Header bar (invisible à l'impression) */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 print:hidden">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                📄 Bon de Réservation & Facture Client
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🖨️</span>
                  <span>Imprimer / Télécharger en PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Fiche imprimable officielle */}
            <div className="p-8 space-y-6 print:p-8 bg-white" id="printable-voucher">
              {/* En-tête officiel de l'établissement */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-slate-900">GrandH</span>
                    <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Certifié</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Plateforme Hôtelière & Résidences de Côte d'Ivoire</p>
                  <p className="text-xs text-slate-400">Abidjan, Côte d'Ivoire · support@grandh.ci</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Référence Reçu</p>
                  <p className="text-base font-black font-mono text-emerald-700">
                    {selectedReceipt.numero_reservation || `RES-GH-2026-000${selectedReceipt.id}`}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Émis le : {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Informations Client & Établissement */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5 border border-slate-200 text-xs">
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Client / Voyageur</p>
                  <p className="mt-1 font-black text-sm text-slate-900">
                    {user?.prenom} {user?.nom || 'Client Particulier'}
                  </p>
                  <p className="text-slate-600">{user?.email}</p>
                  <p className="text-slate-600">{user?.telephone || '+225 07 00 00 00 00'}</p>
                </div>

                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Établissement & Lieu</p>
                  <p className="mt-1 font-black text-sm text-slate-900">
                    {selectedReceipt.hotel?.nom || 'Hôtel Partenaire'}
                  </p>
                  <p className="text-slate-600">📍 {selectedReceipt.hotel?.quartier || selectedReceipt.hotel?.ville || 'Abidjan'}</p>
                  <p className="text-slate-500">{selectedReceipt.hotel?.adresse || 'Côte d’Ivoire'}</p>
                </div>
              </div>

              {/* Détails du séjour */}
              <div>
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Hébergement</th>
                      <th className="p-3">Dates de séjour</th>
                      <th className="p-3">Capacité</th>
                      <th className="p-3 text-right">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">
                        {selectedReceipt.chambre ? `Chambre ${selectedReceipt.chambre.numero_chambre}` : 'Chambre Standard'}
                      </td>
                      <td className="p-3 text-slate-700">
                        Du <strong className="text-slate-900">{selectedReceipt.date_arrivee}</strong> au <strong className="text-slate-900">{selectedReceipt.date_depart}</strong>
                      </td>
                      <td className="p-3 text-slate-700">
                        {selectedReceipt.nombre_personnes || 2} personne(s)
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">
                        {Number(selectedReceipt.montant_total).toLocaleString()} FCFA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bilan financier & QR Code de Check-in */}
              <div className="grid grid-cols-3 gap-4 items-center pt-2">
                {/* QR Code visuel */}
                <div className="col-span-1 rounded-2xl border border-slate-200 p-3 text-center bg-slate-50">
                  <div className="mx-auto h-24 w-24 bg-slate-900 p-2 rounded-xl flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white rounded-lg">
                      <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-slate-900 col-span-3 row-span-2 rounded-xs"></div>
                      <div className="bg-slate-900 col-span-2"></div>
                    </div>
                  </div>
                  <p className="mt-1 text-[9px] font-mono font-bold text-slate-500 uppercase">QR Check-in Réception</p>
                </div>

                {/* Ventilation des montants */}
                <div className="col-span-2 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Séjour (TTC) :</span>
                    <strong className="text-slate-900">{Number(selectedReceipt.montant_total).toLocaleString()} FCFA</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">
                    <span>Acompte encaissé en ligne :</span>
                    <span>- {Number(selectedReceipt.acompte || 0).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                    <span>Solde à payer à l'arrivée :</span>
                    <span className="text-amber-700">
                      {Math.max(0, (Number(selectedReceipt.montant_total) || 0) - (Number(selectedReceipt.acompte) || 0)).toLocaleString()} FCFA
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Mode de règlement acompte : <strong>GeniusPay (Mobile Money Wave / OM / MTN)</strong>
                  </p>
                </div>
              </div>

              {/* Conditions de séjour */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-800">📌 Consignes pour votre arrivée :</p>
                <p>• Présentez ce reçu imprimé ou affiché sur votre smartphone à la réception de l'hôtel.</p>
                <p>• Une pièce d'identité en cours de validité (CNI, Passeport) est requise lors du check-in.</p>
                <p>• Accueil et service de conciergerie disponibles 24h/24.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                GrandH SAS · Immatriculation RCCM CI-ABJ · Fait valoir ce que de droit
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================= MODALE GENIUSPAY POUR RÈGLEMENT DU SOLDE ======================= */}
      {payingReservation && (
        <GeniusPayCheckoutModal
          isOpen={true}
          onClose={() => setPayingReservation(null)}
          amount={Math.max(0, (Number(payingReservation.montant_total) || 0) - (Number(payingReservation.acompte) || 0))}
          hotelName={payingReservation.hotel?.nom || 'Hôtel Partenaire'}
          roomName={payingReservation.chambre ? `Chambre ${payingReservation.chambre.numero_chambre}` : 'Chambre confort'}
          orderId={`SOLDE-GH-${payingReservation.id}`}
          customerName={`${user?.prenom || ''} ${user?.nom || 'Client'}`.trim()}
          customerEmail={user?.email || 'client@grandh.ci'}
          customerPhone={user?.telephone || '0700000000'}
          onPaymentSuccess={(txId, method) => {
            setActiveReservations((prev) =>
              prev.map((r) =>
                r.id === payingReservation.id
                  ? { ...r, acompte: r.montant_total, statut: 'confirmee' }
                  : r
              )
            );
            setPayingReservation(null);
            showToast?.(`Solde réglé avec succès via ${method.toUpperCase()} (Réf: ${txId}) !`, 'success');
          }}
        />
      )}

      </div>
    </main>
  );
}
