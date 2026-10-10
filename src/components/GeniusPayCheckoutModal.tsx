import { useState, type FormEvent } from 'react';
import { geniusPayService } from '../services/geniusPay';

export interface GeniusPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  hotelName: string;
  roomName: string;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess: (transactionId: string, method: string) => void;
}

type PaymentChannel = 'wave' | 'orange_money' | 'mtn_money' | 'moov_money' | 'card';

export default function GeniusPayCheckoutModal({
  isOpen,
  onClose,
  amount,
  hotelName,
  roomName,
  orderId = `CMD-${Date.now().toString().slice(-6)}`,
  customerName = 'Client GrandH',
  customerEmail = 'client@grandh.ci',
  customerPhone = '0700000000',
  onPaymentSuccess,
}: GeniusPayModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('wave');
  const [phoneNumber, setPhoneNumber] = useState(customerPhone);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [transactionId, setTransactionId] = useState('');
  const [showConfigApiKey, setShowConfigApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geniusPayService.getApiKey());

  if (!isOpen) return null;

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setStep('processing');

    try {
      const res = await geniusPayService.processPayment({
        amount,
        description: `Acompte réservation ${hotelName} (${roomName})`,
        orderId,
        customerName,
        customerEmail,
        customerPhone: phoneNumber,
        paymentMethod: selectedChannel,
        hotelName,
        roomName,
      });

      if (res.success) {
        setTransactionId(res.transactionId);
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(res.transactionId, selectedChannel);
        }, 1800);
      }
    } catch {
      setStep('form');
    }
  };

  const handleSaveApiKey = () => {
    geniusPayService.setApiCredentials(apiKeyInput);
    setShowConfigApiKey(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100">
        
        {/* En-tête Fintech GeniusPay */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white font-black text-xs shadow-md">
                ⚡
              </span>
              <div>
                <p className="text-xs font-mono font-bold tracking-wider text-violet-300">GENIUSPAY GATEWAY</p>
                <p className="text-[10px] text-slate-400">Paiement Mobile Money Sécurisé</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfigApiKey(!showConfigApiKey)}
                title="Configurer ma clé API GeniusPay"
                className="text-[11px] font-mono text-violet-300 hover:text-white bg-white/10 px-2 py-1 rounded-lg"
              >
                ⚙️ Clé API
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-7 w-7 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Configuration rapide de la clé API si demandée */}
          {showConfigApiKey && (
            <div className="mt-3 rounded-2xl bg-slate-900 p-3 border border-violet-500/30 text-xs space-y-2">
              <p className="font-bold text-violet-300">Votre Clé API GeniusPay (pay.genius.ci) :</p>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Ex: gp_live_... ou gp_sandbox_..."
                className="w-full rounded-xl bg-slate-950 px-3 py-1.5 text-xs text-white border border-slate-700 outline-none focus:border-violet-500 font-mono"
              />
              <button
                onClick={handleSaveApiKey}
                className="rounded-lg bg-violet-600 px-3 py-1 font-bold text-white hover:bg-violet-500"
              >
                Enregistrer la clé
              </button>
            </div>
          )}

          {/* Résumé du montant */}
          <div className="mt-4 rounded-2xl bg-white/10 p-4 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Montant à régler</p>
              <p className="text-xs text-slate-400 truncate max-w-[180px]">{hotelName} · {roomName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-emerald-400 tracking-tight">
                {amount.toLocaleString()} <span className="text-xs text-emerald-300">FCFA</span>
              </p>
              <p className="text-[10px] text-slate-300">Acompte garanti</p>
            </div>
          </div>
        </div>

        {/* Corps de la modale selon l'étape */}
        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handlePay} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Sélectionnez votre moyen de paiement
                </label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    { id: 'wave' as const, name: 'Wave', color: 'bg-sky-50 text-sky-700 border-sky-300', icon: '🌊', badge: '0% frais' },
                    { id: 'orange_money' as const, name: 'Orange', color: 'bg-orange-50 text-orange-700 border-orange-300', icon: '🟠', badge: '#144#' },
                    { id: 'mtn_money' as const, name: 'MTN MoMo', color: 'bg-yellow-50 text-yellow-800 border-yellow-300', icon: '🟡', badge: '*133#' },
                    { id: 'moov_money' as const, name: 'Moov', color: 'bg-blue-50 text-blue-700 border-blue-300', icon: '🔵', badge: '*155#' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChannel(ch.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition text-center ${
                        selectedChannel === ch.id
                          ? `${ch.color} font-black shadow-sm ring-2 ring-violet-500/30 scale-[1.02]`
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl mb-1">{ch.icon}</span>
                      <span className="text-xs font-bold">{ch.name}</span>
                      <span className="text-[9px] font-semibold opacity-75">{ch.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saisie du numéro Mobile Money */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Numéro de compte {selectedChannel.toUpperCase().replace('_', ' ')} (Côte d'Ivoire) *
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-violet-600 focus-within:bg-white transition">
                  <span className="px-3.5 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 border-r border-slate-200">
                    🇨🇮 +225
                  </span>
                  <input
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ex: 07 08 09 10 11"
                    className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {selectedChannel === 'wave'
                    ? 'Une notification d’autorisation de débit s’ouvrira dans votre app Wave.'
                    : 'Un message USSD de confirmation sera envoyé sur votre téléphone.'}
                </p>
              </div>

              {/* Bouton de confirmation */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 font-black text-white shadow-lg shadow-emerald-600/30 transition hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>🔒 Payer {amount.toLocaleString()} FCFA</span>
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <span>🛡️</span> Transaction cryptée 256-bit certifiée GeniusPay
                </p>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-2xl animate-spin">
                ⏳
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">Validation en cours sur GeniusPay...</h4>
                <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                  Veuillez vérifier votre téléphone et valider le paiement Mobile Money de{' '}
                  <strong className="text-slate-900">{amount.toLocaleString()} FCFA</strong>.
                </p>
              </div>
              <div className="flex justify-center gap-1.5 pt-2">
                <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl font-black">
                ✓
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Paiement Validé avec Succès !</h4>
                <p className="mt-1 text-xs text-emerald-700 font-bold">
                  Transaction GeniusPay : {transactionId}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Votre acompte a été encaissé. Votre réservation est immédiatement confirmée auprès de l'hôtel.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
