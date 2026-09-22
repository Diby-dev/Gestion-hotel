import { useMemo, useState, type FormEvent } from 'react';
import { getHotelById } from '../../data/hotels';
import { useModal } from '../../context/ModalContext';

const formatPrice = (price: number) => `${price.toLocaleString()} FCFA`;

interface BookingPageProps {
  hotelId?: string;
}

export default function BookingPage({ hotelId }: BookingPageProps) {
  const hotel = hotelId ? getHotelById(hotelId) : undefined;
  const { navigate } = useModal();
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().slice(0, 10);
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const nights = useMemo(
    () => Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)),
    [checkIn, checkOut]
  );
  const total = hotel ? hotel.basePrice * nights * (guests > 2 ? 1.2 : 1) : 0;
  const deposit = Math.round(total * 0.2);

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
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

  if (confirmed) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <section className="mx-auto mt-16 max-w-lg rounded-3xl bg-white p-9 text-center shadow-xl">
          <div className="text-5xl text-green-600">✓</div>
          <h1 className="mt-4 text-2xl font-bold">Demande de réservation reçue</h1>
          <p className="mt-3 text-slate-600">
            {hotel.name} · {nights} nuit(s) · acompte : {formatPrice(deposit)}.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-7 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
          >
            Retour aux hôtels
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 px-5 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button onClick={() => navigate('/')} className="text-sm text-green-300 hover:text-white">
            ← Accueil
          </button>
          <span className="font-bold">GrandH · Réservation</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-7 p-5 py-9 lg:grid-cols-5">
        <section className="overflow-hidden rounded-3xl bg-white shadow-lg lg:col-span-3">
          <img src={hotel.image} alt={hotel.name} className="h-64 w-full object-cover" />
          <div className="p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">{hotel.commune}</p>
            <h1 className="mt-1 text-3xl font-bold">{hotel.name}</h1>
            <p className="mt-3 text-slate-600">{hotel.description}</p>
            <p className="mt-5 text-sm">📍 {hotel.address}</p>
            <p className="mt-5 text-xl font-extrabold text-green-700">
              {formatPrice(hotel.basePrice)} <span className="text-sm font-normal text-slate-500">/ nuit</span>
            </p>
          </div>
        </section>

        <form onSubmit={handleBooking} className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-2">
          <h2 className="text-xl font-bold">Votre séjour</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">
              Arrivée
              <input
                required
                min={new Date().toISOString().slice(0, 10)}
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </label>
            <label className="text-sm font-semibold">
              Départ
              <input
                required
                min={checkIn}
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </label>
          </div>
          <label className="mt-4 block text-sm font-semibold">
            Clients
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="1">1 personne</option>
              <option value="2">2 personnes</option>
              <option value="3">3 personnes</option>
              <option value="4">4 personnes</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Nom complet
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Téléphone
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>
          <div className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">
            <div className="flex justify-between">
              <span>{nights} nuit(s)</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="mt-2 flex justify-between text-green-700">
              <span>Acompte (20 %)</span>
              <strong>{formatPrice(deposit)}</strong>
            </div>
          </div>
          <button className="mt-6 w-full rounded-xl bg-green-600 py-3.5 font-bold text-white transition hover:bg-green-700">
            Confirmer la réservation
          </button>
        </form>
      </div>
    </main>
  );
}
