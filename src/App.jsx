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
      .filter((d) => d.delta !== 0)
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

    const hasExtremeSacrifice =
      (sacrifices.a && sacrifices.a.value <= -5) ||
      (sacrifices.b && sacrifices.b.value <= -5);

    return {
      totals,
      deltas,
      a,
      b,
      sacrifices,
      isCloseCall,
      hasExtremeSacrifice,
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
              <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                Hasil
              </h2>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      {result.a.title || "Opsi A"}
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                      {result.totals[0].total}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-800">
                      {result.totals[1].total}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {result.b.title || "Opsi B"}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-slate-600">
                    {result.totals[0].total > result.totals[1].total ? (
                      <>
                        <span className="font-semibold text-slate-800">
                          {result.a.title || "Opsi A"}
                        </span>{" "}
                        unggul{" "}
                        {Math.abs(
                          result.totals[0].total - result.totals[1].total,
                        )}{" "}
                        poin
                      </>
                    ) : result.totals[0].total < result.totals[1].total ? (
                      <>
                        <span className="font-semibold text-slate-800">
                          {result.b.title || "Opsi B"}
                        </span>{" "}
                        unggul{" "}
                        {Math.abs(
                          result.totals[0].total - result.totals[1].total,
                        )}{" "}
                        poin
                      </>
                    ) : (
                      <>Skor seimbang</>
                    )}
                  </p>
                </div>
              </div>

              {result.deltas.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase">
                    Trade-off Utama
                  </h3>
                  <div className="space-y-2">
                    {result.deltas.slice(0, 3).map((d) => {
                      const dimLabel =
                        DIMENSIONS.find((dim) => dim.key === d.dimension)
                          ?.label || d.dimension;

                      const winner = d.delta > 0 ? result.b : result.a;
                      const loser = d.delta > 0 ? result.a : result.b;
                      const winnerName =
                        winner.title || (d.delta > 0 ? "Opsi B" : "Opsi A");
                      const loserName =
                        loser.title || (d.delta > 0 ? "Opsi A" : "Opsi B");

                      return (
                        <div
                          key={d.dimension}
                          className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-700">
                              {dimLabel}
                            </span>
                            <span className="text-sm font-bold text-slate-600">
                              Δ {Math.abs(d.delta)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Pilih{" "}
                            <span className="font-semibold text-slate-800">
                              {winnerName}
                            </span>{" "}
                            → dapat +{Math.abs(d.delta)}{" "}
                            {dimLabel.toLowerCase()} dibanding{" "}
                            <span className="font-semibold text-slate-800">
                              {loserName}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(result.isCloseCall || result.hasExtremeSacrifice) && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase">
                    Catatan Penting
                  </h3>

                  {result.isCloseCall && (
                    <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                      <span className="font-semibold">⚖️ Keputusan Sulit:</span>{" "}
                      Skor hampir sama (selisih ≤3). Pertimbangkan prioritas
                      pribadi Anda.
                    </div>
                  )}

                  {result.hasExtremeSacrifice && (
                    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-900">
                      <span className="font-semibold">
                        ⚠️ Pengorbanan Besar:
                      </span>{" "}
                      Ada dampak negatif signifikan (≤-5) di salah satu opsi.
                      {result.sacrifices.a &&
                        result.sacrifices.a.value <= -5 && (
                          <div className="mt-1">
                            • {result.a.title || "Opsi A"}:{" "}
                            {
                              DIMENSIONS.find(
                                (d) => d.key === result.sacrifices.a.dimension,
                              )?.label
                            }{" "}
                            ({result.sacrifices.a.value})
                          </div>
                        )}
                      {result.sacrifices.b &&
                        result.sacrifices.b.value <= -5 && (
                          <div className="mt-1">
                            • {result.b.title || "Opsi B"}:{" "}
                            {
                              DIMENSIONS.find(
                                (d) => d.key === result.sacrifices.b.dimension,
                              )?.label
                            }{" "}
                            ({result.sacrifices.b.value})
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
