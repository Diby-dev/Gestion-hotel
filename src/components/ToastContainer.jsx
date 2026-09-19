import { useModal } from '../context/ModalContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useModal();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-sm animate-fadeIn transition-all ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-200'
              : 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-green-400 font-bold text-base">✓</span>
            <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
