import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  isDangerous = true,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center
                           shrink-0 ${isDangerous ? "bg-rose-500/10" : "bg-amber-500/10"}`}
          >
            <AlertTriangle
              size={20}
              className={isDangerous ? "text-rose-400" : "text-amber-400"}
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-slate-700 bg-slate-800 rounded-xl
                       text-sm font-medium text-slate-300
                       hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium
                        text-white transition-colors
                        ${
                          isDangerous
                            ? "bg-rose-500 text-white hover:bg-rose-400"
                            : "bg-amber-500 text-white hover:bg-amber-400"
                        }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
