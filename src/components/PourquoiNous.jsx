export default function PourquoiNous() {
  return (
    <section className="relative py-16 px-4 md:px-8 overflow-hidden">
      
      {/* Image de fond et voile semi-transparent */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/pourquoinous.jpg" 
          alt="Fond Pourquoi Nous" 
          className="w-full h-full object-cover"
        />
        {/* Voile blanc cassé/gris semi-transparent pour la lisibilité */}
        <div className="absolute inset-0 bg-gray-50/10 backdrop-blur-xs"></div>
      </div>

      {/* Contenu de la section (placé au-dessus grâce à relative et z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        
        {/* EN-TÊTE DE LA SECTION */}
        <div className="text-center space-y-3">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-50 tracking-tight">
            Pourquoi réserver sur GrandH ?
          </h2>
          <p className="text-sm md:text-base text-gray-50 max-w-2xl mx-auto">
            Une plateforme conçue sur-mesure pour les exigences des voyageurs en Côte d'Ivoire, alliant flexibilité financière et certitude logistique.
          </p>
        </div>

        {/* GRILLE DES 3 CARTES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARTE 1 : Paiement d'acompte flexible */}
          <div className="bg-white/95 backdrop-blur-xs p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              {/* Icône */}
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">
                Paiement d'acompte flexible
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Payez seulement un acompte sécurisé via Wave, Orange Money, MTN MoMo ou Moov, et réglez le solde en toute sérénité à votre arrivée à la réception de l'hôtel.
              </p>
            </div>

            {/* Badges des moyens de paiement */}
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-gray-100">
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">Wave</span>
              <span className="text-xs font-medium bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md">Orange Money</span>
              <span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-md">MTN MoMo</span>
              <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md">Moov</span>
            </div>
          </div>

          {/* CARTE 2 : Équipements garantis 24h/24 */}
          <div className="bg-white/95 backdrop-blur-xs p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              {/* Icône */}
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">
                Équipements garantis 24h/24
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Chaque établissement est scrupuleusement audité : climatisation fonctionnelle, eau chaude courante et présence d'un groupe électrogène de secours certifié pour parer à toute coupure.
              </p>
            </div>

            {/* Badges des garanties */}
            <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-gray-100 text-xs font-medium text-gray-600">
              <span className="flex items-center gap-1">
                <span className="text-green-600">✔</span> Clim. testée
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✔</span> Groupe secours
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✔</span> Eau chaude
              </span>
            </div>
          </div>

          {/* CARTE 3 : Centralisation des hôtels */}
          <div className="bg-white/95 backdrop-blur-xs p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              {/* Icône */}
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">
                Centralisation des hôtels
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Notre site centralise tous les hôtels d'Abidjan pour vous offrir un accès direct à un large choix d'établissements adaptés à toutes les envies et à tous les budgets.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">100% Abidjan</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}