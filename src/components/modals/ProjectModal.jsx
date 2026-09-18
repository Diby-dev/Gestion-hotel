import { useModal } from '../../context/ModalContext';

export default function ProjectModal() {
  const { projectModal, closeProject, openRdv } = useModal();

  if (!projectModal.isOpen || !projectModal.project) return null;
  const { project } = projectModal;

  const handleBookSimilar = () => {
    closeProject();
    openRdv(project.title);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative w-full h-56 bg-slate-950">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>
          <button
            onClick={closeProject}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
          <span className="absolute bottom-4 left-6 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
            {project.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-5">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Fiche d'intervention */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Délai d'intervention</span>
              <span className="font-semibold text-white">45 minutes à 24h</span>
            </div>
            <div>
              <span className="text-slate-400 block">Pièce de remplacement</span>
              <span className="font-semibold text-purple-400">Origine constructeur</span>
            </div>
            <div>
              <span className="text-slate-400 block">Garantie réparation</span>
              <span className="font-semibold text-emerald-400">3 mois pièces & main d'œuvre</span>
            </div>
            <div>
              <span className="text-slate-400 block">Satisfaction client</span>
              <span className="font-semibold text-amber-400">★★★★★ 5.0/5</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleBookSimilar}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-purple-600/20"
            >
              Demander cette intervention
            </button>
            <button
              onClick={closeProject}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
