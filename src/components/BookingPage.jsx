import { useMemo, useState } from 'react';
import { getHotelById } from '../data/hotels';
import { useModal } from '../context/ModalContext';
import GeniusPayCheckoutModal from './GeniusPayCheckoutModal';

const shortStayRates = { 1: 1000, 2: 2000, 3: 4000, 4: 5000 };
const formatPrice = (price) => `${Number(price).toLocaleString('fr-FR')} FCFA`;

export default function BookingPage({ hotelId }) {
  const hotel = getHotelById(hotelId);
  const { navigate } = useModal();
  const [stayType, setStayType] = useState('night');
  const [hours, setHours] = useState(1);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => { const date = new Date(); date.setDate(date.getDate() + 1); return date.toISOString().slice(0, 10); });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [confirmed, setConfirmed] = useState(false);
  const [isGeniusPayOpen, setIsGeniusPayOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const isShortStay = stayType === 'hour';
  const nights = useMemo(() => Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)), [checkIn, checkOut]);
  const hotelAmount = hotel ? (isShortStay ? shortStayRates[hours] : hotel.basePrice * nights * (guests > 2 ? 1.2 : 1)) : 0;
  const deposit = Math.round(hotelAmount * 0.5);
  const siteFee = 60;
  const apiFee = 40;
  const payableNow = deposit + siteFee + apiFee;
  const staySummary = isShortStay ? `${hours} heure${hours > 1 ? 's' : ''}` : `${nights} nuit(s)`;
  const whatsappUrl = `https://wa.me/2250707070707?text=${encodeURIComponent(`Bonjour, je souhaite réserver ${staySummary} à ${hotel?.name || 'votre hôtel'}.`)}`;

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (paymentMethod === 'whatsapp') {
      window.open(whatsappUrl, '_blank');
      setConfirmed(true);
    } else {
      setIsGeniusPayOpen(true);
    }
  };

  const handlePaymentSuccess = (txId, method) => {
    setPaymentInfo({ txId, method });
    setIsGeniusPayOpen(false);
    setConfirmed(true);
  };

  if (!hotel) return <main className="min-h-screen p-10 text-center"><h1 className="text-2xl font-bold">Hôtel introuvable</h1><button onClick={() => navigate('/')} className="mt-5 text-emerald-700 underline">Retour à l'accueil</button></main>;
  if (confirmed) return (
    <main className="min-h-screen bg-[#f7f3ea] p-6">
      <section className="mx-auto mt-16 max-w-lg rounded-3xl bg-white p-9 text-center shadow-xl">
        <div className="text-5xl text-emerald-600">✓</div>
        <h1 className="mt-4 text-2xl font-black">Demande de réservation reçue</h1>
        <p className="mt-3 text-slate-600">{hotel.name} · {staySummary}</p>
        
        {paymentInfo ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 space-y-1 text-left">
            <p className="font-bold text-emerald-800 flex items-center gap-1.5">
              <span>⚡</span> Paiement validé par GeniusPay
            </p>
            <p>Opérateur : <strong>{paymentInfo.method.toUpperCase()}</strong></p>
            <p className="font-mono text-[11px] text-slate-600">Transaction : {paymentInfo.txId}</p>
            <p className="text-emerald-700 font-bold">Acompte encaissé : {formatPrice(payableNow)}</p>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm">
            <p className="font-bold text-emerald-900">Acompte à régler : {formatPrice(payableNow)}</p>
            <p className="mt-1 text-slate-600">Acompte hôtel de 50 % + frais de plateforme.</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => navigate('/client/tableau-de-bord')}
            className="w-full rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition"
          >
            Accéder à mon espace client & Télécharger le reçu PDF →
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Retour aux hôtels
          </button>
        </div>
      </section>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <header className="bg-slate-950 px-5 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button onClick={() => navigate('/')} className="text-sm text-orange-300 hover:text-white">← Accueil</button>
          <span className="font-bold">GrandH · Réservation</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-7 p-5 py-9 lg:grid-cols-5">
        <section className="overflow-hidden rounded-3xl bg-white shadow-lg lg:col-span-3">
          <img src={hotel.image} alt={hotel.name} className="h-64 w-full object-cover" />
          <div className="p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">{hotel.commune}</p>
            <h1 className="mt-1 text-3xl font-black">{hotel.name}</h1>
            <p className="mt-3 text-slate-600">{hotel.description}</p>
            <p className="mt-5 text-sm">📍 {hotel.address}</p>
            <p className="mt-5 text-xl font-extrabold text-emerald-700">
              {formatPrice(hotel.basePrice)} <span className="text-sm font-normal text-slate-500">/ nuit</span>
            </p>
            <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-sm font-black text-slate-900">Choisissez votre durée</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStayType('night')}
                  className={`rounded-xl px-4 py-2 text-sm font-bold ${!isShortStay ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  La nuit
                </button>
                {Object.entries(shortStayRates).map(([duration, price]) => (
                  <button
                    type="button"
                    key={duration}
                    onClick={() => { setStayType('hour'); setHours(Number(duration)); }}
                    className={`rounded-xl px-4 py-2 text-sm font-bold ${isShortStay && hours === Number(duration) ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'}`}
                  >
                    {duration} h · {formatPrice(price)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmitBooking} className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-2">
          <h2 className="text-xl font-black">Votre réservation</h2>
          {isShortStay ? (
            <div className="mt-5 rounded-xl bg-orange-50 p-4 text-sm">
              <p className="font-bold">Court séjour : {staySummary}</p>
              <p className="mt-1 text-orange-700">Tarif hôtel : {formatPrice(hotelAmount)}</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">Arrivée
                <input required min={new Date().toISOString().slice(0, 10)} type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-1 w-full rounded-lg border p-2" />
              </label>
              <label className="text-sm font-semibold">Départ
                <input required min={checkIn} type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-1 w-full rounded-lg border p-2" />
              </label>
            </div>
          )}

          <label className="mt-4 block text-sm font-semibold">Clients
            <select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="mt-1 w-full rounded-lg border p-2">
              <option value="1">1 personne</option>
              <option value="2">2 personnes</option>
              <option value="3">3 personnes</option>
              <option value="4">4 personnes</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-semibold">Nom complet
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Kouamé Jean" className="mt-1 w-full rounded-lg border p-2" />
          </label>

          <label className="mt-4 block text-sm font-semibold">Téléphone
            <input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Ex: 0700000000" className="mt-1 w-full rounded-lg border p-2" />
          </label>

          <div className="mt-5">
            <p className="text-sm font-bold">Mode de paiement de l'acompte</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile-money')}
                className={`rounded-xl border p-3 text-sm font-bold flex items-center justify-center gap-1.5 ${paymentMethod === 'mobile-money' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200'}`}
              >
                <span>⚡</span> GeniusPay (Wave, OM, MTN)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('whatsapp')}
                className={`rounded-xl border p-3 text-sm font-bold flex items-center justify-center gap-1.5 ${paymentMethod === 'whatsapp' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200'}`}
              >
                <span>💬</span> WhatsApp gérant
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950 p-4 text-sm text-white space-y-2">
            <div className="flex justify-between"><span>Tarif hébergement ({staySummary})</span><strong>{formatPrice(hotelAmount)}</strong></div>
            <div className="flex justify-between text-orange-200"><span>Acompte à régler en ligne</span><strong>{formatPrice(payableNow)}</strong></div>
            <p className="text-[11px] text-emerald-300 pt-1 border-t border-white/10">
              Paiement direct sécurisé via <strong>GeniusPay</strong> (Wave, Orange Money, MTN MoMo, Moov).
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 font-black text-white hover:brightness-110 shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{paymentMethod === 'whatsapp' ? 'Réserver et contacter le gérant' : `Payer l'acompte (${formatPrice(payableNow)}) avec GeniusPay`}</span>
          </button>
        </form>
      </div>

      {/* MODALE CHECKOUT GENIUSPAY */}
      <GeniusPayCheckoutModal
        isOpen={isGeniusPayOpen}
        onClose={() => setIsGeniusPayOpen(false)}
        amount={payableNow}
        hotelName={hotel.name}
        roomName={staySummary}
        customerName={name || 'Client GrandH'}
        customerPhone={phone || '0700000000'}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </main>
  );
}
