import { useState, type FormEvent, type ChangeEvent } from 'react';

interface HotelProfile {
  name: string;
  commune: string;
  address: string;
  image: string;
  stars: number;
  basePrice: number;
  description: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
  status: 'Disponible' | 'Occupée' | 'Réservée';
  price: string;
  guest?: string;
  image?: string;
}

const DEFAULT_HOTEL: HotelProfile = {
  name: 'Palais de Niangon',
  commune: 'Yopougon',
  address: 'Niangon Sud à droite, Carrefour Lubafrique, Abidjan',
  image: '/hotel-yop2.jpg',
  stars: 4,
  basePrice: 25000,
  description: "Cadre spacieux et sécurisé à Niangon. Wi-Fi haut débit, climatisation continue et service d'accueil 24h/24.",
};

const DEFAULT_ROOMS: Room[] = [
  { id: '1', name: 'Chambre Standard 101', type: 'Standard', status: 'Occupée', price: '20 000 FCFA', guest: 'Jean Kouassi', image: '/hotel-yop1.jpg' },
  { id: '2', name: 'Chambre Deluxe 102', type: 'Deluxe', status: 'Disponible', price: '28 000 FCFA', guest: '—', image: '/hotel-yop2.jpg' },
  { id: '3', name: 'Suite Prestige 201', type: 'Suite', status: 'Réservée', price: '38 000 FCFA', guest: 'Aminata Traoré', image: '/hotel-cocody1.jpg' },
];

