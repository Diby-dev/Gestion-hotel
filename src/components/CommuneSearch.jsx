import { useState } from 'react';
import Reveal from './Reveal';
import { useModal } from '../context/ModalContext';

export default function CommuneSearch() {
  const [commune, setCommune] = useState('');
  const { showToast } = useModal();

  const handleSearch = (e) => {
    e.preventDefault();
    const target = document.getElementById('chambres');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    if (commune.trim()) {
      showToast(`Recherche des hôtels pour : ${commune}`);
    }
  };

  return (
    <div className="bg-orange-500 w-full py-12 px-4 flex flex-col items-center justify-center shadow-md">
      {/* Texte blanc centré en haut */}
      <Reveal animation="fade-down" duration={600}>
        <h2 className="text-white text-xl md:text-2xl font-semibold text-center mb-6">
          Concentrez votre recherche d'hôtel dans une commune
        </h2>
      </Reveal>

      {/* Conteneur de la barre de recherche et du bouton */}
      <Reveal animation="zoom-in" delay={150} duration={600} className="w-full max-w-2xl">
        <form onSubmit={handleSearch} className="flex w-full bg-white rounded-xl shadow-lg p-2">
          <input
            type="text"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            placeholder="Ex: Cocody, Yopougon, Marcory..."
            className="grow px-4 py-3 text-gray-700 bg-transparent focus:outline-none text-sm"
          />
          <button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Rechercher
          </button>
        </form>
      </Reveal>
    </div>
  );
}