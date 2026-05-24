import { useEffect, useRef, useState } from "react";
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
  RefreshCcw,
  Trash2,
  Check,
} from "lucide-react";
import useTransactionStore from "../store/useTransactionStore.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

function ReceiptUploader({ transaction, onClose = () => {} }) {
  const { addReceipt, removeReceipt } = useTransactionStore();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const hasExistingReceipt = !!transaction.receipt?.url;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await addReceipt(transaction._id, selectedFile);
      URL.revokeObjectURL(preview);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // Error is already handled by store toast
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelPreview = () => {
    URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    try {
      await removeReceipt(transaction._id);
    } catch {
      // Error is already handled by store toast
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-slate-900">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">Receipt</h3>
          <p className="text-xs text-slate-400 mt-1">
            Attach JPG, PNG, or WebP (max 5MB).
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      {hasExistingReceipt && !preview && (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/50">
            <img
              src={transaction.receipt.url}
              alt="Receipt"
              className="w-full object-contain max-h-56 sm:max-h-72"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-900/95 p-2 rounded-lg shadow-sm text-slate-400 hover:text-teal-400 border border-slate-800 transition-colors"
                title="Replace receipt"
              >
                <RefreshCcw size={14} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-slate-900/95 p-2 rounded-lg shadow-sm text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                title="Remove receipt"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2">
            <p className="text-xs text-slate-400 truncate">
              Current receipt attached
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-400">
              <Check size={12} />
              Saved
            </span>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 border border-slate-700 bg-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-teal-500/30 bg-teal-500/5">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full object-contain max-h-56 sm:max-h-72"
            />
            <button
              onClick={handleCancelPreview}
              className="absolute top-2 right-2 bg-slate-900/95 p-2 rounded-lg shadow-sm text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Remove selected file"
            >
              <X size={14} />
            </button>
          </div>

          {selectedFile && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 flex items-center justify-between gap-2">
              <p className="text-xs text-slate-300 truncate">
                {selectedFile.name}
              </p>
              <span className="text-xs text-slate-500 shrink-0">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCancelPreview}
              disabled={isUploading}
              className="py-2.5 border border-slate-700 bg-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Choose another
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="py-2.5 bg-teal-500 text-slate-950 rounded-xl text-sm font-bold hover:bg-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Upload Receipt
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!hasExistingReceipt && !preview && (
        <div className="space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-700 rounded-2xl py-10 sm:py-12 px-4 flex flex-col items-center gap-3 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
          >
            <div className="w-11 h-11 bg-slate-800 group-hover:bg-teal-500/20 rounded-xl flex items-center justify-center transition-colors">
              <ImageIcon
                size={20}
                className="text-slate-400 group-hover:text-teal-400"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300 group-hover:text-teal-400">
                Select a receipt image
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap to browse files
              </p>
            </div>
          </button>

          <button
            onClick={handleClose}
            className="w-full py-2.5 border border-slate-700 bg-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Remove receipt?"
        message="The receipt image will be permanently deleted."
        confirmLabel="Remove"
      />
    </div>
  );
}

export default ReceiptUploader;
