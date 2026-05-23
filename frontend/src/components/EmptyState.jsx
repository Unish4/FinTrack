import { Plus } from "lucide-react";

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20
                    border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50"
    >
      {Icon && (
        <div
          className="w-12 h-12 bg-white rounded-2xl border border-gray-200
                        flex items-center justify-center mb-4 shadow-sm"
        >
          <Icon size={22} className="text-gray-400" />
        </div>
      )}
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1 text-center max-w-xs">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 flex items-center gap-2 bg-indigo-600 text-white
                     px-4 py-2 rounded-xl text-sm font-medium
                     hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
