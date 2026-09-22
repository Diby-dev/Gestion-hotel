import { useState, useMemo } from 'react';
import { useModal } from '../../context/ModalContext';

export default function HotelDetailModal() {
  const { hotelModal, closeHotel, showToast } = useModal();

  // Données par défaut si non spécifiées
  const hotel = hotelModal?.hotel || {
    id: 'h-default',
    name: 'Hôtel Ivoire Palace',
    commune: 'Cocody',
    address: 'Boulevard Hassan II, Cocody Ambassades, Abidjan',
    basePrice: 35000,
    rating: 4.8,
    reviewsCount: 128,
    image: '/hotel-cocody1.jpg',
    description: "Établi au cœur du prestigieux quartier de Cocody, cet établissement allie élégance ivoirienne et confort moderne. Idéal pour les séjours d'affaires et de détente, vous bénéficierez d'un service personnalisé, d'une discrétion absolue et d'installations rigoureusement certifiées.",
  };

  // État du configurateur de séjour
  const [persons, setPersons] = useState(2); // 1, 2, 3, ou 4
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(hotel.image || '/hotel-cocody1.jpg');
  const [bookingStep, setBookingStep] = useState('details'); // 'details' | 'checkout' | 'success'
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Wave');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3 Chambres fictives détaillées
  const rooms = useMemo(() => [
    {
      id: 1,
      name: 'Chambre Standard Confort',
      image: hotel.image || '/hotel-yop1.jpg',
      basePrice: hotel.basePrice || 20000,
      capacityMax: 2,
      surface: '24 m²',
      bed: '1 Lit Queen Size',
      features: ['Climatisation individuelle', 'Wi-Fi Fibre 100 Mbps', 'Douche à l\'italienne', 'TV Canal+ Écran Plat', 'Bureau de travail'],
    },
    {
      id: 2,
      name: 'Chambre Deluxe avec Balcon',
      image: '/hotel-yop2.jpg',
      basePrice: Math.round((hotel.basePrice || 20000) * 1.35),
      capacityMax: 3,
      surface: '32 m²',
      bed: '1 Lit King Size + 1 Méridienne',
      features: ['Balcon avec vue dégagée', 'Mini-bar & Bouilloire', 'Climatisation continue', 'Baignoire moderne', 'Insonorisation renforcée'],
    },
    {
      id: 3,
      name: 'Suite Exécutive Prestige',
      image: '/hotel-cocody1.jpg',
      basePrice: Math.round((hotel.basePrice || 20000) * 1.8),
      capacityMax: 4,
      surface: '48 m²',
      bed: '2 Lits King Size',
      features: ['Salon séparé avec canapé', 'Baignoire Balnéo / Jacuzzi', 'Petit-déjeuner ivoirien inclus', 'Coffre-fort électronique', 'Service d\'étage 24h/24'],
    },
  ], [hotel]);

  // Calcul du nombre de nuits
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  // Calcul du prix ajusté selon le nombre de personnes et la chambre sélectionnée
  const currentRoom = rooms[selectedRoomIndex] || rooms[0];
  const personMultiplier = persons === 1 ? 0.95 : persons === 2 ? 1 : persons === 3 ? 1.2 : 1.35;
  const pricePerNight = Math.round(currentRoom.basePrice * personMultiplier);
  const totalPrice = pricePerNight * nights;
  const acompte = Math.round(totalPrice * 0.2); // 20% d'acompte
  const soldeArrivee = totalPrice - acompte;

  if (!hotelModal.isOpen) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingStep('success');
      showToast(`Réservation validée pour ${hotel.name} ! Acompte confirmé.`);
    }, 900);
  };

  const handleModalClose = () => {
    setBookingStep('details');
    closeHotel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Fenêtre principale */}
      <div 
        className="relative w-full max-w-5xl bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* BARRE SUPÉRIEURE / EN-TÊTE */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                Réservation Immédiate • {hotel.commune}
              </span>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                {hotel.name}
              </h2>
            </div>
          </div>
          
          <button
            onClick={handleModalClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors text-lg"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* CORPS DE LA MODALE AVEC DÉFILEMENT INTERNE */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 flex-1">
          
          {bookingStep === 'success' ? (
            /* ÉCRAN DE CONFIRMATION SUCCÈS */
            <div className="text-center py-12 px-4 max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
                ✓
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                  Réservation validée avec succès !
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  À très bientôt à {hotel.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Un SMS et message WhatsApp de confirmation vous ont été envoyés avec le récapitulatif de votre séjour.
                </p>
              </div>

              {/* Fiche récapitulative */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left text-sm space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Code Réservation</span>
                  <span className="font-mono font-bold text-green-700">GH-ABJ-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chambre</span>
                  <span className="font-medium text-gray-800">{currentRoom.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Période</span>
                  <span className="font-medium text-gray-800">{nights} nuit(s) ({checkIn} ➔ {checkOut})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium text-gray-800">{guestName || 'Client GrandH'} ({guestPhone || '+225 07000000'})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Acompte payé ({paymentMethod})</span>
                  <span className="font-bold text-green-600">{acompte.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Solde à régler à l'accueil de l'hôtel</span>
                  <span className="font-semibold text-gray-700">{soldeArrivee.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button
                onClick={handleModalClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Terminer et retourner aux hôtels
              </button>
            </div>
          ) : bookingStep === 'checkout' ? (
            /* FORMULAIRE DE PAIEMENT D'ACOMPTE MOBILE MONEY */
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <button
                onClick={() => setBookingStep('details')}
                className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 mb-2 cursor-pointer"
              >
                ← Revenir aux détails de l'hôtel
              </button>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Finaliser votre réservation
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Versez un acompte sécurisé de 20% pour bloquer immédiatement votre chambre.
                </p>
              </div>

              {/* Récapitulatif tarifaire express */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center justify-between text-sm">
                <div>
                  <p className="font-bold text-gray-900">{currentRoom.name}</p>
                  <p className="text-xs text-gray-600">{nights} nuit(s) pour {persons} personne(s)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-orange-600 uppercase font-bold block">Acompte requis (20%)</span>
                  <span className="text-xl font-extrabold text-orange-600">{acompte.toLocaleString()} FCFA</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Nom & Prénoms du client *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé Jean-Marc"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Numéro de téléphone WhatsApp / Mobile Money *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 07 00 11 22 33"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Moyen de paiement de l'acompte (Côte d'Ivoire) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money'].map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === method
                            ? 'border-green-600 bg-green-50 text-green-700 ring-2 ring-green-500/20'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">🛡️ Garantie Sérénité GrandH :</p>
                  <p>• Annulation gratuite jusqu'à 24h avant l'arrivée.</p>
                  <p>• Solde restant ({soldeArrivee.toLocaleString()} FCFA) payable directement à la réception de l'hôtel.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 active:scale-98 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-green-600/25 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Confirmation en cours...</span>
                  ) : (
                    <span>Valider et Payer l'acompte de {acompte.toLocaleString()} FCFA</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* VUE COMPLÈTE DE L'HÔTEL */
            <>
              {/* 1. GALERIE PHOTOS ET INFORMATIONS CLÉS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Grande photo principale */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-gray-100 relative group">
                    <img 
                      src={activeImage} 
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow">
                      <span>★ {hotel.rating || 4.8}</span>
                      <span className="text-gray-300">({hotel.reviewsCount || 128} avis vérifiés)</span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
                      Établissement certifié 24/7
                    </div>
                  </div>

                  {/* Bandeau de miniatures */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[hotel.image || '/hotel-cocody1.jpg', '/hotel-yop1.jpg', '/hotel-yop2.jpg', '/stat.jpg'].map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeImage === img ? 'border-green-600 ring-2 ring-green-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Encadré d'adresse & description rapide */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-orange-600 tracking-wider">
                      Localisation & Atouts
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                      <span>📍</span>
                      <span>{hotel.address || `${hotel.commune}, Abidjan, Côte d'Ivoire`}</span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 leading-relaxed">
                      {hotel.description}
                    </div>
                  </div>

                  {/* Points forts */}
                  <div className="space-y-2 pt-2 border-t border-gray-200 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Groupe électrogène de secours certifié</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Climatisation révisée & Eau chaude garantie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Parking sécurisé & Gardiennage 24h/24</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
                    <span className="text-xs text-gray-500">Tarif de base indicatif</span>
                    <p className="text-xl font-extrabold text-green-600">
                      {(hotel.basePrice || 20000).toLocaleString()} FCFA <span className="text-xs text-gray-500 font-normal">/ nuit</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* 2. CONFIGURATEUR DE SÉJOUR : Nbre de personnes & Dates */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                    Étape 1 : Configurez votre séjour
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Choisissez la durée et le nombre de personnes
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  {/* Nombre de personnes (1 à 4) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Nombre de personne(s)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => setPersons(num)}
                          className={`py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                            persons === num
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                          }`}
                        >
                          {num} {num === 1 ? 'pers.' : 'pers.'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date d'arrivée */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Date d'arrivée (Check-in)
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Date de départ */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Date de départ (Check-out)
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                </div>

                {/* Synthèse rapide */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 text-xs text-gray-300 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-green-500/20 text-green-400 font-bold">
                      {nights} Nuit(s)
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-white">{persons} Client(s)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 mr-2">Total estimé pour {currentRoom.name} :</span>
                    <span className="text-base font-extrabold text-white">{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              {/* 3. LES 3 CHAMBRES FICTIVES DISPONIBLES */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Étape 2 : Sélectionnez votre chambre
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    3 Chambres disponibles pour votre séjour
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {rooms.map((room, index) => {
                    const roomPrice = Math.round(room.basePrice * personMultiplier);
                    const isSelected = selectedRoomIndex === index;

                    return (
                      <div 
                        key={room.id}
                        className={`rounded-2xl border transition-all flex flex-col overflow-hidden ${
                          isSelected 
                            ? 'border-green-600 shadow-xl ring-2 ring-green-600/30 bg-green-50/20' 
                            : 'border-gray-200 bg-white hover:shadow-md'
                        }`}
                      >
                        {/* Image de la chambre */}
                        <div className="h-44 bg-gray-200 relative overflow-hidden">
                          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                            {room.surface}
                          </span>
                        </div>

                        {/* Contenu */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 text-base leading-snug">
                                {room.name}
                              </h4>
                            </div>
                            
                            <p className="text-xs text-orange-600 font-semibold">
                              🛏️ {room.bed}
                            </p>

                            {/* Équipements de la chambre */}
                            <ul className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
                              {room.features.map((feat, fi) => (
                                <li key={fi} className="flex items-center gap-1.5">
                                  <span className="text-green-600">✓</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Prix & Bouton de sélection */}
                          <div className="pt-3 border-t border-gray-100 space-y-3">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs text-gray-500">Par nuit :</span>
                              <span className="text-lg font-extrabold text-green-600">
                                {roomPrice.toLocaleString()} FCFA
                              </span>
                            </div>

                            <button
                              onClick={() => setSelectedRoomIndex(index)}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-green-600 text-white shadow-sm'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              {isSelected ? '✓ Chambre sélectionnée' : 'Choisir cette chambre'}
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. EMPLACEMENT GOOGLE MAPS FICTIF MAIS RÉALISTE */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Localisation & Accès
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    Emplacement sur le plan d'Abidjan
                  </h3>
                </div>

                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                  {/* Carte simulée réaliste stylisée */}
                  <div className="relative w-full h-64 bg-slate-800 flex items-center justify-center overflow-hidden">
                    
                    {/* Motif de carte en arrière-plan */}
                    <div 
                      className="absolute inset-0 opacity-40 bg-cover bg-center"
                      style={{ backgroundImage: "url('/yopougon.png')" }}
                    />
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />

                    {/* Badge Google Maps & Repère interactif */}
                    <div className="relative z-10 text-center space-y-3 p-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white text-2xl shadow-xl animate-bounce">
                        📍
                      </div>
                      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-sm text-left border border-gray-100">
                        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                          <span className="text-xs font-bold text-gray-900">{hotel.name}</span>
                          <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">Ouvert 24/7</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1.5">
                          {hotel.address || `${hotel.commune}, Abidjan, Côte d'Ivoire`}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Coordonnées GPS : 5.3484° N, 4.0305° W
                        </p>
                      </div>
                    </div>

                    {/* Bouton d'ouverture Google Map */}
                    <div className="absolute bottom-3 right-3 z-20">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.commune + ' Abidjan')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-gray-50 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-lg shadow-md inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>🗺️ Ouvrir dans Google Maps</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                    <p>💡 À 5 minutes des grands axes de {hotel.commune}, taxi et transports accessibles immédiatement.</p>
                    <button 
                      onClick={() => showToast('Itinéraire copié dans le presse-papier !')}
                      className="text-green-600 font-bold hover:underline cursor-pointer shrink-0"
                    >
                      Copier l'adresse
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. BANDEAU D'ACTION FINAL ET VALIDATION */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 -mx-4 sm:-mx-6 md:-mx-8 -mb-4 sm:-mb-6 md:-mb-8 border-t border-gray-200 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-green-600">{totalPrice.toLocaleString()} FCFA</span>
                    <span className="text-xs text-gray-500">pour {nights} nuit(s) ({persons} pers.)</span>
                  </div>
                  <p className="text-xs text-orange-600 font-medium">
                    Acompte de confirmation : <strong>{acompte.toLocaleString()} FCFA</strong> (20%) via Mobile Money
                  </p>
                </div>

                <button
                  onClick={() => setBookingStep('checkout')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-700 active:scale-98 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-green-600/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Réserver cette chambre maintenant</span>
                  <span>➔</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
