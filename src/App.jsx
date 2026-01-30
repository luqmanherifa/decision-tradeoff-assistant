import { useState } from "react";

const DIMENSIONS = [
  { key: "time", label: "Waktu" },
  { key: "money", label: "Uang" },
  { key: "energy", label: "Energi" },
  { key: "stress", label: "Stres" },
  { key: "risk", label: "Risiko" },
  { key: "growth", label: "Growth" },
  { key: "peace", label: "Ketenangan" },
  { key: "flexibility", label: "Fleksibilitas" },
  { key: "opportunity", label: "Kesempatan" },
];

export default function App() {
  const [decisionContext, setDecisionContext] = useState("");
  const [options, setOptions] = useState([]);

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        impacts: [],
      },
    ]);
  };

  const updateOptionTitle = (id, title) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, title } : o)));
  };

  const addImpact = (optionId) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? {
              ...o,
              impacts: [
                ...o.impacts,
                {
                  id: crypto.randomUUID(),
                  dimension: DIMENSIONS[0].key,
                  text: "",
                  value: 0,
                },
              ],
            }
          : o,
      ),
    );
  };

  const updateImpact = (optionId, impactId, patch) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? {
              ...o,
              impacts: o.impacts.map((i) =>
                i.id === impactId ? { ...i, ...patch } : i,
              ),
            }
          : o,
      ),
    );
  };

  const compare = () => {
    if (options.length < 2) return null;

    const totals = options.map((o) => ({
      optionId: o.id,
      title: o.title,
      total: o.impacts.reduce((s, i) => s + Number(i.value || 0), 0),
    }));

    const [a, b] = options;

    const allDims = new Set([
      ...a.impacts.map((i) => i.dimension),
      ...b.impacts.map((i) => i.dimension),
    ]);

    const deltas = [...allDims]
      .map((dim) => {
        const aVal = a.impacts
          .filter((i) => i.dimension === dim)
          .reduce((s, i) => s + Number(i.value || 0), 0);

        const bVal = b.impacts
          .filter((i) => i.dimension === dim)
          .reduce((s, i) => s + Number(i.value || 0), 0);

        return {
          dimension: dim,
          aVal,
          bVal,
          delta: bVal - aVal,
        };
      })
      .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));

    const getBiggestSacrifice = (option) => {
      if (option.impacts.length === 0) return null;
      const negatives = option.impacts.filter((i) => Number(i.value) < 0);
      if (negatives.length === 0) return null;

      const worst = negatives.reduce((min, impact) =>
        Number(impact.value) < Number(min.value) ? impact : min,
      );

      return {
        dimension: worst.dimension,
        value: Number(worst.value),
        text: worst.text,
      };
    };

    const sacrifices = {
      a: getBiggestSacrifice(a),
      b: getBiggestSacrifice(b),
    };

    const totalA = totals[0].total;
    const totalB = totals[1].total;
    const scoreDiff = Math.abs(totalA - totalB);
    const closeCallThreshold = 3;

    const isCloseCall = scoreDiff <= closeCallThreshold;
    const decidingFactors = isCloseCall ? deltas.slice(0, 3) : [];

    const getDimensionContributions = (option) => {
      const contributions = {};
      option.impacts.forEach((impact) => {
        const val = Math.abs(Number(impact.value));
        if (!contributions[impact.dimension]) {
          contributions[impact.dimension] = 0;
        }
        contributions[impact.dimension] += val;
      });
      return contributions;
    };

    const aContributions = getDimensionContributions(a);
    const bContributions = getDimensionContributions(b);

    const allContributions = {};
    Object.keys(aContributions).forEach((dim) => {
      allContributions[dim] =
        (allContributions[dim] || 0) + aContributions[dim];
    });
    Object.keys(bContributions).forEach((dim) => {
      allContributions[dim] =
        (allContributions[dim] || 0) + bContributions[dim];
    });

    const implicitPriorities = Object.entries(allContributions)
      .map(([dimension, contribution]) => ({ dimension, contribution }))
      .sort((x, y) => y.contribution - x.contribution)
      .slice(0, 3);

    return {
      totals,
      deltas,
      a,
      b,
      sacrifices,
      isCloseCall,
      decidingFactors,
      implicitPriorities,
    };
  };

  const result = compare();

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-700 text-white p-4 mb-4">
          <h1 className="text-xl font-bold">Decision Trade-off</h1>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Keputusan
            </h2>
            <input
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              placeholder="Contoh: Beli kopi A atau kopi B"
              value={decisionContext}
              onChange={(e) => setDecisionContext(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Pilihan
            </h2>
            <button
              onClick={addOption}
              className="w-full mb-4 px-4 py-2.5 bg-slate-600 text-white rounded-lg text-sm font-medium active:bg-slate-700"
            >
              + Tambah Opsi
            </button>

            <div className="space-y-4">
              {options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className="border border-slate-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </div>
                    <input
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      placeholder="Nama opsi (misal: Kopi A)"
                      value={opt.title}
                      onChange={(e) =>
                        updateOptionTitle(opt.id, e.target.value)
                      }
                    />
                  </div>

                  <button
                    onClick={() => addImpact(opt.id)}
                    className="w-full mb-3 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 active:bg-slate-200"
                  >
                    + Dampak
                  </button>

                  <div className="space-y-2">
                    {opt.impacts.map((impact) => (
                      <div
                        key={impact.id}
                        className="bg-slate-50 rounded p-2 space-y-2"
                      >
                        <div className="flex gap-2">
                          <select
                            value={impact.dimension}
                            onChange={(e) =>
                              updateImpact(opt.id, impact.id, {
                                dimension: e.target.value,
                              })
                            }
                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                          >
                            {DIMENSIONS.map((d) => (
                              <option key={d.key} value={d.key}>
                                {d.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="0"
                            value={impact.value}
                            onChange={(e) =>
                              updateImpact(opt.id, impact.id, {
                                value: Number(e.target.value),
                              })
                            }
                          />
                        </div>

                        <input
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                          placeholder="Alasan / detail dampak"
                          value={impact.text}
                          onChange={(e) =>
                            updateImpact(opt.id, impact.id, {
                              text: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="px-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                Hasil Perbandingan
              </h2>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Total Score
                </h3>
                <div className="space-y-2">
                  {result.totals.map((t) => (
                    <div
                      key={t.optionId}
                      className="flex justify-between items-center px-3 py-2 bg-slate-100 rounded"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {t.title || "Tanpa Nama"}
                      </span>
                      <span className="text-base font-bold text-slate-800">
                        {t.total}
                      </span>
                    </div>
                  ))}
                </div>

                {result.isCloseCall && (
                  <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    <span className="font-semibold">⚖️ Keputusan Sulit:</span>{" "}
                    Skor hampir sama (selisih ≤3). Faktor penentu ada di detail
                    trade-off.
                  </div>
                )}
              </div>

              {(result.sacrifices.a || result.sacrifices.b) && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                    Pengorbanan Terbesar
                  </h3>
                  <div className="space-y-2">
                    {result.sacrifices.a && (
                      <div className="px-3 py-2 bg-red-50 border border-red-200 rounded">
                        <div className="text-xs font-semibold text-red-700 mb-1">
                          {result.a.title || "Opsi A"}
                        </div>
                        <div className="text-xs text-slate-700">
                          <span className="font-medium">
                            {
                              DIMENSIONS.find(
                                (d) => d.key === result.sacrifices.a.dimension,
                              )?.label
                            }
                            :
                          </span>{" "}
                          {result.sacrifices.a.value}
                          {result.sacrifices.a.text &&
                            ` - ${result.sacrifices.a.text}`}
                        </div>
                      </div>
                    )}
                    {result.sacrifices.b && (
                      <div className="px-3 py-2 bg-red-50 border border-red-200 rounded">
                        <div className="text-xs font-semibold text-red-700 mb-1">
                          {result.b.title || "Opsi B"}
                        </div>
                        <div className="text-xs text-slate-700">
                          <span className="font-medium">
                            {
                              DIMENSIONS.find(
                                (d) => d.key === result.sacrifices.b.dimension,
                              )?.label
                            }
                            :
                          </span>{" "}
                          {result.sacrifices.b.value}
                          {result.sacrifices.b.text &&
                            ` - ${result.sacrifices.b.text}`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Trade-offs Terbesar
                </h3>
                <div className="space-y-2">
                  {result.deltas.slice(0, 5).map((d, index) => {
                    const dimLabel =
                      DIMENSIONS.find((dim) => dim.key === d.dimension)
                        ?.label || d.dimension;
                    return (
                      <div
                        key={d.dimension}
                        className="px-3 py-2 bg-slate-50 rounded border border-slate-200"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-700">
                            {dimLabel}
                          </span>
                          <span
                            className={`text-sm font-bold ${d.delta > 0 ? "text-green-600" : d.delta < 0 ? "text-red-600" : "text-slate-600"}`}
                          >
                            {d.delta > 0 ? "+" : ""}
                            {d.delta}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>
                            {result.a.title || "A"}: {d.aVal}
                          </span>
                          <span>
                            {result.b.title || "B"}: {d.bVal}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Insight
                </h3>
                {result.deltas[0] && (
                  <div className="px-3 py-3 bg-blue-50 rounded border border-blue-200 text-sm text-slate-700 leading-relaxed">
                    Perbedaan terbesar ada di{" "}
                    <span className="font-semibold text-blue-700">
                      {DIMENSIONS.find(
                        (d) => d.key === result.deltas[0].dimension,
                      )?.label || result.deltas[0].dimension}
                    </span>
                    . Memilih{" "}
                    <span className="font-semibold">
                      {result.deltas[0].delta > 0
                        ? result.b.title || "Opsi B"
                        : result.a.title || "Opsi A"}
                    </span>{" "}
                    memberikan keuntungan lebih di dimensi ini.
                  </div>
                )}
              </div>

              {result.implicitPriorities.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                    Prioritas Tersembunyi
                  </h3>
                  <div className="px-3 py-3 bg-purple-50 rounded border border-purple-200">
                    <p className="text-xs text-slate-600 mb-2">
                      Berdasarkan bobot total yang kamu berikan, dimensi ini
                      tampak paling penting:
                    </p>
                    <div className="space-y-1">
                      {result.implicitPriorities.map((p, idx) => (
                        <div
                          key={p.dimension}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="text-purple-600 font-semibold">
                            {idx + 1}.
                          </span>
                          <span className="text-slate-700 font-medium">
                            {DIMENSIONS.find((d) => d.key === p.dimension)
                              ?.label || p.dimension}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            (bobot: {p.contribution})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
