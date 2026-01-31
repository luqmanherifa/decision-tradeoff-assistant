import { useState } from "react";
import { WarningTriangleIcon, InfoIcon } from "./icons";

export default function ConstraintsSection({
  constraints,
  options,
  onAddConstraint,
  onUpdateConstraint,
  onUpdateCheck,
  onRemoveConstraint,
}) {
  const [showInfo, setShowInfo] = useState(false);

  if (options.length < 2) return null;

  return (
    <div className="px-5 mb-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <WarningTriangleIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Batasan Penting
            </h2>
            <div className="relative">
              <button
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                className="w-5 h-5 rounded-full border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:border-stone-400 transition-colors"
              >
                <InfoIcon className="w-3 h-3" />
              </button>
              {showInfo && (
                <div className="absolute left-0 top-7 z-10 w-64 bg-stone-800 text-white text-xs rounded-lg p-3 shadow-lg">
                  <p className="leading-relaxed tracking-normal">
                    Ada yang tidak bisa dikompromikan? Tulis di sini
                  </p>
                  <div className="absolute -top-1 left-2 w-2 h-2 bg-stone-800 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onAddConstraint}
          className="w-full mb-4 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-colors"
        >
          + Tambah Batasan
        </button>

        <div className="space-y-3">
          {constraints.map((constraint) => (
            <ConstraintItem
              key={constraint.id}
              constraint={constraint}
              options={options}
              onUpdate={(patch) => onUpdateConstraint(constraint.id, patch)}
              onUpdateCheck={(optionId, value) =>
                onUpdateCheck(constraint.id, optionId, value)
              }
              onRemove={() => onRemoveConstraint(constraint.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConstraintItem({
  constraint,
  options,
  onUpdate,
  onUpdateCheck,
  onRemove,
}) {
  return (
    <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
      <input
        className="w-full px-4 py-3 border border-stone-300 rounded-lg text-sm font-semibold mb-4 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
        placeholder="Anggaran kopi 300 ribu per bulan"
        value={constraint.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
      />

      <div className="mb-4">
        <h3 className="text-xs font-semibold text-stone-600 mb-3 tracking-normal">
          TINGKAT BATASAN
        </h3>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <label
            className={`flex items-center gap-2.5 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${
              constraint.type === "soft"
                ? "bg-white border-amber-400"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              name={`type-${constraint.id}`}
              checked={constraint.type === "soft"}
              onChange={() => onUpdate({ type: "soft" })}
              className="w-4 h-4 text-amber-500 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-amber-600 tracking-wide">
                PENALTI
              </div>
            </div>
          </label>

          <label
            className={`flex items-center gap-2.5 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${
              constraint.type === "hard"
                ? "bg-white border-rose-400"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              name={`type-${constraint.id}`}
              checked={constraint.type === "hard"}
              onChange={() => onUpdate({ type: "hard" })}
              className="w-4 h-4 text-rose-500 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-rose-600 tracking-wide">
                GUGUR
              </div>
            </div>
          </label>
        </div>

        {constraint.type === "soft" && (
          <div className="bg-white border border-amber-200 rounded-lg p-3">
            <label className="text-xs text-stone-600 font-semibold block mb-2 tracking-normal">
              PENALTI JIKA DILANGGAR
            </label>
            <input
              type="number"
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm font-bold text-center text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
              value={constraint.penalty}
              onChange={(e) => onUpdate({ penalty: Number(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-semibold text-stone-600 mb-3 tracking-normal">
          PILIHAN YANG MEMENUHI
        </h3>
        <div className="bg-white border border-stone-200 rounded-lg p-2.5 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer hover:border-amber-300 hover:bg-stone-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={constraint.checks[opt.id] === true}
                onChange={(e) => onUpdateCheck(opt.id, e.target.checked)}
                className="w-4 h-4 rounded border-stone-400 text-amber-500 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm text-stone-700 font-medium flex-1 tracking-normal">
                {opt.title || `Pilihan ${options.indexOf(opt) + 1}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="w-full px-4 py-2.5 text-sm text-rose-600 font-bold bg-white border border-stone-300 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors"
      >
        Hapus Batasan
      </button>
    </div>
  );
}
