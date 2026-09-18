import { useModal } from '../context/ModalContext';

export default function Toast() {
  const { toasts, removeToast } = useModal();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl text-white backdrop-blur-xl animate-fadeIn transition-all"
        >
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold">
                ✓
              </span>
            ) : toast.type === 'error' ? (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-sm font-bold">
                ✕
              </span>
            ) : (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-bold">
                ℹ
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-sm leading-snug">
            <p className="font-semibold text-slate-100">
              {toast.type === 'success' ? 'Succès' : toast.type === 'error' ? 'Attention' : 'Information'}
            </p>
            <p className="text-slate-300 text-xs mt-0.5">{toast.message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 transition-colors text-xs"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
