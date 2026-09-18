import { useState } from 'react';
import { useModal } from '../../context/ModalContext';

export default function DevisModal() {
  const { devisModal, closeDevis, showToast } = useModal();
  const [deviceType, setDeviceType] = useState('pc');
  const [urgency, setUrgency] = useState('standard');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);

  if (!devisModal.isOpen) return null;

  // Calcul d'estimation réaliste en FCFA
  const calculateEstimate = () => {
    let min = 10000;
    let max = 25000;
    if (deviceType === 'phone') {
      min = 8000;
      max = 20000;
    } else if (deviceType === 'printer') {
      min = 12000;
      max = 30000;
    } else if (deviceType === 'gaming') {
      min = 25000;
      max = 65000;
    }

    if (urgency === 'express') {
      min += 5000;
      max += 10000;
    }

    return { min, max };
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      const estimate = calculateEstimate();
      const devisId = 'DEV-' + Math.floor(10000 + Math.random() * 90000);
      setQuoteResult({
        id: devisId,
        min: estimate.min,
        max: estimate.max,
        urgency: urgency === 'express' ? 'Express (sous 24h)' : 'Standard (48h à 72h)',
        contact,
      });
      showToast(`Devis ${devisId} calculé avec succès !`);
    }, 800);
  };

  const handleReset = () => {
    setQuoteResult(null);
    closeDevis();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
              Devis en ligne instantané
            </span>
            <h3 className="text-xl font-bold text-white">
              {quoteResult ? 'Votre Devis Estimatif' : 'Calculateur de Devis Gratuit'}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {quoteResult ? (
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-800/40 text-center flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                Fourchette estimative pour votre réparation
              </span>
              <div className="text-3xl md:text-4xl font-extrabold text-white">
                {quoteResult.min.toLocaleString('fr-FR')} - {quoteResult.max.toLocaleString('fr-FR')} <span className="text-purple-400 text-2xl font-bold">FCFA</span>
              </div>
              <span className="text-xs text-slate-400">
                Diagnostic préliminaire gratuit • Pièces de rechange garanties 3 mois
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs flex flex-col gap-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Réf. Devis</span>
                <span className="font-mono font-bold text-purple-400">{quoteResult.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Délai estimé</span>
                <span className="text-white font-medium">{quoteResult.urgency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Notification envoyée à</span>
                <span className="text-white font-medium">{quoteResult.contact}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Un technicien certifié Ismo va vous contacter sous 1 heure avec une proposition sur mesure.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20"
            >
              Compris, fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCalculate} className="p-6 md:p-8 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            {/* Type d'appareil */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Matériel à réparer *
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="pc">PC Portable ou Tour de bureau</option>
                <option value="phone">Smartphone (iPhone, Samsung, etc.) ou Tablette</option>
                <option value="printer">Imprimante laser ou jet d'encre</option>
                <option value="gaming">PC Gamer ou Console de jeux</option>
              </select>
            </div>

            {/* Niveau d'urgence */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Délai d'intervention souhaité
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    urgency === 'standard'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400'
                  }`}
                >
                  ⏱ Standard (48h-72h)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('express')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    urgency === 'express'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400'
                  }`}
                >
                  ⚡ Express 24h (+5 000 F)
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Précisions sur la panne
              </label>
              <input
                type="text"
                placeholder="Ex: Écran fissuré, virus, port de charge cassé"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Coordonnées */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Téléphone ou Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+225 07... ou email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Bouton de calcul */}
            <button
              type="submit"
              disabled={isCalculating}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Calcul du devis en cours...</span>
                </>
              ) : (
                <span>Obtenir mon estimation gratuite</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
