import { useState, useMemo } from 'react';
import Reveal from './Reveal';
import { useModal } from '../context/ModalContext';

export default function SidebarreZonne() {
  const { navigate } = useModal();

  const [openPrix, setOpenPrix] = useState(false);
  const [openNom, setOpenNom] = useState(true);
  const [openQuartier, setOpenQuartier] = useState(false);
  const [openStanding, setOpenStanding] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Filtres actifs
  const [searchNom, setSearchNom] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('all');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null);
  const [selectedStanding, setSelectedStanding] = useState(null);

  // Données complètes des hôtels
  const allHotels = [
    {
      id: 'hotel-yop-1',
      name: 'Residence meublée du boss',
      commune: 'Yopougon',
      address: 'Yopougon Selmer, près du Nouveau Marché, Abidjan',
      basePrice: 20000,
      rating: 4.5,
      stars: 3,
      reviewsCount: 84,
      image: '/hotel-yop1.jpg',
      shortDesc: 'Chambre propre, climatisée et économique au cœur de Yopougon.',
      description: 'Située dans un quartier calme et sécurisé de Yopougon, cette résidence meublée propose des chambres modernes et climatisées avec groupe électrogène permanent, eau chaude garantie et parking surveillé 24h/24.',
    },
    {
      id: 'hotel-yop-2',
      name: 'Palais de Niangon',
      commune: 'Yopougon',
      address: 'Niangon Sud à droite, Carrefour Lubafrique, Abidjan',
      basePrice: 25000,
      rating: 4.6,
      stars: 4,
      reviewsCount: 112,
      image: '/hotel-yop2.jpg',
      shortDesc: 'Cadre calme, spacieux et sécurisé avec toutes les commodités.',
      description: 'Cadre spacieux et feutré à Niangon. Profitez d\'un confort standing avec Wi-Fi très haut débit, literie hôtelière grand confort, climatisation continue et service d\'accueil chaleureux 24h/24.',
    },
    {
      id: 'hotel-cocody-1',
      name: 'Hôtel Ivoire Palace',
      commune: 'Cocody',
      address: 'Cocody Ambassades, Rue des Jardins prolongée, Abidjan',
      basePrice: 35000,
      rating: 4.8,
      stars: 4,
      reviewsCount: 156,
      image: '/hotel-cocody1.jpg',
      shortDesc: 'Chambre standard climatisée avec Wi-Fi haut débit et literie de luxe.',
      description: 'Le raffinement au cœur de Cocody. Suites climatisées, room service soigné, environnement ultra-paisible et sécurité maximale pour tous vos séjours professionnels ou escapades romantiques.',
    },
  ];

  // Filtrage réactif
  const filteredHotels = useMemo(() => {
    return allHotels.filter((hotel) => {
      // Filtre nom
      if (searchNom.trim() && !hotel.name.toLowerCase().includes(searchNom.toLowerCase())) {
        return false;
      }
      // Filtre commune
      if (selectedCommune !== 'all' && hotel.commune.toLowerCase() !== selectedCommune.toLowerCase()) {
        return false;
      }
      // Filtre prix max
      if (selectedMaxPrice && hotel.basePrice > selectedMaxPrice) {
        return false;
      }
      // Filtre standing
      if (selectedStanding && hotel.stars < selectedStanding) {
        return false;
      }
      return true;
    });
  }, [searchNom, selectedCommune, selectedMaxPrice, selectedStanding]);

  const yopougonHotels = filteredHotels.filter((h) => h.commune === 'Yopougon');
  const cocodyHotels = filteredHotels.filter((h) => h.commune === 'Cocody');

  return (
    <div 
      id="chambres"
      className="flex flex-col md:flex-row min-h-screen relative overflow-x-hidden bg-cover bg-center bg-no-repeat scroll-mt-20"
      style={{ backgroundImage: "url('/side.jpg')" }}
    >
      {/* Filtre blanc en haut de l'image */}
      <div className="absolute top-0 inset-x-0 h-48 md:h-64 bg-linear-to-b from-white via-white/85 to-transparent pointer-events-none z-0" />
      
      {/* Filtre blanc en bas de l'image */}
      <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-linear-to-t from-white via-white/85 to-transparent pointer-events-none z-0" />
      
      {/* BARRE DE NAVIGATION MOBILE */}
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 shadow-sm z-30">
        <h1 className="text-xl font-bold text-green-600 tracking-wide">GrandH</h1>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-green-600 text-white p-2 rounded-md shadow focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* OVERLAY MOBILE TRANSPARENT */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-transparent z-30"
        />
      )}

      {/* SIDEBARRE CLASSIQUE (FILTRES) */}
      <aside className={`
        fixed md:sticky top-0 md:top-8 md:ml-4 left-0 h-full md:h-fit z-40
        w-80 bg-white shadow-xl border border-gray-200 flex flex-col overflow-hidden md:rounded-2xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* EN-TÊTE DE LA SIDEBARRE */}
        <div className="p-6 border-b border-gray-200 bg-green-600 flex items-center justify-between shrink-0">
          <Reveal animation="fade-down" delay={100}>
            <h1 className="text-2xl font-bold text-white tracking-wide">GrandH</h1>
          </Reveal>
        </div>

        {/* Liste des filtres et options de recherche */}
        <Reveal animation="fade-right" delay={150} className="max-h-[calc(100vh-0rem)] overflow-y-auto p-4 space-y-3 pt-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
              Filtres & Recherche
            </span>
            {(searchNom || selectedCommune !== 'all' || selectedMaxPrice || selectedStanding) && (
              <button
                onClick={() => {
                  setSearchNom('');
                  setSelectedCommune('all');
                  setSelectedMaxPrice(null);
                  setSelectedStanding(null);
                }}
                className="text-[11px] text-green-600 font-bold hover:underline cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* 1. Rechercher par nom */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenNom(!openNom)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              <span>Rechercher par nom</span>
              <span className="text-gray-400 font-bold">{openNom ? '−' : '+'}</span>
            </button>
            {openNom && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <input 
                  type="text" 
                  value={searchNom}
                  onChange={(e) => setSearchNom(e.target.value)}
                  placeholder="Ex: Palais, Ivoire, Boss..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                />
              </div>
            )}
          </div>

          {/* 2. Filtrer par prix */}
          <div id="tarifs" className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm scroll-mt-24">
            <button 
              onClick={() => setOpenPrix(!openPrix)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              <span>Filtrer par prix</span>
              <span className="text-gray-400 font-bold">{openPrix ? '−' : '+'}</span>
            </button>
            {openPrix && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    checked={selectedMaxPrice === null}
                    onChange={() => setSelectedMaxPrice(null)}
                    className="text-green-600 focus:ring-green-500" 
                  />
                  <span>Tous les tarifs</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    checked={selectedMaxPrice === 20000}
                    onChange={() => setSelectedMaxPrice(20000)}
                    className="text-green-600 focus:ring-green-500" 
                  />
                  <span>Moins de 20 000 fcfa</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    checked={selectedMaxPrice === 30000}
                    onChange={() => setSelectedMaxPrice(30000)}
                    className="text-green-600 focus:ring-green-500" 
                  />
                  <span>Jusqu'à 30 000 fcfa</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    checked={selectedMaxPrice === 50000}
                    onChange={() => setSelectedMaxPrice(50000)}
                    className="text-green-600 focus:ring-green-500" 
                  />
                  <span>Jusqu'à 50 000 fcfa</span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Filtrer par Commune */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenQuartier(!openQuartier)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              <span>Commune</span>
              <span className="text-gray-400 font-bold">{openQuartier ? '−' : '+'}</span>
            </button>
            {openQuartier && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="communeSelect" 
                    checked={selectedCommune === 'all'}
                    onChange={() => setSelectedCommune('all')}
                  />
                  <span>Toutes les communes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="communeSelect" 
                    checked={selectedCommune === 'Yopougon'}
                    onChange={() => setSelectedCommune('Yopougon')}
                  />
                  <span>Yopougon ({allHotels.filter(h => h.commune === 'Yopougon').length})</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="communeSelect" 
                    checked={selectedCommune === 'Cocody'}
                    onChange={() => setSelectedCommune('Cocody')}
                  />
                  <span>Cocody ({allHotels.filter(h => h.commune === 'Cocody').length})</span>
                </label>
              </div>
            )}
          </div>

          {/* 4. Standing */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenStanding(!openStanding)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              <span>Standing (Étoiles)</span>
              <span className="text-gray-400 font-bold">{openStanding ? '−' : '+'}</span>
            </button>
            {openStanding && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="standingSelect"
                    checked={selectedStanding === null}
                    onChange={() => setSelectedStanding(null)}
                  />
                  <span>Tous les standings</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="standingSelect"
                    checked={selectedStanding === 3}
                    onChange={() => setSelectedStanding(3)}
                  />
                  <span>3 étoiles et +</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="standingSelect"
                    checked={selectedStanding === 4}
                    onChange={() => setSelectedStanding(4)}
                  />
                  <span>4 étoiles et +</span>
                </label>
              </div>
            )}
          </div>

          {/* 5. Capacité chambre */}
          <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacité chambre</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800">
              <option>Toutes les capacités (1 à 4 pers.)</option>
              <option>1 personne (Solo)</option>
              <option>2 personnes (Couple)</option>
              <option>3 à 4 personnes (Famille)</option>
            </select>
          </div>

          {/* 6. Équipements */}
          <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm space-y-2">
            <span className="block text-sm font-medium text-gray-700 mb-1">Équipements inclus</span>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" defaultChecked />
              <span>Wi-Fi Fibre Gratuit</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" defaultChecked />
              <span>Climatisation 24h</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" defaultChecked />
              <span>Groupe électrogène de secours</span>
            </label>
          </div>

          {/* 7. Disponibilité */}
          <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Disponible aujourd'hui</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
          </div>
        </Reveal>
      </aside>

      {/* CORPS PRINCIPAL : PRÉSENTATION PAR COMMUNE */}
      <main className="flex-1 p-6 md:p-8 md:ml-6 overflow-y-auto space-y-12 relative z-10">
        
        {/* EN-TÊTE DE SECTION */}
        <div className="mb-4">
          <Reveal as="h2" animation="fade-down" duration={600} className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Hôtels et Chambres par Commune
          </Reveal>
          <Reveal as="p" animation="fade" delay={150} duration={600} className="text-gray-600 text-sm mt-1">
            Explorez les meilleures offres sélectionnées et vérifiées à Abidjan avec réservation instantanée.
          </Reveal>
        </div>

        {/* SI AUCUN RÉSULTAT DU FILTRE */}
        {filteredHotels.length === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center space-y-3">
            <p className="text-gray-700 font-bold text-lg">Aucun hôtel ne correspond à vos filtres actuels.</p>
            <button
              onClick={() => {
                setSearchNom('');
                setSelectedCommune('all');
                setSelectedMaxPrice(null);
                setSelectedStanding(null);
              }}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors cursor-pointer"
            >
              Afficher tous les hôtels
            </button>
          </div>
        )}

        {/* SECTION 1 : YOPOUGON */}
        {(selectedCommune === 'all' || selectedCommune.toLowerCase() === 'yopougon') && yopougonHotels.length > 0 && (
          <section className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <Reveal animation="fade-right" duration={600}>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Yopougon</h3>
                <p className="text-sm text-gray-500">Découvrez l'ambiance et les logements confortables disponibles à Yopougon.</p>
              </div>
            </Reveal>

            {/* Grande image large de la commune */}
            <Reveal animation="zoom-in" duration={800} className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md relative bg-gray-200">
              <img 
                src="/yopougon.png" 
                alt="Yopougon" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <Reveal animation="fade-up" delay={200} duration={600}>
                  <span className="text-white text-2xl font-bold tracking-wide">Yopougon</span>
                </Reveal>
              </div>
            </Reveal>

            {/* Liste des hôtels de Yopougon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {yopougonHotels.map((h, i) => (
                <Reveal 
                  key={h.id}
                  animation={i % 2 === 0 ? 'fade-right' : 'fade-left'} 
                  delay={100 * (i + 1)} 
                  duration={700} 
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden group">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-medium shadow">
                      {h.basePrice.toLocaleString()} fcfa / nuit
                    </span>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 shadow">
                      <span>★ {h.rating}</span>
                      <span className="text-gray-300">({h.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">{h.commune}</span>
                      <h4 className="text-lg font-bold text-gray-800 mt-1">{h.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{h.shortDesc}</p>
                    </div>

                    <button 
                      onClick={() => navigate(`/reservation/${h.id}`)}
                      className="mt-5 w-full bg-green-600 hover:bg-green-700 active:scale-98 text-white py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Réserver</span>
                      <span>➔</span>
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2 : COCODY */}
        {(selectedCommune === 'all' || selectedCommune.toLowerCase() === 'cocody') && cocodyHotels.length > 0 && (
          <section className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <Reveal animation="fade-left" duration={600}>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Cocody</h3>
                <p className="text-sm text-gray-500">Le prestige, le calme et le confort au cœur de Cocody.</p>
              </div>
            </Reveal>

            {/* Grande image large de la commune */}
            <Reveal animation="zoom-in" duration={800} className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md relative bg-gray-200">
              <img 
                src="/cocody.png" 
                alt="Cocody" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <Reveal animation="fade-up" delay={200} duration={600}>
                  <span className="text-white text-2xl font-bold tracking-wide">Cocody</span>
                </Reveal>
              </div>
            </Reveal>

            {/* Liste des hôtels de Cocody */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {cocodyHotels.map((h, i) => (
                <Reveal 
                  key={h.id}
                  animation="fade-up" 
                  delay={150 * (i + 1)} 
                  duration={700} 
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden group">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-medium shadow">
                      {h.basePrice.toLocaleString()} fcfa / nuit
                    </span>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 shadow">
                      <span>★ {h.rating}</span>
                      <span className="text-gray-300">({h.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">{h.commune}</span>
                      <h4 className="text-lg font-bold text-gray-800 mt-1">{h.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{h.shortDesc}</p>
                    </div>

                    <button 
                      onClick={() => navigate(`/reservation/${h.id}`)}
                      className="mt-5 w-full bg-green-600 hover:bg-green-700 active:scale-98 text-white py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Réserver</span>
                      <span>➔</span>
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

      </main>

    </div>
  );
}
