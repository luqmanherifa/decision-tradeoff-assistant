import { DIMENSIONS } from "../constants/dimensions";
import { ClipboardListIcon } from "./icons";

export default function OptionsSection({
  options,
  viewMode,
  onViewModeChange,
  onAddOption,
  onUpdateTitle,
  onAddImpact,
  onUpdateImpact,
}) {
  return (
    <div className="px-5 mb-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <ClipboardListIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Pilihan
            </h2>
          </div>

          <div className="flex gap-1 bg-stone-100 rounded-lg p-1 border border-stone-200">
            <button
              onClick={() => onViewModeChange("detail")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                viewMode === "detail"
                  ? "bg-amber-500 text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Lengkap
            </button>
            <button
              onClick={() => onViewModeChange("quick")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                viewMode === "quick"
                  ? "bg-amber-500 text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Cepat
            </button>
          </div>
        </div>

        <button
          onClick={onAddOption}
          className="w-full mb-4 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-colors"
        >
          + Tambah Pilihan
        </button>

        {viewMode === "detail" ? (
          <DetailView
            options={options}
            onUpdateTitle={onUpdateTitle}
            onAddImpact={onAddImpact}
            onUpdateImpact={onUpdateImpact}
          />
        ) : (
          <QuickView
            options={options}
            onUpdateTitle={onUpdateTitle}
            onAddImpact={onAddImpact}
            onUpdateImpact={onUpdateImpact}
          />
        )}
      </div>
    </div>
  );
}

function DetailView({ options, onUpdateTitle, onAddImpact, onUpdateImpact }) {
  const colors = [
    {
      bg: "bg-blue-50",
      badge: "bg-blue-500",
      border: "border-blue-200",
      button: "bg-blue-500 hover:bg-blue-600",
    },
    {
      bg: "bg-purple-50",
      badge: "bg-purple-500",
      border: "border-purple-200",
      button: "bg-purple-500 hover:bg-purple-600",
    },
    {
      bg: "bg-emerald-50",
      badge: "bg-emerald-500",
      border: "border-emerald-200",
      button: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      bg: "bg-amber-50",
      badge: "bg-amber-500",
      border: "border-amber-200",
      button: "bg-amber-500 hover:bg-amber-600",
    },
  ];

  return (
    <div className="space-y-3">
      {options.map((opt, idx) => {
        const color = colors[idx % colors.length];

        return (
          <div
            key={opt.id}
            className={`border ${color.border} rounded-xl p-4 ${color.bg}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-8 h-8 rounded-full ${color.badge} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
              >
                {idx + 1}
              </div>
              <input
                className="flex-1 px-3 py-2.5 border border-stone-300 rounded-lg text-sm font-semibold bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder={idx % 2 === 0 ? "Beli di Kafe" : "Bikin Sendiri"}
                value={opt.title}
                onChange={(e) => onUpdateTitle(opt.id, e.target.value)}
              />
            </div>

            <button
              onClick={() => onAddImpact(opt.id)}
              className={`w-full mb-3 px-4 py-2.5 ${color.button} text-white text-xs font-bold rounded-lg transition-colors`}
            >
              + Dampak
            </button>

            <div className="space-y-2.5">
              {opt.impacts.map((impact) => (
                <ImpactItem
                  key={impact.id}
                  impact={impact}
                  optionIndex={idx}
                  onUpdate={(patch) => onUpdateImpact(opt.id, impact.id, patch)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuickView({ options, onUpdateTitle, onAddImpact, onUpdateImpact }) {
  const colors = [
    {
      bg: "bg-blue-50",
      badge: "bg-blue-500",
      border: "border-blue-200",
      button: "bg-blue-500 hover:bg-blue-600",
    },
    {
      bg: "bg-purple-50",
      badge: "bg-purple-500",
      border: "border-purple-200",
      button: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div>
      {options.length > 2 && (
        <div className="mb-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-semibold text-amber-900 leading-relaxed tracking-normal">
            Mode cepat maksimal 2 pilihan. Pilihan ke-3 dan seterusnya
            disembunyikan.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {options.slice(0, 2).map((opt, idx) => {
          const color = colors[idx % colors.length];

          return (
            <div
              key={opt.id}
              className={`border ${color.border} rounded-xl p-3 ${color.bg}`}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className={`w-7 h-7 flex-shrink-0 rounded-full ${color.badge} text-white flex items-center justify-center text-xs font-bold`}
                >
                  {idx + 1}
                </div>
                <input
                  className="flex-1 min-w-0 px-2.5 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder={idx % 2 === 0 ? "Beli di Kafe" : "Bikin Sendiri"}
                  value={opt.title}
                  onChange={(e) => onUpdateTitle(opt.id, e.target.value)}
                />
              </div>

              <button
                onClick={() => onAddImpact(opt.id)}
                className={`w-full mb-2.5 px-3 py-2 ${color.button} text-white text-xs font-bold rounded-lg transition-colors`}
              >
                + Dampak
              </button>

              <div className="space-y-2">
                {opt.impacts.map((impact) => (
                  <div
                    key={impact.id}
                    className="bg-white rounded-lg p-2 border border-stone-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <select
                        value={impact.dimension}
                        onChange={(e) =>
                          onUpdateImpact(opt.id, impact.id, {
                            dimension: e.target.value,
                          })
                        }
                        className="flex-1 min-w-0 px-2 py-1.5 border border-stone-300 rounded-md text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        {DIMENSIONS.map((d) => (
                          <option key={d.key} value={d.key}>
                            {d.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="w-14 flex-shrink-0 px-1.5 py-1.5 border border-stone-300 rounded-md text-xs font-bold text-center text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="0"
                        value={impact.value}
                        onChange={(e) =>
                          onUpdateImpact(opt.id, impact.id, {
                            value: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImpactItem({ impact, optionIndex, onUpdate }) {
  const getPlaceholder = () => {
    if (optionIndex % 2 === 0) {
      const placeholders = {
        time: "Langsung jadi",
        money: "25 ribu per cangkir",
        energy: "Tinggal pesan saja",
        stress: "Tidak ribet pagi",
        risk: "Kualitas selalu konsisten",
        growth: "Tidak belajar skill",
        peace: "Suasana kafe nyaman",
        flexibility: "Tergantung jam buka",
        opportunity: "Ketemu teman barista",
      };
      return placeholders[impact.dimension] || "";
    } else {
      const placeholders = {
        time: "Perlu waktu buat",
        money: "5 ribu per cangkir",
        energy: "Harus nyiapin sendiri",
        stress: "Ribet kalau terburu",
        risk: "Kadang gagal rasanya",
        growth: "Belajar skill baru",
        peace: "Menikmati proses sendiri",
        flexibility: "Bisa kapan saja",
        opportunity: "Hemat uang bulanan",
      };
      return placeholders[impact.dimension] || "";
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-stone-200 space-y-2">
      <div className="flex gap-2">
        <select
          value={impact.dimension}
          onChange={(e) => onUpdate({ dimension: e.target.value })}
          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
        >
          {DIMENSIONS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-16 px-2.5 py-2 border border-stone-300 rounded-lg text-xs font-bold text-center text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="0"
          value={impact.value}
          onChange={(e) => onUpdate({ value: Number(e.target.value) })}
        />
      </div>

      <input
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
        placeholder={getPlaceholder()}
        value={impact.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
      />
    </div>
  );
}
