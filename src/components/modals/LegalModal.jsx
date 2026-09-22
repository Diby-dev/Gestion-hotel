import { useModal } from '../../context/ModalContext';

export default function LegalModal() {
  const { legalModal, closeLegal } = useModal();

  if (!legalModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h3 className="text-lg font-bold text-white">
            {legalModal.type || 'Mentions Légales & Conditions'}
          </h3>
          <button
            onClick={closeLegal}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-4 text-xs text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto">
          <p>
            <strong>Éditeur du service :</strong> Ismo Maintenance Informatique, établissement spécialisé dans le dépannage et la maintenance de matériel technologique (ordinateurs, smartphones, tablettes et imprimantes).
          </p>
          <p>
            <strong>Localisation :</strong> Adjamé, Carrefour Liberté, en bas du pont, Abidjan, Côte d'Ivoire.
          </p>
          <p>
            <strong>Protection des données personnelles :</strong> Les informations recueillies via nos formulaires de devis et de prise de rendez-vous (nom, téléphone, adresse e-mail) sont strictement destinées au suivi technique de votre commande et ne sont en aucun cas revendues à des tiers.
          </p>
          <p>
            <strong>Garantie des interventions :</strong> Toutes nos réparations bénéficient d'une garantie allant jusqu'à 3 mois sur les pièces remplacées et la main d'œuvre effectuée.
          </p>
          <p>
            <strong>Contact :</strong> Pour toute question, contactez notre service client au <span className="text-purple-400 font-semibold">+225 07 98 27 67 25</span>.
          </p>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex justify-end">
          <button
            onClick={closeLegal}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm transition-all"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
