import { useMemo, useState, type FormEvent } from 'react';
import { getHotelById } from '../../data/hotels';
import { useModal } from '../../context/ModalContext';

const formatPrice = (price: number) => `${Math.round(price).toLocaleString()} FCFA`;

interface BookingPageProps {
  hotelId?: string;
}

interface RoomOption {
  id: string;
  name: string;
  type: string;
  dailyPrice: number;
  hourlyBasePrice: number;
  image: string;
  features: string[];
}

interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export default function BookingPage({ hotelId }: BookingPageProps) {
  const hotel = hotelId ? getHotelById(hotelId) : undefined;
  const { navigate } = useModal();

  // Liste des 3 chambres de l'hôtel avec images existantes et prix adaptés
  const rooms: RoomOption[] = useMemo(() => {
    const base = hotel ? hotel.basePrice : 20000;
    return [
      {
        id: 'standard',
        name: 'Chambre Standard Confort',
        type: 'Standard',
        dailyPrice: base,
        hourlyBasePrice: Math.round(base * 0.35),
        image: hotel?.image || '/hotel-yop1.jpg',
        features: ['Lit Double Queen size', 'Climatisation continue', 'Wi-Fi haut débit', 'Douche eau chaude'],
      },
      {
        id: 'deluxe',
        name: 'Chambre Deluxe Supérieure',
        type: 'Deluxe',
        dailyPrice: Math.round(base * 1.25),
        hourlyBasePrice: Math.round(base * 1.25 * 0.35),
        image: '/hotel-yop2.jpg',
        features: ['Grand Lit King size', 'Smart TV écran plat', 'Mini-bar & Réfrigérateur', 'Coin bureau feutré'],
      },
      {
        id: 'prestige',
        name: 'Suite Prestige & Détente',
        type: 'Suite',
        dailyPrice: Math.round(base * 1.6),
        hourlyBasePrice: Math.round(base * 1.6 * 0.35),
        image: '/hotel-cocody1.jpg',
        features: ['Salon privatif', 'Baignoire & Eau chaude', 'Vue dégagée / Balcon', 'Room service prioritaire'],
      },
    ];
  }, [hotel]);

  // Chambre sélectionnée
  const [selectedRoomId, setSelectedRoomId] = useState<string>('standard');
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Choix du mode de séjour : 'days' (Jours / Nuitées) ou 'hours' (Heures / Passage)
  const [durationMode, setDurationMode] = useState<'days' | 'hours'>('days');

  // Réservation en jours
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().slice(0, 10);
  });

  // Réservation en heures (Passage)
  const [passageDate, setPassageDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [passageTime, setPassageTime] = useState('14:00');
  const [passageHours, setPassageHours] = useState<number>(3); // 2h, 3h, 4h, 6h, etc.

  // Informations client
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // Avis clients & formulaire d'avis
  const defaultReviews: CustomerReview[] = useMemo(
    () => [
      {
        id: 'rev-1',
        author: 'Kouamé Eric',
        rating: 5,
        date: 'Il y a 3 jours',
        comment: 'Très bon accueil, chambre climatisée et propre avec eau chaude. La literie est super confortable.',
      },
      {
        id: 'rev-2',
        author: 'Fatou Diop',
        rating: 4,
        date: 'Il y a 1 semaine',
        comment: 'Séjour agréable et quartier sécurisé. Le personnel est réactif et courtois.',
      },
    ],
    []
  );

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    if (!hotelId) return defaultReviews;
    try {
      const saved = localStorage.getItem(`grandh_reviews_${hotelId}`);
      return saved ? JSON.parse(saved) : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  // Formulaire d'avis client
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Calcul du nombre de nuits si mode jours
  const nights = useMemo(
    () => Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)),
    [checkIn, checkOut]
  );

  // Calcul du montant total
  const total = useMemo(() => {
    if (durationMode === 'days') {
      const guestMultiplier = guests > 2 ? 1.15 : 1;
      return selectedRoom.dailyPrice * nights * guestMultiplier;
    } else {
      // Tarif en heures : tarif de base de passage + heures supplémentaires
      // 2h = base, 3h = +30%, 4h = +60%, 6h = +100%
      const multiplier =
        passageHours <= 2 ? 1 : passageHours === 3 ? 1.3 : passageHours === 4 ? 1.6 : passageHours <= 6 ? 2.1 : 2.6;
      return Math.round(selectedRoom.hourlyBasePrice * multiplier);
    }
  }, [durationMode, selectedRoom, nights, guests, passageHours]);

  const deposit = Math.round(total * 0.2); // Acompte de 20%

  // Soumission de réservation
  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  // Soumission d'un avis client
  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      date: "Aujourd'hui",
      comment: reviewComment.trim(),
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    if (hotelId) {
      try {
        localStorage.setItem(`grandh_reviews_${hotelId}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  if (!hotel) {
    return (
      <main className="min-h-screen p-10 text-center">
        <h1 className="text-2xl font-bold">Hôtel introuvable</h1>
        <button onClick={() => navigate('/')} className="mt-5 text-green-700 underline">
          Retour à l'accueil
        </button>
      </main>
    );
  }

  // Écran de confirmation de réservation
  if (confirmed) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <section className="mx-auto mt-14 max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-200">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-700">
            ✓
          </div>
          <span className="mt-5 inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            Réservation enregistrée
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">Demande de réservation reçue</h1>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Merci <strong>{name}</strong> ! Votre demande pour <strong>{hotel.name}</strong> a bien été prise en compte.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Chambre retenue :</span>
              <strong className="text-slate-900">{selectedRoom.name}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Formule :</span>
              <strong className="text-slate-900">
                {durationMode === 'days'
                  ? `Séjour de ${nights} nuit(s) (du ${checkIn} au ${checkOut})`
                  : `Passage de ${passageHours}h (le ${passageDate} à ${passageTime})`}
              </strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Total séjour :</span>
              <strong className="text-slate-900 text-sm">{formatPrice(total)}</strong>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Acompte de confirmation (20 %) :</span>
              <span>{formatPrice(deposit)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              Retour aux hôtels
            </button>
            <button
              onClick={() => setConfirmed(false)}
              className="rounded-xl border border-slate-300 py-3.5 px-5 font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Modifier
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header supérieur */}
      <header className="bg-slate-900 px-5 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button onClick={() => navigate('/')} className="text-sm text-green-300 hover:text-white flex items-center gap-1.5 font-medium transition">
            <span>←</span>
            <span>Retour à l'accueil</span>
          </button>
          <span className="font-bold text-sm">GrandH · Réservation & Détails Hôtel</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-8">

        {/* SECTION 1 : BANNIÈRE DE L'HÔTEL */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-md border border-slate-200">
          <div className="relative h-72 sm:h-96 w-full bg-slate-200">
            <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  📍 {hotel.commune}
                </span>
                <h1 className="mt-2 text-3xl sm:text-4xl font-black">{hotel.name}</h1>
                <p className="mt-1 text-sm text-slate-200">📍 {hotel.address}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/20 text-right shrink-0">
                <p className="text-xs uppercase tracking-wider text-green-300 font-bold">À partir de</p>
                <p className="text-2xl font-black text-white">{formatPrice(hotel.basePrice)} <span className="text-xs font-normal text-slate-300">/ nuit</span></p>
                <p className="text-xs text-orange-400 font-semibold mt-0.5">ou {formatPrice(Math.round(hotel.basePrice * 0.35))} / passage</p>
              </div>
            </div>
          </div>
          <div className="p-6 text-slate-700 text-sm leading-relaxed border-t border-slate-100">
            <p>{hotel.description}</p>
          </div>
        </section>

        {/* SECTION 2 : LES 3 IMAGES DE CHAMBRES AVEC LEURS PRIX */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-green-700">Hébergements disponibles</span>
              <h2 className="text-2xl font-black text-slate-900">Choisissez votre chambre</h2>
              <p className="text-xs text-slate-500">
                Cliquez sur une chambre pour calculer instantanément le tarif selon votre durée.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              3 types de chambres disponibles
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              return (
                <article
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 border-2 flex flex-col justify-between ${
                    isSelected
                      ? 'border-green-600 ring-4 ring-green-100 shadow-md scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {isSelected && (
                        <span className="absolute top-3 left-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                          ✓ Sélectionnée
                        </span>
                      )}
                      <span className="absolute top-3 right-3 rounded-xl bg-black/70 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white">
                        {room.type}
                      </span>
                      <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-black/60 backdrop-blur-xs px-3 py-1.5 text-white flex justify-between items-center text-xs">
                        <span>Nuitée : <strong>{formatPrice(room.dailyPrice)}</strong></span>
                        <span className="text-green-300">Passage : <strong>{formatPrice(room.hourlyBasePrice)}</strong></span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-black text-slate-900">{room.name}</h3>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {room.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      className={`w-full rounded-xl py-2.5 text-xs font-bold transition ${
                        isSelected
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Chambre choisie' : 'Sélectionner cette chambre'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 3 : FORMULAIRE DE RÉSERVATION AVEC CHOIX EN HEURES OU EN JOURS */}
        <section className="grid gap-7 lg:grid-cols-5">
          <form onSubmit={handleBooking} className="rounded-3xl bg-white p-6 sm:p-8 shadow-md border border-slate-200 lg:col-span-3 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Formulaire de réservation</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Détails de votre séjour</h2>
              <p className="text-xs text-slate-500">
                Chambre choisie : <strong className="text-slate-800">{selectedRoom.name}</strong>
              </p>
            </div>

            {/* SÉLECTEUR DE TYPE DE DURÉE : JOURS OU HEURES */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Mode de réservation (Temps passé) *
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setDurationMode('days')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
                    durationMode === 'days'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📅</span>
                  <span>En jours (Nuitées)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDurationMode('hours')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
                    durationMode === 'hours'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🕒</span>
                  <span>En heures (Passage)</span>
                </button>
              </div>
            </div>

            {/* CHAMPS DÉPENDANTS DU MODE */}
            {durationMode === 'days' ? (
              /* Option 1 : En Jours */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <label className="text-xs font-bold text-slate-700">
                  Date d'arrivée
                  <input
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-green-600"
                  />
                </label>
                <label className="text-xs font-bold text-slate-700">
                  Date de départ
                  <input
                    required
                    min={checkIn}
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-green-600"
                  />
                </label>
                <div className="sm:col-span-2 text-xs text-slate-500 font-medium">
                  Durée totale : <strong className="text-slate-800">{nights} nuit(s)</strong>
                </div>
              </div>
            ) : (
              /* Option 2 : En Heures (Passage) */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-amber-50/60 p-4 border border-amber-200">
                <label className="text-xs font-bold text-slate-700">
                  Date du passage
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={passageDate}
                    onChange={(e) => setPassageDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white p-2.5 text-sm outline-none focus:border-green-600"
                  />
                </label>
                <label className="text-xs font-bold text-slate-700">
                  Heure d'arrivée
                  <input
                    required
                    type="time"
                    value={passageTime}
                    onChange={(e) => setPassageTime(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white p-2.5 text-sm outline-none focus:border-green-600"
                  />
                </label>
                <label className="text-xs font-bold text-slate-700">
                  Nombre d'heures
                  <select
                    value={passageHours}
                    onChange={(e) => setPassageHours(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white p-2.5 text-sm outline-none focus:border-green-600"
                  >
                    <option value="2">2 heures (Express)</option>
                    <option value="3">3 heures (Standard)</option>
                    <option value="4">4 heures (Détente)</option>
                    <option value="6">6 heures (Demi-journée)</option>
                    <option value="8">8 heures (Journée)</option>
                  </select>
                </label>
                <div className="sm:col-span-3 text-xs text-amber-800 font-medium">
                  ⚡ Formule passage court : accès complet à la chambre et à ses équipements pendant {passageHours}h.
                </div>
              </div>
            )}

            {/* INFORMATIONS CLIENT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-slate-700">
                Nombre de personnes
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-green-600"
                >
                  <option value="1">1 personne</option>
                  <option value="2">2 personnes</option>
                  <option value="3">3 personnes</option>
                  <option value="4">4 personnes</option>
                </select>
              </label>

              <label className="text-xs font-bold text-slate-700">
                Téléphone (WhatsApp / Appel) *
                <input
                  required
                  type="tel"
                  placeholder="+225 07 00 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-green-600"
                />
              </label>

              <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                Nom complet du client *
                <input
                  required
                  placeholder="Ex: Kouamé Jean-Marc"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-green-600"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700 active:scale-[0.98]"
            >
              Confirmer la réservation
            </button>
          </form>

          {/* RÉCAPITULATIF FINANCIER & SÉCURITÉ */}
          <section className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Récapitulatif tarifaire</h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Chambre :</span>
                  <strong className="text-slate-900">{selectedRoom.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Formule :</span>
                  <strong className="text-slate-900">
                    {durationMode === 'days' ? `${nights} nuit(s)` : `Passage de ${passageHours} heures`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Commune :</span>
                  <strong className="text-orange-600 font-bold">{hotel.commune}</strong>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                  <span>Total à régler :</span>
                  <span className="text-base text-slate-900">{formatPrice(total)}</span>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-emerald-800 space-y-1">
                  <div className="flex justify-between font-bold text-xs">
                    <span>Acompte de confirmation (20%) :</span>
                    <span>{formatPrice(deposit)}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600">Le solde ({formatPrice(total - deposit)}) se règle à votre arrivée.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-green-400">Garanties GrandH</p>
              <h4 className="text-sm font-bold">Séjour vérifié & sécurisé</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Les chambres correspondent fidèlement aux photos. Accueil garanti 24h/24 à votre arrivée.
              </p>
            </div>
          </section>
        </section>

        {/* SECTION 4 : AVIS CLIENTS & FORMULAIRE POUR LAISSER UNE NOTE EN ÉTOILES ET UN COMMENTAIRE */}
        <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-md border border-slate-200 space-y-7">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Expérience & Avis</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Avis des clients</h2>
            <p className="text-xs text-slate-500">
              Découvrez les retours des voyageurs et laissez votre propre évaluation pour cet établissement.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Formulaire pour laisser son commentaire et ses étoiles */}
            <form onSubmit={handleAddReview} className="rounded-2xl bg-slate-50 p-5 sm:p-6 border border-slate-200 lg:col-span-2 space-y-4">
              <h3 className="text-base font-black text-slate-900">Donner votre avis</h3>
              <p className="text-xs text-slate-500">
                Attribuez une note en étoiles et partagez votre expérience.
              </p>

              {reviewSubmitted && (
                <div className="rounded-xl bg-green-100 p-3 text-xs font-bold text-green-800 border border-green-200">
                  ✓ Merci ! Votre avis a été enregistré avec succès.
                </div>
              )}

              {/* Champ note en étoiles interactive */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Votre note en étoiles *
                </label>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="text-2xl transition hover:scale-125 focus:outline-none"
                    >
                      <span className={star <= reviewRating ? 'text-amber-400' : 'text-slate-300'}>★</span>
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">{reviewRating} / 5 étoiles</span>
                </div>
              </div>

              {/* Nom du client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Votre nom ou pseudo *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Awa Diabaté"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-green-600"
                />
              </div>

              {/* Commentaire du client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Votre commentaire *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Partagez vos impressions sur la propreté, le calme, le confort..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-green-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
              >
                Publier mon commentaire
              </button>
            </form>

            {/* Liste des avis existants */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-base font-black text-slate-900">
                Commentaires récents ({reviews.length})
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-slate-900">{rev.author}</p>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400 text-sm">
                      {'★'.repeat(rev.rating)}
                      <span className="text-slate-300">{'★'.repeat(5 - rev.rating)}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
