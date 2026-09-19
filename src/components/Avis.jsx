import { useState } from 'react';

// Données des avis
const avisList = [
  {
    id: 1,
    name: "Kouassi Jean",
    role: "Voyageur",
    comment: "Super site ! J'ai pu trouver et réserver mon hôtel à Yopougon en quelques clics. Très fluide et rapide.",
    rating: 5,
  },
  {
    id: 2,
    name: "Aminata Traoré",
    role: "Cliente régulière",
    comment: "Le service client est au top et les hôtels référencés à Abidjan sont vraiment de qualité. Je recommande vivement !",
    rating: 5,
  },
  {
    id: 3,
    name: "Marc Yao",
    role: "Touriste",
    comment: "Immense merci à GrandH. Réservation validée instantanément, aucun souci à l'arrivée à l'hôtel.",
    rating: 4,
  },
  {
    id: 4,
    name: "Aïcha Koné",
    role: "Voyageuse d'affaires",
    comment: "Une interface magnifique et très pratique pour comparer les hôtels. Mes séjours professionnels se font désormais ici.",
    rating: 5,
  },
];

// Composant pour afficher les étoiles
function StarRating({ rating }) {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Avis() {
  const [isPaused, setIsPaused] = useState(false);
  const duplicatedAvis = [...avisList, ...avisList];

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      
      {/* Titre de la section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-center">
        <h2 className="text-gray-900 text-2xl md:text-3xl font-bold">
          Ce que pensent nos utilisateurs
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Découvrez les retours d'expérience de ceux qui nous font confiance.
        </p>
      </div>

      {/* Conteneur du défilement infini */}
      <div className="relative w-full overflow-hidden flex">
        
        {/* Dégradés sur les côtés (fond blanc) */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Piste animée vers la droite avec gestion dynamique de la pause */}
        <div 
          className="flex gap-6 animate-marquee-right py-4"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {duplicatedAvis.map((avis, index) => (
            <div
              key={`${avis.id}-${index}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="bg-gray-50 border border-gray-200/80 p-6 rounded-2xl shadow-md w-[320px] md:w-95 shrink-0 flex flex-col justify-between transition-transform duration-300 hover:scale-105 cursor-pointer select-none"
            >
              <div>
                {/* Étoiles */}
                <div className="mb-3">
                  <StarRating rating={avis.rating} />
                </div>
                {/* Commentaire */}
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "{avis.comment}"
                </p>
              </div>

              {/* Infos utilisateur */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">
                    {avis.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {avis.role}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 text-green-700 flex items-center justify-center font-bold text-xs">
                  {avis.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style CSS personnalisé pour l'animation */}
      <style>{`
        @keyframes marqueeRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 35s linear infinite;
        }
      `}</style>
    </section>
  );
}