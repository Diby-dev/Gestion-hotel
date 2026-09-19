export default function CommuneSearch() {
  return (
    <div className="bg-orange-500 w-full py-12 px-4 flex flex-col items-center justify-center shadow-md">
      {/* Texte blanc centré en haut */}
      <h2 className="text-white text-xl md:text-2xl font-semibold text-center mb-6">
        Concentrez votre recherche d'hôtel dans une commune
      </h2>

      {/* Conteneur de la barre de recherche et du bouton */}
      <div className="flex w-full max-w-2xl bg-white rounded-lg shadow-lg p-2">
        <input
          type="text"
          placeholder="Ex: Cocody, Yopougon, Marcory..."
          className="grow px-4 py-3 text-gray-700 bg-transparent focus:outline-none"
        />
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-3  rounded-md transition-colors duration-200">
          Rechercher
        </button>
      </div>
    </div>
  );
}