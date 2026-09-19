import { useState } from 'react';

export default function SidebarreZonne() {
  const [openPrix, setOpenPrix] = useState(false);
  const [openNom, setOpenNom] = useState(false);
  const [openQuartier, setOpenQuartier] = useState(false);
  const [openStanding, setOpenStanding] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div 
      className="flex flex-col md:flex-row min-h-screen relative overflow-x-hidden bg-cover bg-center bg-no-repeat"
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
          className="bg-green-600 text-white p-2 rounded-md shadow focus:outline-none"
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
          <h1 className="text-2xl font-bold text-white tracking-wide">GrandH</h1>
        </div>

        {/* Liste des filtres et options de recherche */}
        <div className="max-h-[calc(100vh-0rem)] overflow-y-auto p-4 space-y-3 pt-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 border-b border-gray-200 pb-2">
            Filtres & Recherche
          </div>

          {/* 1. Rechercher par nom */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenNom(!openNom)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              <span>Rechercher par nom</span>
              <span className="text-gray-400 font-bold">{openNom ? '−' : '+'}</span>
            </button>
            {openNom && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <input 
                  type="text" 
                  placeholder="Nom de l'hôtel..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                />
              </div>
            )}
          </div>

          {/* 2. Filtrer par prix */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenPrix(!openPrix)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              <span>Filtrer par prix</span>
              <span className="text-gray-400 font-bold">{openPrix ? '−' : '+'}</span>
            </button>
            {openPrix && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span>Moins de 20 000 fcfa</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span>15 000 — 30 000 fcfa</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span>30 000 — 60 000 fcfa</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span>Plus de 60 000 fcfa</span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Filtrer par Commune */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenQuartier(!openQuartier)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              <span>Commune</span>
              <span className="text-gray-400 font-bold">{openQuartier ? '−' : '+'}</span>
            </button>
            {openQuartier && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>Cocody</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>Yopougon</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>Marcory</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>Plateau</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>Treichville</span></label>
              </div>
            )}
          </div>

          {/* 4. Standing */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button 
              onClick={() => setOpenStanding(!openStanding)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              <span>Standing (Étoiles)</span>
              <span className="text-gray-400 font-bold">{openStanding ? '−' : '+'}</span>
            </button>
            {openStanding && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>2 étoiles et +</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>3 étoiles et +</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" /><span>4 étoiles et +</span></label>
              </div>
            )}
          </div>

          {/* 5. Capacité chambre */}
          <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacité chambre</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800">
              <option>Toutes les capacités</option>
              <option>1 personne (Solo)</option>
              <option>2 personnes (Couple)</option>
              <option>3 personnes ou plus</option>
            </select>
          </div>

          {/* 6. Équipements */}
          <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm space-y-2">
            <span className="block text-sm font-medium text-gray-700 mb-1">Équipements</span>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" /><span>Wi-Fi Gratuit</span></label>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" /><span>Climatisation</span></label>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" /><span>Piscine</span></label>
          </div>

          {/* 7. Disponibilité */}
          <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Disponible immédiatement</span>
            <input type="checkbox" className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
          </div>

        </div>
      </aside>

      {/* CORPS PRINCIPAL : PRÉSENTATION PAR COMMUNE */}
      <main className="flex-1 p-6 md:p-8 md:ml-6 overflow-y-auto space-y-12 relative z-10">
        
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Hôtels et Chambres par Commune</h2>
          <p className="text-gray-500 text-sm mt-1">Explorez les meilleures offres classées par zone géographique à Abidjan.</p>
        </div>

        {/* SECTION 1 : YOPOUGON */}
        <section className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Yopougon</h3>
            <p className="text-sm text-gray-500">Découvrez l'ambiance et les logements disponibles à Yopougon.</p>
          </div>

          {/* Grande image large de la commune */}
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md relative bg-gray-200">
            <img 
              src="/yopougon.png" 
              alt="Yopougon" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-2xl font-bold tracking-wide">Yopougon</span>
            </div>
          </div>

          {/* Liste des hôtels de Yopougon */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Hôtel 1 */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <img src="/hotel-yop1.jpg" alt="Résidence Yop Confort" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-medium shadow">20 000 fcfa / nuit</span>
                {/* Note et étoile jaune en bas à gauche de l'image */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 shadow">
                  <span>4.5</span>
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">Yopougon</span>
                  <h4 className="text-lg font-bold text-gray-800 mt-1">Residence meublée du boss</h4>
                  <p className="text-sm text-gray-500 mt-1">Chambre propre et économique au cœur de Yopougon.</p>
                </div>
                <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                  Réserver
                </button>
              </div>
            </div>

            {/* Hôtel 2 */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <img src="/hotel-yop2.jpg" alt="Palais de Niangon" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-medium shadow">25 000 fcfa / nuit</span>
                {/* Note et étoile jaune en bas à gauche de l'image */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 shadow">
                  <span>4.5</span>
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">Yopougon</span>
                  <h4 className="text-lg font-bold text-gray-800 mt-1">Palais de Niangon</h4>
                  <p className="text-sm text-gray-500 mt-1">Cadre calme et sécurisé avec toutes les commodités.</p>
                </div>
                <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                  Réserver
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 2 : COCODY */}
        <section className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Cocody</h3>
            <p className="text-sm text-gray-500">Le prestige et le confort au cœur de Cocody.</p>
          </div>

          {/* Grande image large de la commune */}
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md relative bg-gray-200">
            <img 
              src="/cocody.png" 
              alt="Cocody" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-2xl font-bold tracking-wide">Cocody</span>
            </div>
          </div>

          {/* Liste des hôtels de Cocody */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Hôtel 1 */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <img src="/hotel-cocody1.jpg" alt="Hôtel Ivoire Palace" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-medium shadow">35 000 fcfa / nuit</span>
                {/* Note et étoile jaune en bas à gauche de l'image */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 shadow">
                  <span>4.5</span>
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">Cocody</span>
                  <h4 className="text-lg font-bold text-gray-800 mt-1">Hôtel Ivoire Palace</h4>
                  <p className="text-sm text-gray-500 mt-1">Chambre standard climatisée avec Wi-Fi haut débit.</p>
                </div>
                <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                  Réserver
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}