const AVAILABLE_COMMUNES = [
  'Yopougon',
  'Cocody',
  'Plateau',
  'Marcory',
  'Koumassi',
  'Port-Bouët',
  'Treichville',
  'Adjamé',
  'Bingerville',
  'Abobo',
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'Aperçu' | 'Mes chambres' | 'Mon hôtel & Commune' | 'Réservations'>('Aperçu');

  // État de l'hôtel (avec persistance localStorage)
  const [hotel, setHotel] = useState<HotelProfile>(() => {
    try {
      const saved = localStorage.getItem('grandh_owner_hotel');
      return saved ? JSON.parse(saved) : DEFAULT_HOTEL;
    } catch {
      return DEFAULT_HOTEL;
    }
  });

  // État des chambres (avec persistance localStorage)
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('grandh_owner_rooms');
      return saved ? JSON.parse(saved) : DEFAULT_ROOMS;
    } catch {
      return DEFAULT_ROOMS;
    }
  });

  // Formulaire d'édition de l'hôtel
  const [hotelForm, setHotelForm] = useState<HotelProfile>(hotel);

  // Formulaire d'ajout de chambre
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState<{
    name: string;
    type: string;
    price: string;
    status: 'Disponible' | 'Occupée' | 'Réservée';
    guest: string;
    image: string;
  }>({
    name: '',
    type: 'Standard',
    price: '',
    status: 'Disponible',
    guest: '',
    image: '',
  });

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Gestion de l'image de l'hôtel (upload de fichier)
  const handleHotelImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHotelForm((prev) => ({ ...prev, image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de l'image de chambre (upload de fichier)
  const handleRoomImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRoomForm((prev) => ({ ...prev, image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Enregistrement de l'hôtel
  const handleSaveHotel = (e: FormEvent) => {
    e.preventDefault();
    setHotel(hotelForm);
    try {
      localStorage.setItem('grandh_owner_hotel', JSON.stringify(hotelForm));
    } catch {
      // ignore
    }
    notify(`L'établissement "${hotelForm.name}" situé à ${hotelForm.commune} a été mis à jour avec succès.`);
  };

  // Enregistrement d'une nouvelle chambre
  const handleAddRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!roomForm.name.trim() || !roomForm.price.trim()) return;

    const formattedPrice = roomForm.price.includes('FCFA')
      ? roomForm.price
      : `${Number(roomForm.price).toLocaleString()} FCFA`;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: roomForm.name.trim(),
      type: roomForm.type,
      status: roomForm.status,
      price: formattedPrice,
      guest: roomForm.status === 'Occupée' || roomForm.status === 'Réservée' ? (roomForm.guest.trim() || 'Client réservé') : '—',
      image: roomForm.image || hotel.image,
    };

    const updated = [newRoom, ...rooms];
    setRooms(updated);
    try {
      localStorage.setItem('grandh_owner_rooms', JSON.stringify(updated));
    } catch {
      // ignore
    }

    notify(`La chambre "${newRoom.name}" a été ajoutée avec succès.`);
    setRoomForm({
      name: '',
      type: 'Standard',
      price: '',
      status: 'Disponible',
      guest: '',
      image: '',
    });
    setShowAddRoomModal(false);
  };

  // Suppression d'une chambre
  const handleDeleteRoom = (id: string, name: string) => {
    const updated = rooms.filter((r) => r.id !== id);
    setRooms(updated);
    try {
      localStorage.setItem('grandh_owner_rooms', JSON.stringify(updated));
    } catch {
      // ignore
    }
    notify(`La chambre "${name}" a été retirée.`);
  };

  // Changer le statut d'une chambre
  const handleToggleRoomStatus = (id: string) => {
    const updated = rooms.map((r) => {
      if (r.id === id) {
        const nextStatus: 'Disponible' | 'Occupée' | 'Réservée' =
          r.status === 'Disponible' ? 'Occupée' : r.status === 'Occupée' ? 'Réservée' : 'Disponible';
        return {
          ...r,
          status: nextStatus,
          guest: nextStatus === 'Disponible' ? '—' : (r.guest && r.guest !== '—' ? r.guest : 'Client passage'),
        };
      }
      return r;
    });
    setRooms(updated);
    try {
      localStorage.setItem('grandh_owner_rooms', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const occupiedCount = rooms.filter((r) => r.status === 'Occupée').length;
  const reservedCount = rooms.filter((r) => r.status === 'Réservée').length;
  const availableCount = rooms.filter((r) => r.status === 'Disponible').length;

  return (
    <main className="bg-slate-100 px-4 pb-20 pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
        
        {/* BARRE LATÉRALE DE NAVIGATION */}
        <aside className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="border-b border-white/10 pb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-green-400">Espace Propriétaire</p>
              <h1 className="mt-2 text-xl font-black tracking-tight">GrandH Pro</h1>
              <p className="mt-1 text-xs text-slate-400 truncate">Hôtel : <strong className="text-white">{hotel.name}</strong></p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-green-400 border border-green-500/30">
                📍 {hotel.commune}
              </span>
            </div>

            <nav className="mt-6 space-y-2">
              {[
                { id: 'Aperçu', label: 'Aperçu', icon: '📊' },
                { id: 'Mon hôtel & Commune', label: 'Mon hôtel & Commune', icon: '🏨' },
                { id: 'Mes chambres', label: 'Mes chambres', icon: '🛏️' },
                { id: 'Réservations', label: 'Réservations', icon: '📅' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                    activeTab === item.id
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 rounded-2xl bg-white/10 p-4 text-xs text-slate-300 border border-white/5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>💡</span> Astuce gestion
            </p>
            <p className="mt-1 leading-relaxed">
              Mettez à jour vos tarifs et la disponibilité de vos chambres quotidiennement pour booster vos réservations.
            </p>
          </div>
        </aside>

        {/* CONTENU CENTRAL */}
        <section className="min-w-0 space-y-6">

          {/* BANNIÈRE D'EN-TÊTE COMMUNE */}
          <header className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/70 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Tableau de bord gérant</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
                Bonjour, Responsable {hotel.name} 👋
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Commune de rattachement : <strong className="text-slate-800">{hotel.commune}</strong> · {hotel.address}
              </p>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 p-3 border border-slate-200/80">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hotel-yop2.jpg';
                }}
              />
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{hotel.name}</p>
                <p className="text-xs font-medium text-green-700">● {hotel.commune} (Actif)</p>
                <p className="text-[11px] text-slate-400">{'★'.repeat(hotel.stars)} {hotel.stars} étoiles</p>
              </div>
            </div>
          </header>

          {/* MESSAGE TOAST TEMPORAIRE */}
          {toastMessage && (
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                  ✓
                </span>
                <p className="text-sm font-semibold">{toastMessage}</p>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-xs font-bold uppercase text-emerald-700 hover:underline"
              >
                Fermer
              </button>
            </div>
          )}

          {/* ======================= ONGLET 1 : APERÇU ======================= */}
          {activeTab === 'Aperçu' && (
            <div className="space-y-6">
              {/* Chiffres clés */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { value: `${rooms.length}`, label: 'Chambres enregistrées', color: 'text-slate-900', hint: 'Capacité totale' },
                  { value: `${occupiedCount}`, label: 'Occupées aujourd’hui', color: 'text-orange-600', hint: 'Clients sur place' },
                  { value: `${availableCount}`, label: 'Disponibles à la vente', color: 'text-green-700', hint: 'Prêtes à réserver' },
                  { value: `${(occupiedCount * hotel.basePrice).toLocaleString()} F`, label: 'Revenu du jour estimé', color: 'text-slate-900', hint: 'Base standard' },
                ].map((stat) => (
                  <article key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/70">
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="mt-1 text-xs font-bold text-slate-600">{stat.label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{stat.hint}</p>
                  </article>
                ))}
              </div>

              {/* Accès rapide & Graphique d'occupation */}
              <div className="grid gap-6 xl:grid-cols-5">
                <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/70 xl:col-span-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Fréquentation sur la commune de {hotel.commune}</p>
                      <p className="text-xs text-slate-500">Taux moyen d’occupation : 74 %</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">+12 % ce mois</span>
                  </div>
                  <div className="mt-8 flex h-36 items-end justify-between gap-2">
                    {[52, 68, 46, 75, 62, 88, 72].map((height, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            index === 5 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-slate-400">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl bg-slate-900 p-6 text-white xl:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-400">Actions rapides</span>
                      <span className="text-xs text-slate-400">GrandH Pro</span>
                    </div>
                    <h3 className="mt-3 text-lg font-black">Gérez votre hôtel facilement</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      Ajoutez de nouvelles chambres, ajustez vos tarifs et mettez en avant les équipements de votre établissement à {hotel.commune}.
                    </p>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    <button
                      onClick={() => setShowAddRoomModal(true)}
                      className="w-full rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white transition hover:bg-green-500 flex items-center justify-center gap-2"
                    >
                      <span>➕</span>
                      <span>Ajouter une nouvelle chambre</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('Mon hôtel & Commune')}
                      className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/20 flex items-center justify-center gap-2"
                    >
                      <span>🏨</span>
                      <span>Modifier mon hôtel & sa commune</span>
                    </button>
                  </div>
                </article>
              </div>

              {/* Aperçu rapide des chambres */}
              <article className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/70">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-900">Vos chambres en direct</h3>
                    <p className="text-xs text-slate-500">Statut en temps réel des hébergements de {hotel.name}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Mes chambres')}
                    className="text-xs font-bold text-green-700 hover:underline"
                  >
                    Voir tout ({rooms.length}) →
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {rooms.slice(0, 4).map((room) => (
                    <div key={room.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm hover:bg-slate-50/70 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                          <img src={room.image || hotel.image} alt={room.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{room.name}</p>
                          <p className="text-xs text-slate-500">Client : {room.guest}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-slate-800 text-sm">{room.price}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            room.status === 'Disponible'
                              ? 'bg-green-100 text-green-700'
                              : room.status === 'Occupée'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {/* ======================= ONGLET 2 : MON HÔTEL & SA COMMUNE ======================= */}
          {activeTab === 'Mon hôtel & Commune' && (
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Formulaire Hôtel */}
              <section className="rounded-3xl bg-white p-7 shadow-sm border border-slate-200/70 lg:col-span-3">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-green-600">Fiche Établissement</span>
                  <h3 className="mt-1 text-xl font-black text-slate-900">Configurer mon hôtel & ma commune</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Renseignez les détails de votre hôtel afin qu'il apparaisse correctement dans les recherches de commune sur GrandH.
                  </p>
                </div>

                <form onSubmit={handleSaveHotel} className="mt-6 space-y-4">
                  {/* Nom de l'hôtel */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nom de l'hôtel *
                    </label>
                    <input
                      required
                      type="text"
                      value={hotelForm.name}
                      onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                      placeholder="Ex: Palais de Niangon, Résidence Émeraude..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* Commune de l'hôtel */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Commune d'implantation *
                      </label>
                      <select
                        value={hotelForm.commune}
                        onChange={(e) => setHotelForm({ ...hotelForm, commune: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                      >
                        {AVAILABLE_COMMUNES.map((comm) => (
                          <option key={comm} value={comm}>
                            {comm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Ou autre commune libre
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Bassam, Assinie..."
                        onChange={(e) => {
                          if (e.target.value.trim()) {
                            setHotelForm({ ...hotelForm, commune: e.target.value.trim() });
                          }
                        }}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>

                  {/* Adresse complète */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Adresse complète & Quartier précis *
                    </label>
                    <input
                      required
                      type="text"
                      value={hotelForm.address}
                      onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                      placeholder="Ex: Niangon Sud à droite, Carrefour Lubafrique, Abidjan"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* Image de l'hôtel */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Photo principale de l'établissement *
                    </label>
                    <div className="mt-1.5 space-y-2">
                      <input
                        type="text"
                        value={hotelForm.image}
                        onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })}
                        placeholder="Collez une URL d'image ou chargez un fichier ci-dessous"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600 focus:bg-white"
                      />

                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer rounded-xl border border-dashed border-green-600 bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700 hover:bg-green-100 transition">
                          <span>📷 Choisir une photo depuis votre appareil</span>
                          <input type="file" accept="image/*" onChange={handleHotelImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tarif de base */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Tarif de départ par nuit (FCFA) *
                    </label>
                    <input
                      required
                      type="number"
                      min="5000"
                      step="1000"
                      value={hotelForm.basePrice}
                      onChange={(e) => setHotelForm({ ...hotelForm, basePrice: Number(e.target.value) })}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Description de votre hôtel & services inclus
                    </label>
                    <textarea
                      rows={3}
                      value={hotelForm.description}
                      onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                      placeholder="Décrivez les atouts : sécurité, Wi-Fi, climatisation, parking..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-green-600 py-3.5 font-bold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700 active:scale-[0.98]"
                  >
                    Enregistrer les modifications de l'hôtel
                  </button>
                </form>
              </section>

              {/* Aperçu direct de la carte client */}
              <section className="rounded-3xl bg-white p-7 shadow-sm border border-slate-200/70 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Aperçu Visuel</span>
                  <h4 className="mt-1 text-lg font-black text-slate-900">Rendu fiche visiteur</h4>
                  <p className="mt-1 text-xs text-slate-500">Voici comment votre hôtel est présenté aux clients de GrandH.</p>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-44 w-full bg-slate-200">
                      <img
                        src={hotelForm.image || '/hotel-yop2.jpg'}
                        alt={hotelForm.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hotel-yop2.jpg';
                        }}
                      />
                      <span className="absolute top-3 right-3 rounded-lg bg-green-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                        {hotelForm.basePrice.toLocaleString()} FCFA / nuit
                      </span>
                      <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white">
                        📍 {hotelForm.commune}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                          {hotelForm.commune}
                        </span>
                        <span className="text-xs text-amber-500 font-bold">
                          {'★'.repeat(hotelForm.stars)}
                        </span>
                      </div>
                      <h5 className="text-base font-black text-slate-900">{hotelForm.name}</h5>
                      <p className="text-xs text-slate-500 line-clamp-2">{hotelForm.description}</p>
                      <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 truncate">
                        📍 {hotelForm.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">✓ Référencement automatique</p>
                  <p>Votre hôtel apparaîtra directement dans les filtres de la commune « {hotelForm.commune} » sur la page d'accueil.</p>
                </div>
              </section>
            </div>
          )}

          {/* ======================= ONGLET 3 : MES CHAMBRES ======================= */}
          {activeTab === 'Mes chambres' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/70">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-600">Inventaire Hébergement</span>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">Chambres de {hotel.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ajoutez et mettez à jour le statut, le prix et les détails des chambres de votre établissement.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="rounded-xl bg-green-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <span>➕</span>
                  <span>Ajouter une chambre</span>
                </button>
              </div>

              {/* Grille des chambres */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <article
                    key={room.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/70 flex flex-col justify-between transition hover:shadow-md"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-200">
                        <img
                          src={room.image || hotel.image}
                          alt={room.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/hotel-yop1.jpg';
                          }}
                        />
                        <span
                          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                            room.status === 'Disponible'
                              ? 'bg-green-600 text-white'
                              : room.status === 'Occupée'
                              ? 'bg-orange-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {room.status}
                        </span>
                        <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white">
                          {room.type}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-slate-900 text-base">{room.name}</h4>
                          <span className="font-extrabold text-green-700 text-sm">{room.price}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Occupant actuel : <strong className="text-slate-800">{room.guest || '—'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleRoomStatus(room.id)}
                        className="text-xs font-bold text-slate-700 hover:text-green-700 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-green-50 transition"
                      >
                        Changer statut ({room.status})
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(room.id, room.name)}
                        className="text-xs font-bold text-red-600 hover:bg-red-50 py-1.5 px-3 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ======================= ONGLET 4 : RÉSERVATIONS ======================= */}
          {activeTab === 'Réservations' && (
            <div className="rounded-3xl bg-white p-7 shadow-sm border border-slate-200/70 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-600">Planning & Demandes</span>
                  <h3 className="mt-1 text-xl font-black text-slate-900">Dernières réservations reçues</h3>
                  <p className="text-xs text-slate-500 mt-1">Clients ayant réservé dans votre hôtel à {hotel.commune}.</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                  3 réservations actives
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  { name: 'Aminata Traoré', room: 'Suite Prestige 201', dates: '19 - 21 Septembre (2 nuits)', total: '76 000 FCFA', acompte: '15 200 FCFA', status: 'Acompte payé' },
                  { name: 'Jean Kouassi', room: 'Chambre Standard 101', dates: '18 - 20 Septembre (2 nuits)', total: '40 000 FCFA', acompte: '8 000 FCFA', status: 'En séjour' },
                  { name: 'Moussa Bakayoko', room: 'Chambre Deluxe 102', dates: '22 - 24 Septembre (2 nuits)', total: '56 000 FCFA', acompte: '11 200 FCFA', status: 'Confirmée' },
                ].map((res, i) => (
                  <div key={i} className="py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{res.name}</p>
                      <p className="text-xs text-slate-500">{res.room} · {res.dates}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">{res.total}</p>
                      <p className="text-[11px] text-green-700 font-medium">Acompte 20% : {res.acompte}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>

      {/* ======================= MODALE D'AJOUT DE CHAMBRE ======================= */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-600">Nouvel hébergement</span>
                <h3 className="text-xl font-black text-slate-900">Ajouter une chambre</h3>
              </div>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nom ou Numéro de chambre *
                </label>
                <input
                  required
                  type="text"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  placeholder="Ex: Chambre Supérieure 304, Suite Royale..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Catégorie
                  </label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600 focus:bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Familiale">Familiale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Prix par nuit (FCFA) *
                  </label>
                  <input
                    required
                    type="text"
                    value={roomForm.price}
                    onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                    placeholder="Ex: 25000"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Statut initial
                  </label>
                  <select
                    value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value as typeof roomForm.status })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600 focus:bg-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Occupée">Occupée</option>
                    <option value="Réservée">Réservée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nom du client (si occupée)
                  </label>
                  <input
                    type="text"
                    value={roomForm.guest}
                    onChange={(e) => setRoomForm({ ...roomForm, guest: e.target.value })}
                    placeholder="Facultatif"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo de la chambre */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Photo de la chambre (optionnelle)
                </label>
                <div className="mt-1.5 space-y-2">
                  <input
                    type="text"
                    value={roomForm.image}
                    onChange={(e) => setRoomForm({ ...roomForm, image: e.target.value })}
                    placeholder="URL d'image de la chambre"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-green-600 focus:bg-white"
                  />
                  <label className="cursor-pointer inline-block rounded-xl border border-dashed border-green-600 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100 transition">
                    <span>📁 Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={handleRoomImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-green-600 py-3 text-xs font-bold text-white shadow-md shadow-green-600/30 hover:bg-green-700 transition"
                >
                  Ajouter la chambre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
