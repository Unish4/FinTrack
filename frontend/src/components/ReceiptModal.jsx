import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

function ReceiptModal({ isOpen, onClose, url, description }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-slate-800">
          <div className="min-w-0">
            <p className="text-xs font-medium text-teal-400 uppercase tracking-wide">
              Receipt Preview
            </p>
            <p className="text-sm sm:text-base font-semibold text-white truncate mt-0.5">
              {description || "Receipt"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs sm:text-sm text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 transition-colors"
              title="Open original"
            >
              <span className="hidden sm:inline">Open</span>
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-4 border-slate-800">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden flex items-center justify-center min-h-60 sm:min-h-80 max-h-[70vh]">
            <img
              src={url}
              alt={description || "Receipt image"}
              className="max-w-full max-h-[68vh] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
