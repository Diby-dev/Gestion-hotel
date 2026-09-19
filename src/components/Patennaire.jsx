export default function PartnerBanner() {
  return (
    <section className="relative w-full py-12 overflow-hidden">
      
      {/* 1. Image de fond globale (Prend toute la largeur de l'écran) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/patennaire.jpg" 
          alt="Arrière-plan global" 
          className="w-full h-full object-cover"
        />
        {/* Voile sombre pour atténuer l'arrière-plan global */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 2. Conteneur centré pour limiter la largeur du contenu et de la carte */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 text-white flex flex-col justify-between">
          
          {/* Image de fond spécifique à la carte intérieure */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/stat.jpg" 
              alt="Fond Espace Partenaires" 
              className="w-full h-full object-cover"
            />
            {/* Overlay / Voile sombre pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px]"></div>
          </div>

          {/* Contenu principal */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Partie gauche : Textes et badge */}
            <div className="max-w-2xl space-y-4">
              
              {/* Badge supérieur */}
              <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-medium text-gray-200 backdrop-blur-md">
                <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Espace Partenaires & Propriétaires</span>
              </div>

              {/* Titre principal */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
                Vous gérez un hôtel ou une résidence meublée ?
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Rejoignez le 1er réseau hôtelier ivoirien. Boostez votre taux d'occupation, évitez les réservations fantômes et encaissez vos acomptes Mobile Money automatiquement sans tracas.
              </p>
            </div>

            {/* Partie droite : Boutons d'action */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-60">
              <a 
                href="#inscription" 
                className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 group"
              >
                <span>Inscrire mon hôtel gratuitement</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a 
                href="#demonstration" 
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-medium text-sm px-6 py-3.5 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Découvrir la démonstration</span>
              </a>
            </div>

          </div>

          {/* Ligne de séparation subtile */}
          <div className="relative z-10 w-full h-px bg-white/10 my-8"></div>

          {/* Statistiques en bas de carte */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="text-xl md:text-2xl font-black text-white tracking-tight">+45%</div>
              <div className="text-xs md:text-sm text-gray-400 mt-0.5">De réservations directes</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-white tracking-tight">0 FCFA</div>
              <div className="text-xs md:text-sm text-gray-400 mt-0.5">Frais d'adhésion</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-white tracking-tight">24h</div>
              <div className="text-xs md:text-sm text-gray-400 mt-0.5">Délai d'activation</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}