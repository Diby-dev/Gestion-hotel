import { useState } from 'react';

const initialRooms = [
  { id: '101', name: 'Chambre Standard 101', type: 'Standard', status: 'Occupée', price: '20 000 FCFA', guest: 'Jean Kouassi', hourlyRates: { 1: 6000, 2: 9000, 3: 12000, 4: 15000 } },
  { id: '102', name: 'Chambre Deluxe 102', type: 'Deluxe', status: 'Disponible', price: '28 000 FCFA', guest: '—', hourlyRates: { 1: 8000, 2: 12000, 3: 16000, 4: 20000 } },
  { id: '201', name: 'Suite Prestige 201', type: 'Suite', status: 'Réservée', price: '38 000 FCFA', guest: 'Aminata Traoré', hourlyRates: { 1: 12000, 2: 18000, 3: 24000, 4: 30000 } },
  { id: '103', name: 'Chambre Standard 103', type: 'Standard', status: 'Occupée', price: '20 000 FCFA', guest: 'Koffi Fabrice', hourlyRates: { 1: 6000, 2: 9000, 3: 12000, 4: 15000 } },
];

const initialRates = { night: 25000, 1: 6000, 2: 9000, 3: 12000, 4: 15000 };
const formatPrice = (value) => `${Number(value || 0).toLocaleString('fr-FR')} FCFA`;

