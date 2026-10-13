import { useState } from 'react';
import Reveal from './Reveal';
import { useModal } from '../context/ModalContext';

export default function CommuneSearch() {
  const { selectedCommune, setSelectedCommune, showToast } = useModal();
  const [commune, setCommune] = useState(selectedCommune !== 'all' ? selectedCommune : '');

  const executeSearch = (targetCommune) => {
    const value = targetCommune.trim();
    if (!value || value.toLowerCase() === 'all' || value.toLowerCase() === 'tous') {
      setSelectedCommune('all');
      setCommune('');
      showToast('Affichage de tous les hôtels', 'info');
    } else {
      setSelectedCommune(value);
      setCommune(value);
      showToast(`Hôtels filtrés pour : ${value}`, 'success');
    }

    const target = document.getElementById('chambres');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(commune);
  };

  const quickCommunes = [
    { label: 'Yopougon', value: 'Yopougon', count: '2 résidences' },
    { label: 'Cocody', value: 'Cocody', count: '1 palace' },
    { label: 'Marcory', value: 'Marcory', count: 'Dispo' },
    { label: 'Toutes les communes', value: 'all', count: 'Tout voir' },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 w-full py-12 px-4 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
      {/* Halo décoratif subtil */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      {/* Titre */}
      <Reveal animation="fade-down" duration={600}>
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-amber-200 font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            Recherche géolocalisée
          </span>
          <h2 className="text-white text-2xl md:text-3xl font-black mt-2">
            Trouvez votre chambre d'hôtel dans votre commune
          </h2>
          <p className="text-orange-100 text-sm mt-1 max-w-lg mx-auto">
            Tapez le nom d'un quartier ou sélectionnez une commune pour afficher instantanément les hôtels disponibles.
          </p>
        </div>
      </Reveal>

      {/* Conteneur de la barre de recherche */}
      <Reveal animation="zoom-in" delay={150} duration={600} className="w-full max-w-2xl">
        <form onSubmit={handleSearch} className="flex items-center w-full bg-white rounded-2xl shadow-2xl p-2 border border-white/40">
          <div className="pl-3 pr-2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            placeholder="Ex: Yopougon, Cocody, Niangon, Selmer..."
            className="grow px-2 py-3 text-gray-800 bg-transparent focus:outline-none text-sm placeholder:text-gray-400"
          />
          {commune && (
            <button
              type="button"
              onClick={() => {
                setCommune('');
                executeSearch('all');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition text-xs font-bold"
              title="Effacer"
            >
              ✕
            </button>
          )}
          <button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
          >
            <span>Filtrer</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Badges de communes rapides */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-orange-200 font-medium">Suggestions :</span>
          {quickCommunes.map((item) => {
            const isActive = selectedCommune.toLowerCase() === item.value.toLowerCase() || (item.value === 'all' && selectedCommune === 'all');
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => executeSearch(item.value)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all backdrop-blur-sm flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-green-700 shadow-md font-bold scale-105'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <span>📍</span>
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-black/20 text-orange-100'}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}