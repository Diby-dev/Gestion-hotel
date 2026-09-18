import { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';

export default function RdvModal() {
  const { rdvModal, closeRdv, showToast } = useModal();
  const [device, setDevice] = useState('PC & Ordinateur');
  const [serviceName, setServiceName] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10h00 - 12h00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  useEffect(() => {
    if (rdvModal.service) {
      setServiceName(rdvModal.service);
      if (rdvModal.service.toLowerCase().includes('phone') || rdvModal.service.toLowerCase().includes('smartphone')) {
        setDevice('Téléphone / Tablette');
      } else if (rdvModal.service.toLowerCase().includes('imprimante')) {
        setDevice('Imprimante');
      } else {
        setDevice('PC & Ordinateur');
      }
    }
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
    setConfirmedData(null);
  }, [rdvModal]);

  if (!rdvModal.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const bookingRef = 'RDV-' + Math.floor(1000 + Math.random() * 9000);
      setConfirmedData({
        ref: bookingRef,
        name,
        phone,
        device,
        service: serviceName || 'Réparation générale',
        date,
        timeSlot,
      });
      showToast(`Rendez-vous réservé avec succès ! Référence : ${bookingRef}`);
    }, 900);
  };

  const handleClose = () => {
    setConfirmedData(null);
    closeRdv();
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
              Réservation en ligne
            </span>
            <h3 className="text-xl font-bold text-white">
              {confirmedData ? 'Confirmation de Rendez-vous' : 'Prendre un Rendez-vous'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {confirmedData ? (
          <div className="p-6 md:p-8 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl font-bold">
              ✓
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-2xl font-bold text-white">Créneau confirmé !</h4>
              <p className="text-sm text-slate-300">
                Merci <strong className="text-white">{confirmedData.name}</strong>. Votre dossier a bien été enregistré par notre atelier.
              </p>
            </div>

            {/* Ticket de réservation */}
            <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-left flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Numéro de dossier</span>
                <span className="font-mono font-bold text-purple-400">{confirmedData.ref}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Appareil concerné</span>
                <span className="font-medium text-white">{confirmedData.device}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Date prévue</span>
                <span className="font-medium text-white">{confirmedData.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Créneau horaire</span>
                <span className="font-medium text-purple-300">{confirmedData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Atelier</span>
                <span className="text-xs font-medium text-slate-300 text-right">Adjamé, Liberté, en bas du pont</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Un SMS de rappel vous sera envoyé au <span className="text-white font-medium">{confirmedData.phone}</span>. Vous pouvez déposer votre équipement ou demander un enlèvement.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20"
            >
              Terminer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            {/* Choix de l'appareil */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Type d'appareil *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['PC & Ordinateur', 'Téléphone / Tablette', 'Imprimante', 'Autre équipement'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setDevice(type)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      device === type
                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date et Créneau */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Date souhaitée *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Créneau horaire *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="09h00 - 11h00">Matin (09h00 - 11h00)</option>
                  <option value="11h00 - 13h00">Midi (11h00 - 13h00)</option>
                  <option value="14h00 - 16h00">Après-midi (14h00 - 16h00)</option>
                  <option value="16h00 - 18h30">Fin de journée (16h00 - 18h30)</option>
                </select>
              </div>
            </div>

            {/* Nom & Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Kouassi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Téléphone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+225 07 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Panne / Détail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description de la panne (optionnel)
              </label>
              <textarea
                rows="2"
                placeholder="Ex: Ne démarre plus, écran bleu, surchauffe..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              ></textarea>
            </div>

            {/* Bouton de confirmation */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Validation du créneau...</span>
                </>
              ) : (
                <span>Confirmer le rendez-vous</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
