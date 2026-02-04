import { QuestionCircleIcon, EditIcon, CheckIcon } from "./icons";
import { useState } from "react";

export default function DecisionContext({
  value,
  onChange,
  onConfirm,
  isConfirmed,
}) {
  const [isEditing, setIsEditing] = useState(!isConfirmed);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm();
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="px-5 mb-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <QuestionCircleIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Keputusan Apa?
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors bg-stone-50 disabled:bg-stone-100 disabled:text-stone-700 disabled:cursor-not-allowed"
            placeholder="Beli kopi di kafe atau bikin sendiri?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={!isEditing}
          />
          {isEditing ? (
            <button
              onClick={handleConfirm}
              disabled={!value.trim()}
              className="w-10 h-10 flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              title="Simpan"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="w-10 h-10 flex-shrink-0 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-lg transition-colors flex items-center justify-center"
              title="Ubah"
            >
              <EditIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
