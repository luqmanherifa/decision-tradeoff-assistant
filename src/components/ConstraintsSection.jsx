export default function ConstraintsSection({
  constraints,
  options,
  onAddConstraint,
  onUpdateConstraint,
  onUpdateCheck,
  onRemoveConstraint,
}) {
  if (options.length < 2) return null;

  return (
    <div className="px-4 mb-4">
      <div className="bg-white rounded-xl border-2 border-amber-300 p-4">
        <div className="mb-3">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Batasan Penting
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Ada yang tidak bisa dikompromikan? Tulis di sini
          </p>
        </div>

        <button
          onClick={onAddConstraint}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-semibold active:scale-[0.98] transition-transform"
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
    <div className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
      <input
        className="w-full px-3 py-2.5 border-2 border-amber-300 rounded-lg text-sm font-semibold mb-4 focus:outline-none focus:border-amber-500"
        placeholder="Anggaran kopi 300 ribu per bulan"
        value={constraint.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
      />

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Tingkat Batasan
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <label
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
              constraint.type === "soft"
                ? "bg-gradient-to-br from-amber-100 to-orange-100 border-amber-500"
                : "bg-white border-amber-200"
            }`}
          >
            <input
              type="radio"
              name={`type-${constraint.id}`}
              checked={constraint.type === "soft"}
              onChange={() => onUpdate({ type: "soft" })}
              className="w-4 h-4 border-2 border-slate-400 text-amber-600 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-900">Lunak</div>
              <div className="text-xs text-amber-700 font-medium">
                Kena penalti
              </div>
            </div>
          </label>
          <label
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
              constraint.type === "hard"
                ? "bg-gradient-to-br from-red-100 to-rose-100 border-red-500"
                : "bg-white border-amber-200"
            }`}
          >
            <input
              type="radio"
              name={`type-${constraint.id}`}
              checked={constraint.type === "hard"}
              onChange={() => onUpdate({ type: "hard" })}
              className="w-4 h-4 border-2 border-slate-400 text-red-600 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-xs font-bold text-red-900">Keras</div>
              <div className="text-xs text-red-700 font-bold">GUGUR</div>
            </div>
          </label>
        </div>

        {constraint.type === "soft" && (
          <div className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 rounded-lg p-3">
            <label className="text-xs text-amber-900 font-bold block mb-2 uppercase tracking-wide">
              Penalti kalau dilanggar
            </label>
            <input
              type="number"
              className="w-full px-3 py-2.5 border-2 border-amber-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-amber-500"
              value={constraint.penalty}
              onChange={(e) => onUpdate({ penalty: Number(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-bold text-amber-900 mb-3 uppercase tracking-wide">
          Pilihan yang Memenuhi
        </h3>
        <div className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 rounded-lg p-3 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-white border-2 border-amber-200 rounded-lg cursor-pointer hover:border-amber-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={constraint.checks[opt.id] === true}
                onChange={(e) => onUpdateCheck(opt.id, e.target.checked)}
                className="w-4 h-4 rounded border-2 border-slate-400 text-amber-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-700 font-semibold">
                {opt.title || `Pilihan ${options.indexOf(opt) + 1}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="w-full px-4 py-2.5 text-sm text-red-700 font-bold bg-white border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
      >
        Hapus Batasan
      </button>
    </div>
  );
}