function StatusBadge({ status }) {
  const styles =
    status === 'Disponible'
      ? 'bg-emerald-100 text-emerald-800'
      : status === 'Occupée'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-amber-100 text-amber-800';
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles}`}>{status}</span>;
}

export default function OwnerDashboard() {
  const [active, setActive] = useState('Planning & Calendrier');
  const [rates, setRates] = useState(initialRates);
  const [rooms, setRooms] = useState(initialRooms);
  const [photos, setPhotos] = useState(['/hotel-yop2.jpg']);
  const [saved, setSaved] = useState(false);
  const [boosted, setBoosted] = useState(false);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [selectedCalendarSlot, setSelectedCalendarSlot] = useState(null);

  const [roomForm, setRoomForm] = useState({
    number: '',
    type: 'Chambre Standard',
    nightPrice: 20000,
    hourlyPrice1: 6000,
    hourlyPrice2: 9000,
    hourlyPrice3: 12000,
    hourlyPrice4: 15000,
    capacity: 2,
    allowsHourly: true,
  });

  const [isEditingEstablishment, setIsEditingEstablishment] = useState(false);
  const [establishmentSaved, setEstablishmentSaved] = useState(false);
  const [establishment, setEstablishment] = useState({
    name: 'Palais de Niangon',
    commune: 'Yopougon',
    address: 'Niangon Sud à droite, Carrefour Lubafrique, Abidjan',
    phone: '+225 07 07 07 07 07',
    email: 'contact@palaisniangon.ci',
    description: 'Un cadre calme, spacieux et sécurisé pour vos séjours à Abidjan.',
  });

  const menuItems = [
    'Planning & Calendrier',
    'Aperçu',
    'Mes chambres',
    'Tarifs & Court Séjour',
    'Booster mon hôtel',
    'Réservations',
    'Mon établissement',
  ];

  const updateRate = (key, value) => {
    setRates((current) => ({ ...current, [key]: Math.max(0, Number(value)) }));
    setSaved(false);
  };

  const addPhotos = (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((current) => [...current, reader.result]);
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const saveChanges = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3500);
  };

  const addRoom = (event) => {
    event.preventDefault();
    setRooms((current) => [
      ...current,
      {
        id: String(Date.now().toString().slice(-4)),
        name: `${roomForm.type} ${roomForm.number}`,
        type: roomForm.type.replace('Chambre ', ''),
        status: 'Disponible',
        price: formatPrice(roomForm.nightPrice),
        hourlyRates: {
          1: roomForm.hourlyPrice1,
          2: roomForm.hourlyPrice2,
          3: roomForm.hourlyPrice3,
          4: roomForm.hourlyPrice4,
        },
        guest: '—',
      },
    ]);
    setRoomForm({
      number: '',
      type: 'Chambre Standard',
      nightPrice: 20000,
      hourlyPrice1: 6000,
      hourlyPrice2: 9000,
      hourlyPrice3: 12000,
      hourlyPrice4: 15000,
      capacity: 2,
      allowsHourly: true,
    });
    setIsRoomFormOpen(false);
  };

  const saveEstablishment = (event) => {
    event.preventDefault();
    setIsEditingEstablishment(false);
    setEstablishmentSaved(true);
    window.setTimeout(() => setEstablishmentSaved(false), 3500);
  };

  // ==================== PANNEAU 1 : PLANNING & CALENDRIER (TAPE CHART) ====================
  const daysOfWeek = [
    { key: 'lun', label: 'Lun', date: '12 Oct', isToday: false },
    { key: 'mar', label: 'Mar', date: '13 Oct', isToday: true },
    { key: 'mer', label: 'Mer', date: '14 Oct', isToday: false },
    { key: 'jeu', label: 'Jeu', date: '15 Oct', isToday: false },
    { key: 'ven', label: 'Ven', date: '16 Oct', isToday: false },
    { key: 'sam', label: 'Sam', date: '17 Oct', isToday: false },
    { key: 'dim', label: 'Dim', date: '18 Oct', isToday: false },
  ];

  // Matrice des réservations par chambre et par jour
  const calendarData = {
    '101': {
      lun: { status: 'occupied', client: 'Jean Kouassi', type: 'Nuitée', total: '20 000 FCFA', acompte: '10 000 F', phone: '0708091011' },
      mar: { status: 'occupied', client: 'Jean Kouassi', type: 'Nuitée', total: '20 000 FCFA', acompte: '20 000 F', phone: '0708091011' },
      mer: { status: 'short_stay', client: 'Marc B. (14h-17h)', type: 'Passage 3H', total: '12 000 FCFA', acompte: '12 000 F', phone: '0504030201' },
      jeu: { status: 'available' },
      ven: { status: 'reserved', client: 'Seydou Touré', type: 'Nuitée', total: '20 000 FCFA', acompte: '10 000 F', phone: '0102030405' },
      sam: { status: 'reserved', client: 'Seydou Touré', type: 'Nuitée', total: '20 000 FCFA', acompte: '10 000 F', phone: '0102030405' },
      dim: { status: 'available' },
    },
    '102': {
      lun: { status: 'available' },
      mar: { status: 'available' },
      mer: { status: 'reserved', client: 'Clarisse N’Dri', type: 'Nuitée', total: '28 000 FCFA', acompte: '14 000 F', phone: '0748001122' },
      jeu: { status: 'reserved', client: 'Clarisse N’Dri', type: 'Nuitée', total: '28 000 FCFA', acompte: '14 000 F', phone: '0748001122' },
      ven: { status: 'short_stay', client: 'Désiré K. (11h-13h)', type: 'Passage 2H', total: '12 000 FCFA', acompte: '12 000 F', phone: '0555443322' },
      sam: { status: 'occupied', client: 'Franck G.', type: 'Nuitée', total: '28 000 FCFA', acompte: '28 000 F', phone: '0700112233' },
      dim: { status: 'available' },
    },
    '201': {
      lun: { status: 'reserved', client: 'Aminata Traoré', type: 'Nuitée Prestige', total: '38 000 FCFA', acompte: '20 000 F', phone: '0707070708' },
      mar: { status: 'occupied', client: 'Aminata Traoré', type: 'Nuitée Prestige', total: '38 000 FCFA', acompte: '38 000 F', phone: '0707070708' },
      mer: { status: 'occupied', client: 'Aminata Traoré', type: 'Nuitée Prestige', total: '38 000 FCFA', acompte: '38 000 F', phone: '0707070708' },
      jeu: { status: 'available' },
      ven: { status: 'available' },
      sam: { status: 'short_stay', client: 'Couple VIP (15h-19h)', type: 'Passage 4H', total: '30 000 FCFA', acompte: '30 000 F', phone: '0789898989' },
      dim: { status: 'available' },
    },
    '103': {
      lun: { status: 'occupied', client: 'Koffi Fabrice', type: 'Nuitée', total: '20 000 FCFA', acompte: '20 000 F', phone: '0506070809' },
      mar: { status: 'available' },
      mer: { status: 'available' },
      jeu: { status: 'short_stay', client: 'Alain D. (10h-12h)', type: 'Passage 2H', total: '9 000 FCFA', acompte: '9 000 F', phone: '0101010102' },
      ven: { status: 'reserved', client: 'Bamba Karim', type: 'Nuitée', total: '20 000 FCFA', acompte: '10 000 F', phone: '0702030405' },
      sam: { status: 'occupied', client: 'Bamba Karim', type: 'Nuitée', total: '20 000 FCFA', acompte: '20 000 F', phone: '0702030405' },
      dim: { status: 'available' },
    },
  };

  const PlanningPanel = () => (
    <div className="mt-7 space-y-6">
      {/* En-tête du Planning */}
      <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-orange-600">Planning & Tape Chart</span>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Calendrier des Chambres</h2>
          <p className="mt-1 text-xs text-slate-500">
            Suivi visuel des réservations de la semaine : nuitées et créneaux courts séjours (1H-4H).
          </p>
        </div>

        {/* Légende du Calendrier */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Libre
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-800 border border-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span> Occupée
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-800 border border-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span> Réservée
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-purple-800 border border-purple-200">
            <span className="h-2 w-2 rounded-full bg-purple-600"></span> ⚡ Court Séjour (Heures)
          </span>
        </div>
      </section>

      {/* Grille Interactive du Planning (Tape Chart) */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-4 font-black uppercase text-[11px] w-48 bg-slate-100/70 sticky left-0 z-10">
                  Chambre
                </th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day.key}
                    className={`p-3 text-center font-bold ${
                      day.isToday ? 'bg-orange-50 text-orange-900 border-x border-orange-200' : ''
                    }`}
                  >
                    <p className="text-xs uppercase">{day.label}</p>
                    <p className={`text-[11px] font-black ${day.isToday ? 'text-orange-600 font-extrabold' : 'text-slate-400'}`}>
                      {day.date} {day.isToday && '(Auj.)'}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => {
                const slots = calendarData[room.id] || {};
                return (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition">
                    {/* Colonne Chambre fixe */}
                    <td className="p-4 font-bold text-slate-900 bg-white sticky left-0 z-10 border-r border-slate-100 shadow-xs">
                      <p className="text-sm font-black">{room.name}</p>
                      <p className="text-[10px] text-slate-500">{room.price} · {room.type}</p>
                    </td>

                    {/* Cellules des jours */}
                    {daysOfWeek.map((day) => {
                      const slot = slots[day.key] || { status: 'available' };
                      return (
                        <td
                          key={day.key}
                          className={`p-2 text-center align-middle ${
                            day.isToday ? 'bg-orange-50/40 border-x border-orange-100' : ''
                          }`}
                        >
                          {slot.status === 'available' ? (
                            <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-2 text-emerald-700 text-[11px] font-medium transition hover:bg-emerald-100 cursor-pointer">
                              Libre
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCalendarSlot({
                                  ...slot,
                                  roomName: room.name,
                                  day: `${day.label} ${day.date}`,
                                })
                              }
                              className={`w-full text-left rounded-xl p-2 font-bold shadow-2xs transition hover:scale-[1.02] cursor-pointer ${
                                slot.status === 'occupied'
                                  ? 'bg-blue-600 text-white'
                                  : slot.status === 'short_stay'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-amber-500 text-white'
                              }`}
                            >
                              <p className="text-[10px] uppercase tracking-wider opacity-90">{slot.type}</p>
                              <p className="truncate text-xs font-black">{slot.client}</p>
                              <p className="text-[9px] opacity-90">{slot.total}</p>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ROTATION DE LA JOURNÉE : TIMELINE DES PASSAGES DU JOUR (1H - 4H) */}
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              ⚡ Rotation Heures du Jour (1H - 4H)
            </span>
            <h3 className="text-lg font-black mt-0.5">Planning des créneaux horaires d'aujourd'hui</h3>
          </div>
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300 border border-orange-500/30">
            Revenu généré par les passages : +42 000 FCFA
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { hour: '09h00 - 11h00', room: 'Chambre 101', client: 'Passage 2H', paid: '9 000 FCFA', status: 'Terminé' },
            { hour: '11h30 - 14h30', room: 'Chambre 103', client: 'Passage 3H', paid: '12 000 FCFA', status: 'En cours' },
            { hour: '15h00 - 17h00', room: 'Chambre 102', client: 'Passage 2H', paid: '12 000 FCFA', status: 'Réservé' },
            { hour: '18h00 - 22h00', room: 'Suite 201', client: 'Passage 4H', paid: '30 000 FCFA', status: 'Réservé' },
          ].map((rot, i) => (
            <div key={i} className="rounded-2xl bg-white/10 p-3.5 border border-white/10 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-orange-300 font-bold">{rot.hour}</span>
                <span className="text-[10px] rounded bg-white/20 px-1.5 py-0.5">{rot.status}</span>
              </div>
              <p className="font-bold text-white text-sm">{rot.room}</p>
              <p className="text-slate-300">{rot.client} · <strong className="text-emerald-400">{rot.paid}</strong></p>
            </div>
          ))}
        </div>
      </section>

      {/* Modale Détail Réservation cliquée sur le calendrier */}
      {selectedCalendarSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Détail Planning</span>
                <h4 className="text-base font-black">{selectedCalendarSlot.roomName}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalendarSlot(null)}
                className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jour :</span>
                <strong className="text-slate-900">{selectedCalendarSlot.day}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Client :</span>
                <strong className="text-slate-900">{selectedCalendarSlot.client}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Formule :</span>
                <strong className="text-orange-600">{selectedCalendarSlot.type}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Téléphone client :</span>
                <strong className="font-mono text-slate-900">{selectedCalendarSlot.phone}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Montant total :</span>
                <strong className="text-slate-900">{selectedCalendarSlot.total}</strong>
              </div>
              <div className="flex justify-between py-1 text-emerald-700 font-bold">
                <span>Acompte encaissé :</span>
                <span>{selectedCalendarSlot.acompte}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCalendarSlot(null)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Client validé avec succès.');
                  setSelectedCalendarSlot(null);
                }}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Valider arrivée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== PANNEAU 2 : APERÇU FINANCIER & RECETTES ====================
  const Overview = () => (
    <>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['540 000 FCFA', 'Chiffre d’affaires ce mois', 'text-slate-950', 'Total cumulé'],
          ['168 000 FCFA', 'Argent rentré (Encaissé)', 'text-emerald-700', 'Acomptes & paiements'],
          ['84 000 FCFA', 'Soldes à percevoir', 'text-amber-700', 'À encaisser au check-in'],
          ['75 %', 'Taux d’occupation en direct', 'text-orange-600', '3 sur 4 chambres occupées'],
        ].map(([value, label, color, hint]) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="mt-1 text-xs font-bold text-slate-700">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <article className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-3 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-slate-950">Occupation de la semaine</p>
              <p className="text-xs text-slate-500">Taux moyen : 75 % (Nuitées & Courts séjours)</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              +14 % ce mois
            </span>
          </div>
          <div className="mt-8 flex h-36 items-end justify-between gap-2">
            {[52, 68, 46, 75, 62, 88, 72].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    index === 5 ? 'bg-orange-500' : 'bg-emerald-600'
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

        <article className="rounded-3xl bg-slate-950 p-6 text-white xl:col-span-2 flex flex-col justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-orange-400">PROCHAINE ARRIVÉE</p>
            <h3 className="mt-2 text-xl font-black">Aminata Traoré</h3>
            <p className="mt-1 text-xs text-slate-300">Suite Prestige 201 · Arrivée prévue 16:00</p>
            <div className="mt-5 border-t border-white/10 pt-4 text-xs space-y-1">
              <p>Formule : <strong>2 nuits · 76 000 FCFA</strong></p>
              <p className="text-emerald-400 font-bold">✓ Acompte GeniusPay Mobile Money encaissé</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActive('Planning & Calendrier')}
            className="mt-4 rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition"
          >
            Voir sur le planning complet →
          </button>
        </article>
      </div>
    </>
  );

  // ==================== PANNEAU 3 : TARIFS & COURT SÉJOUR ====================
  const RatesPanel = () => (
    <section className="mt-7 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-orange-600">Réservations & prix</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Tarifs de votre établissement</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configurez vos prix pour la nuitée et les créneaux horaires courts séjours (1H, 2H, 3H, 4H).
          </p>
        </div>
        <button
          type="button"
          onClick={saveChanges}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 cursor-pointer"
        >
          Enregistrer les tarifs
        </button>
      </div>

      {saved && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          ✓ Tarifs enregistrés avec succès.
        </p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <label className="rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-4 lg:col-span-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Séjour nuit</span>
          <span className="mt-2 block text-sm font-bold text-slate-700">Prix de départ / nuit</span>
          <input
            type="number"
            min="0"
            value={rates.night}
            onChange={(event) => updateRate('night', event.target.value)}
            className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 font-black text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <span className="mt-2 block text-xs text-slate-500">{formatPrice(rates.night)}</span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-4 xl:grid-cols-4">
          {[1, 2, 3, 4].map((hours) => (
            <label key={hours} className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <span className="text-xs font-black uppercase tracking-wider text-orange-700">Option Court séjour</span>
              <span className="mt-2 block font-bold text-slate-800">
                {hours} heure{hours > 1 ? 's' : ''}
              </span>
              <input
                type="number"
                min="0"
                value={rates[hours]}
                onChange={(event) => updateRate(hours, event.target.value)}
                className="mt-3 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 font-black text-orange-800 outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span className="mt-2 block text-xs text-slate-500">{formatPrice(rates[hours])}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );

  // ==================== PANNEAU 4 : MES CHAMBRES ====================
  const RoomsPanel = () => (
    <section className="mt-7 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-b border-slate-100">
        <div>
          <h2 className="font-black text-slate-950 text-xl">Inventaire hébergement</h2>
          <p className="text-sm text-slate-500">État de vos chambres et tarifs configurés.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsRoomFormOpen((current) => !current)}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          {isRoomFormOpen ? 'Fermer le formulaire' : '+ Ajouter une chambre'}
        </button>
      </div>

      {isRoomFormOpen && (
        <form onSubmit={addRoom} className="mx-6 mb-6 mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 space-y-4">
          <h3 className="font-black text-slate-950">Nouvel hébergement</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <label className="text-sm font-bold text-slate-700">
              Numéro de chambre
              <input
                required
                value={roomForm.number}
                onChange={(event) => setRoomForm({ ...roomForm, number: event.target.value })}
                placeholder="Ex. 104"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none"
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Type
              <select
                value={roomForm.type}
                onChange={(event) => setRoomForm({ ...roomForm, type: event.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none"
              >
                <option>Chambre Standard</option>
                <option>Chambre Deluxe</option>
                <option>Suite Prestige</option>
                <option>Studio meublé</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Prix par nuit (FCFA)
              <input
                required
                type="number"
                min="0"
                value={roomForm.nightPrice}
                onChange={(event) => setRoomForm({ ...roomForm, nightPrice: Number(event.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none"
              />
            </label>
          </div>

          <div className="rounded-xl bg-white p-4 border border-orange-200 space-y-2">
            <p className="text-xs font-bold text-orange-800 uppercase">Tarifs Court Séjour (Passage)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="text-xs font-bold text-slate-700">1H (FCFA)
                <input type="number" value={roomForm.hourlyPrice1} onChange={(e) => setRoomForm({ ...roomForm, hourlyPrice1: Number(e.target.value) })} className="mt-1 w-full rounded-lg border p-1.5" />
              </label>
              <label className="text-xs font-bold text-slate-700">2H (FCFA)
                <input type="number" value={roomForm.hourlyPrice2} onChange={(e) => setRoomForm({ ...roomForm, hourlyPrice2: Number(e.target.value) })} className="mt-1 w-full rounded-lg border p-1.5" />
              </label>
              <label className="text-xs font-bold text-slate-700">3H (FCFA)
                <input type="number" value={roomForm.hourlyPrice3} onChange={(e) => setRoomForm({ ...roomForm, hourlyPrice3: Number(e.target.value) })} className="mt-1 w-full rounded-lg border p-1.5" />
              </label>
              <label className="text-xs font-bold text-slate-700">4H (FCFA)
                <input type="number" value={roomForm.hourlyPrice4} onChange={(e) => setRoomForm({ ...roomForm, hourlyPrice4: Number(e.target.value) })} className="mt-1 w-full rounded-lg border p-1.5" />
              </label>
            </div>
          </div>

          <button className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600">
            Ajouter la chambre à l'inventaire
          </button>
        </form>
      )}

      <div className="divide-y divide-slate-100">
        {rooms.map((room) => (
          <div key={room.name} className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm hover:bg-slate-50 transition">
            <div>
              <p className="font-bold text-slate-950 text-base">{room.name}</p>
              <p className="text-xs text-slate-500">Client actuel : {room.guest}</p>
              {room.hourlyRates && (
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-bold text-amber-900">
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 border border-amber-200">1H: {formatPrice(room.hourlyRates[1])}</span>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 border border-amber-200">2H: {formatPrice(room.hourlyRates[2])}</span>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 border border-amber-200">3H: {formatPrice(room.hourlyRates[3])}</span>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 border border-amber-200">4H: {formatPrice(room.hourlyRates[4])}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">{room.price} / nuit</p>
              <StatusBadge status={room.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const PhotosPanel = () => (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-orange-600">Vitrine de votre hôtel</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Photos de l'établissement</h2>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="group relative overflow-hidden rounded-2xl bg-slate-100">
            <img src={photo} alt={`Hôtel ${index + 1}`} className="h-48 w-full object-cover" />
            <button
              type="button"
              onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
              className="absolute right-3 top-3 rounded-lg bg-slate-950/80 px-3 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-5 text-center transition hover:bg-emerald-100">
          <input type="file" accept="image/*" multiple onChange={addPhotos} className="sr-only" />
          <span className="text-2xl">🖼️</span>
          <span className="mt-2 block font-black text-emerald-900">Choisir des photos</span>
        </label>
      </div>
    </section>
  );

  const EstablishmentPanel = () => (
    <div className="mt-7 space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-orange-600">Fiche établissement</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{establishment.name}</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingEstablishment((current) => !current)}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            {isEditingEstablishment ? 'Annuler' : 'Modifier l’établissement'}
          </button>
        </div>

        {establishmentSaved && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            ✓ Informations enregistrées.
          </p>
        )}

        {isEditingEstablishment ? (
          <form onSubmit={saveEstablishment} className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">Nom
                <input required value={establishment.name} onChange={(e) => setEstablishment({ ...establishment, name: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5" />
              </label>
              <label className="text-sm font-bold text-slate-700">Commune
                <input required value={establishment.commune} onChange={(e) => setEstablishment({ ...establishment, commune: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5" />
              </label>
            </div>
            <button className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600">
              Enregistrer
            </button>
          </form>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="font-bold uppercase text-slate-400">Localisation</p>
              <p className="mt-1 font-bold text-slate-900 text-sm">{establishment.commune}</p>
              <p className="text-slate-600">{establishment.address}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="font-bold uppercase text-slate-400">Contact</p>
              <p className="mt-1 font-bold text-slate-900 text-sm">{establishment.phone}</p>
              <p className="text-slate-600">{establishment.email}</p>
            </div>
          </div>
        )}
      </section>
      <PhotosPanel />
    </div>
  );

  const BoostPanel = () => (
    <section className="mt-7 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
      <div className="bg-gradient-to-r from-emerald-800 to-orange-500 p-7">
        <p className="text-xs font-black uppercase tracking-[.18em] text-orange-100">Visibilité premium</p>
        <h2 className="mt-2 text-3xl font-black">Booster mon hôtel</h2>
      </div>
      <div className="p-7">
        <p className="text-sm text-slate-300">Apparaissez en tête de recherche sur GrandH pour votre commune.</p>
        <button
          type="button"
          onClick={() => setBoosted(true)}
          className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500"
        >
          {boosted ? 'Campagne Active ✓' : 'Activer le boost'}
        </button>
      </div>
    </section>
  );

  const page =
    active === 'Planning & Calendrier' ? (
      <PlanningPanel />
    ) : active === 'Aperçu' ? (
      <Overview />
    ) : active === 'Tarifs & Court Séjour' ? (
      <RatesPanel />
    ) : active === 'Mes chambres' ? (
      <RoomsPanel />
    ) : active === 'Booster mon hôtel' ? (
      <BoostPanel />
    ) : active === 'Mon établissement' ? (
      <EstablishmentPanel />
    ) : (
      <section className="mt-7 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-950">Carnet de Réservations</h2>
        <p className="mt-2 text-xs text-slate-500">Consultez et validez les arrivées de vos clients.</p>
        <div className="mt-4 divide-y divide-slate-100 text-xs">
          {[
            { client: 'Jean Kouassi', room: 'Chambre 101', duration: '2 nuits', paid: '20 000 FCFA', status: 'En cours' },
            { client: 'Aminata Traoré', room: 'Suite 201', duration: '2 nuits', paid: '38 000 FCFA', status: 'Confirmée' },
            { client: 'Marc B.', room: 'Chambre 101', duration: 'Court séjour (3H)', paid: '12 000 FCFA', status: 'Payé' },
          ].map((r, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{r.client} · <span className="text-orange-600">{r.room}</span></p>
                <p className="text-slate-500">{r.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-700">{r.paid}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="border-b border-white/10 pb-5">
              <p className="text-xs font-black uppercase tracking-[.18em] text-orange-300">Espace propriétaire</p>
              <h1 className="mt-2 text-2xl font-black">GrandH Pro</h1>
              <p className="mt-1 text-xs text-slate-400 truncate">{establishment.name}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                📍 {establishment.commune}
              </span>
            </div>
            <nav className="mt-5 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActive(item)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-xs font-bold transition flex items-center justify-between ${
                    active === item
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-950/20'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{item}</span>
                  {item === 'Planning & Calendrier' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">⚡ Nouveau</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 rounded-2xl bg-white/10 p-4 text-xs text-slate-300">
            <p className="font-bold text-white">GeniusPay Connecté ⚡</p>
            <p className="mt-1 text-[11px] text-slate-400">Les acomptes Mobile Money (Wave, Orange, MTN) sont crédités automatiquement.</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-orange-500 p-7 text-white shadow-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-orange-100">
                {establishment.name} · {establishment.commune}
              </p>
              <h2 className="mt-2 text-3xl font-black">
                {active === 'Planning & Calendrier' ? 'Planning & Calendrier 🗓️' : active}
              </h2>
              <p className="mt-1 text-xs text-emerald-50">Gestion hôtelière et encaissements en direct.</p>
            </div>
            <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-bold border border-white/20">
              ● Établissement vérifié
            </span>
          </header>
          {page}
        </section>
      </div>
    </main>
  );
}
