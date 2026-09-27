import { useState, type FormEvent, type ChangeEvent } from 'react';

interface AdminAccount {
  name: string;
  hotel: string;
  email: string;
  status: string;
}

interface CommuneItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  hotelsCount?: number;
}

const initialAdmins: AdminAccount[] = [
  { name: 'M. Niang', hotel: 'Palais de Niangon', email: 'niang@grandh.ci', status: 'Actif' },
  { name: 'Mme Koné', hotel: 'Hôtel Ivoire Palace', email: 'kone@grandh.ci', status: 'Actif' },
];

const initialCommunes: CommuneItem[] = [
  {
    id: 'commune-yopougon',
    name: 'Yopougon',
    image: '/yopougon.png',
    description: 'Ambiance populaire, dynamique avec des résidences calmes et économiques.',
    hotelsCount: 2,
  },
  {
    id: 'commune-cocody',
    name: 'Cocody',
    image: '/cocody.png',
    description: 'Cadre prestigieux, verdoyant et sécurisé, idéal pour le standing.',
    hotelsCount: 2,
  },
];

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState<AdminAccount[]>(() => {
    try {
      const saved = localStorage.getItem('grandh_superadmin_admins');
      return saved ? JSON.parse(saved) : initialAdmins;
    } catch {
      return initialAdmins;
    }
  });

  const [communes, setCommunes] = useState<CommuneItem[]>(() => {
    try {
      const saved = localStorage.getItem('grandh_superadmin_communes');
      return saved ? JSON.parse(saved) : initialCommunes;
    } catch {
      return initialCommunes;
    }
  });

  const [adminForm, setAdminForm] = useState({ name: '', hotel: '', email: '' });
  const [communeForm, setCommuneForm] = useState({ name: '', image: '', description: '' });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const addAdmin = (event: FormEvent) => {
    event.preventDefault();
    if (!adminForm.name.trim() || !adminForm.hotel.trim() || !adminForm.email.trim()) return;

    const newAdmins = [...admins, { ...adminForm, status: 'Invitation envoyée' }];
    setAdmins(newAdmins);
    try {
      localStorage.setItem('grandh_superadmin_admins', JSON.stringify(newAdmins));
    } catch {
      // ignore
    }
    setAdminForm({ name: '', hotel: '', email: '' });
    showFeedback(`Le compte administrateur pour "${adminForm.hotel}" a été créé.`);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCommuneForm((prev) => ({ ...prev, image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addCommune = (event: FormEvent) => {
    event.preventDefault();
    if (!communeForm.name.trim() || !communeForm.image.trim()) return;

    const newCommune: CommuneItem = {
      id: `commune-${Date.now()}`,
      name: communeForm.name.trim(),
      image: communeForm.image.trim(),
      description: communeForm.description.trim() || 'Nouvelle commune référencée sur GrandH.',
      hotelsCount: 0,
    };

    const updatedCommunes = [newCommune, ...communes];
    setCommunes(updatedCommunes);
    try {
      localStorage.setItem('grandh_superadmin_communes', JSON.stringify(updatedCommunes));
    } catch {
      // ignore
    }

    showFeedback(`La commune "${newCommune.name}" a été ajoutée avec succès.`);
    setCommuneForm({ name: '', image: '', description: '' });
  };

  const deleteCommune = (id: string, name: string) => {
    const updated = communes.filter((c) => c.id !== id);
    setCommunes(updated);
    try {
      localStorage.setItem('grandh_superadmin_communes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showFeedback(`La commune "${name}" a été retirée.`, 'info');
  };

  return (
    <main className="bg-slate-100 px-4 pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* En-tête */}
        <header className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Administration centrale</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Tableau de bord super-admin</h1>
              <p className="mt-2 text-sm text-slate-300">
                Supervision générale de GrandH : gestion des administrateurs d'hôtels et configuration des communes.
              </p>
            </div>
            <span className="self-start rounded-full bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-200 border border-violet-500/30">
              Mode Super-Administrateur
            </span>
          </div>
        </header>

        {/* Message de notification contextuelle */}
        {notification && (
          <div
            className={`flex items-center justify-between rounded-2xl p-4 shadow-sm border ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-violet-50 border-violet-200 text-violet-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold shadow-sm">
                {notification.type === 'success' ? '✓' : 'ℹ'}
              </span>
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold uppercase hover:underline opacity-70"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Chiffres clés */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { number: String(admins.length), label: 'Propriétaires administrés', color: 'text-violet-700' },
            { number: String(communes.length), label: 'Communes actives', color: 'text-emerald-600' },
            { number: '18', label: 'Hôtels vérifiés', color: 'text-orange-600' },
            { number: '126', label: 'Chambres référencées', color: 'text-slate-900' },
          ].map((stat) => (
            <article key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60">
              <p className={`text-3xl font-black ${stat.color}`}>{stat.number}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
            </article>
          ))}
        </div>

        {/* SECTION 1 : GESTION DES PROPRIÉTAIRES / ADMINS */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Liste des administrateurs */}
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/60 lg:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Propriétaires & Administrateurs</h2>
                <p className="text-sm text-slate-500">Gestion des accès partenaires aux tableaux de bord</p>
              </div>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                {admins.length} comptes
              </span>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {admins.map((admin, index) => (
                <div
                  key={`${admin.email}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{admin.name}</p>
                    <p className="text-sm text-slate-500">
                      {admin.hotel} · <span className="text-slate-400">{admin.email}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      admin.status === 'Actif'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {admin.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Formulaire d'ajout d'administrateur */}
          <section className="rounded-3xl bg-violet-700 p-6 text-white shadow-md lg:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Accès partenaires</p>
              <h2 className="mt-1 text-xl font-black">Ajouter un accès admin</h2>
              <p className="mt-1 text-xs text-violet-100">
                Créez les identifiants d'un nouveau propriétaire d'hôtel.
              </p>

              <form onSubmit={addAdmin} className="mt-5 space-y-3">
                <label className="block">
                  <span className="text-xs font-semibold text-violet-200">Nom du propriétaire</span>
                  <input
                    required
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    placeholder="Ex: M. Jean Kouadio"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-violet-200/70 outline-none focus:bg-white/20 focus:border-white/40"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-violet-200">Nom de l'hôtel</span>
                  <input
                    required
                    type="text"
                    value={adminForm.hotel}
                    onChange={(e) => setAdminForm({ ...adminForm, hotel: e.target.value })}
                    placeholder="Ex: Résidence La Colombe"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-violet-200/70 outline-none focus:bg-white/20 focus:border-white/40"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-violet-200">E-mail professionnel</span>
                  <input
                    required
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="kouadio@exemple.ci"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-violet-200/70 outline-none focus:bg-white/20 focus:border-white/40"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-white py-3 font-bold text-violet-800 transition hover:bg-violet-50 active:scale-[0.98] shadow-sm"
                >
                  Enregistrer l'administrateur
                </button>
              </form>
            </div>
            <p className="mt-4 text-[11px] text-violet-200 text-center">
              Un mot de passe temporaire sera généré automatiquement.
            </p>
          </section>
        </div>

        {/* SECTION 2 : GESTION DES COMMUNES & FORMULAIRE D'AJOUT */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Formulaire d'ajout de Commune */}
          <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-md lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Territoire & Zones</p>
                <h2 className="mt-1 text-xl font-black">Ajouter une commune</h2>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                + Nouveau
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-300">
              Définissez une nouvelle commune disponible pour le référencement et la recherche d'hôtels.
            </p>

            <form onSubmit={addCommune} className="mt-5 space-y-4">
              {/* Nom de la commune */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-200">Nom de la commune *</span>
                <input
                  required
                  type="text"
                  value={communeForm.name}
                  onChange={(e) => setCommuneForm({ ...communeForm, name: e.target.value })}
                  placeholder="Ex: Marcory, Plateau, Koumassi, Treichville..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white/15"
                />
              </label>

              {/* Image de la commune : URL ou Upload de fichier */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200">Image de la commune *</span>

                {/* Option 1: URL directe */}
                <input
                  type="text"
                  value={communeForm.image}
                  onChange={(e) => setCommuneForm({ ...communeForm, image: e.target.value })}
                  placeholder="Collez une URL d'image (ou utilisez le bouton ci-dessous)"
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white/15"
                />

                {/* Option 2: Fichier local */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-emerald-400/50 bg-emerald-950/30 px-4 py-2.5 text-center text-xs font-medium text-emerald-300 transition hover:bg-emerald-950/60">
                    <span>📁 Choisir une image depuis l'ordinateur</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {communeForm.image && (
                    <button
                      type="button"
                      onClick={() => setCommuneForm({ ...communeForm, image: '' })}
                      className="rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-300"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* Prévisualisation de l'image */}
                {communeForm.image && (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-white/20 bg-black/40">
                    <p className="px-3 pt-2 text-[11px] font-semibold text-slate-300">Aperçu visuel :</p>
                    <div className="p-2">
                      <img
                        src={communeForm.image}
                        alt="Aperçu commune"
                        className="h-28 w-full rounded-xl object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description facultative */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-200">Courte description (optionnel)</span>
                <textarea
                  rows={2}
                  value={communeForm.description}
                  onChange={(e) => setCommuneForm({ ...communeForm, description: e.target.value })}
                  placeholder="Ex: Quartier d'affaires, bord de lagune, calme et sécurisé..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white/15 resize-none"
                />
              </label>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={!communeForm.name.trim() || !communeForm.image.trim()}
                className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter la commune
              </button>
            </form>
          </section>

          {/* Liste des communes configurées */}
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/60 lg:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Communes enregistrées</h2>
                <p className="text-sm text-slate-500">
                  Zones géographiques actives dans le moteur de recherche et les filtres
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {communes.length} communes
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {communes.map((c) => (
                <article
                  key={c.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-lg font-black tracking-wide">{c.name}</p>
                      <p className="text-[11px] text-emerald-300 font-medium">
                        {c.hotelsCount ? `${c.hotelsCount} hôtels répertoriés` : 'Aucun hôtel assigné'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {c.description || 'Commune disponible pour les réservations.'}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Visible sur le site
                      </span>
                      <button
                        onClick={() => deleteCommune(c.id, c.name)}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
