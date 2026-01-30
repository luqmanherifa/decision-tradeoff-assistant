import { useState } from "react";

const DIMENSIONS = [
  { key: "time", label: "Waktu" },
  { key: "money", label: "Uang" },
  { key: "energy", label: "Energi" },
  { key: "stress", label: "Stres" },
  { key: "risk", label: "Risiko" },
  { key: "growth", label: "Pertumbuhan" },
  { key: "peace", label: "Ketenangan" },
  { key: "flexibility", label: "Fleksibilitas" },
  { key: "opportunity", label: "Kesempatan" },
];

export default function App() {
  const [decisionContext, setDecisionContext] = useState("");
  const [options, setOptions] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [constraints, setConstraints] = useState([]);
  const [viewMode, setViewMode] = useState("detail");

  const addConstraint = () => {
    setConstraints((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "soft",
        penalty: -10,
        checks: {},
      },
    ]);
  };

  const updateConstraint = (id, patch) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const updateConstraintCheck = (constraintId, optionId, value) => {
    setConstraints((prev) =>
      prev.map((c) =>
        c.id === constraintId
          ? { ...c, checks: { ...c.checks, [optionId]: value } }
          : c,
      ),
    );
  };

  const removeConstraint = (id) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id));
  };

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

    const totals = options.map((o) => {
      const impactTotal = o.impacts.reduce(
        (s, i) => s + Number(i.value || 0),
        0,
      );

      let constraintPenalty = 0;
      const violations = [];

      constraints.forEach((constraint) => {
        const passed = constraint.checks[o.id];
        if (passed === false) {
          if (constraint.type === "soft") {
            constraintPenalty += constraint.penalty;
          }
          violations.push({
            text: constraint.text,
            type: constraint.type,
            penalty: constraint.type === "soft" ? constraint.penalty : 0,
          });
        }
      });

      return {
        optionId: o.id,
        title: o.title,
        impactTotal,
        constraintPenalty,
        total: impactTotal + constraintPenalty,
        violations,
        isDisqualified: violations.some((v) => v.type === "hard"),
      };
    });

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

  const getFilteredDeltas = () => {
    if (!result || !result.deltas) return [];

    let filtered = result.deltas;

    switch (filterMode) {
      case "positive":
        filtered = result.deltas.filter((d) => d.delta > 0);
        break;
      case "negative":
        filtered = result.deltas.filter((d) => d.delta < 0);
        break;
      case "significant":
        filtered = result.deltas.filter((d) => Math.abs(d.delta) > 3);
        break;
      default:
        filtered = result.deltas;
    }

    return filtered.slice(0, 3);
  };

  const filteredDeltas = getFilteredDeltas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-6">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white px-4 py-5 mb-4">
          <h1 className="text-lg font-bold">Bandingin Pilihan</h1>
          <p className="text-xs text-slate-200 mt-1">
            Lihat jelas apa yang kamu dapat dan korbankan
          </p>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
            <h2 className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              Keputusan Apa?
            </h2>
            <input
              className="w-full px-3 py-2.5 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-500"
              placeholder="Beli kopi di cafe atau bikin sendiri?"
              value={decisionContext}
              onChange={(e) => setDecisionContext(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Pilihan
              </h2>
              <div className="flex gap-1 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-1 border border-slate-200">
                <button
                  onClick={() => setViewMode("detail")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    viewMode === "detail"
                      ? "bg-gradient-to-r from-slate-700 to-slate-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  Lengkap
                </button>
                <button
                  onClick={() => setViewMode("quick")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    viewMode === "quick"
                      ? "bg-gradient-to-r from-slate-700 to-slate-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  Cepat
                </button>
              </div>
            </div>
            <button
              onClick={addOption}
              className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              + Tambah Pilihan
            </button>

            {viewMode === "detail" ? (
              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="border-2 border-slate-300 rounded-xl p-3 bg-gradient-to-br from-white to-slate-50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <input
                        className="flex-1 px-3 py-2.5 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-slate-500"
                        placeholder={
                          idx === 0 ? "Beli di Cafe" : "Bikin Sendiri"
                        }
                        value={opt.title}
                        onChange={(e) =>
                          updateOptionTitle(opt.id, e.target.value)
                        }
                      />
                    </div>

                    <button
                      onClick={() => addImpact(opt.id)}
                      className="w-full mb-3 px-3 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-semibold rounded-lg border-2 border-slate-200 active:scale-[0.98] transition-transform"
                    >
                      + Dampak
                    </button>

                    <div className="space-y-2">
                      {opt.impacts.map((impact) => (
                        <div
                          key={impact.id}
                          className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-2.5 border-2 border-slate-200 space-y-2"
                        >
                          <div className="flex gap-2">
                            <select
                              value={impact.dimension}
                              onChange={(e) =>
                                updateImpact(opt.id, impact.id, {
                                  dimension: e.target.value,
                                })
                              }
                              className="flex-1 px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-500"
                            >
                              {DIMENSIONS.map((d) => (
                                <option key={d.key} value={d.key}>
                                  {d.label}
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              className="w-16 px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-slate-500"
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
                            className="w-full px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-500"
                            placeholder={
                              impact.dimension === "time"
                                ? "Langsung jadi"
                                : impact.dimension === "money"
                                  ? "25 ribu per cangkir"
                                  : impact.dimension === "energy"
                                    ? "Tinggal pesan saja"
                                    : impact.dimension === "stress"
                                      ? "Tidak ribet pagi"
                                      : impact.dimension === "risk"
                                        ? "Kualitas selalu konsisten"
                                        : impact.dimension === "growth"
                                          ? "Tidak belajar skill"
                                          : impact.dimension === "peace"
                                            ? "Suasana cafe nyaman"
                                            : impact.dimension === "flexibility"
                                              ? "Tergantung jam buka"
                                              : "Ketemu teman barista"
                            }
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
            ) : (
              <div>
                {options.length > 2 && (
                  <div className="mb-3 px-3 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg text-xs font-medium text-amber-900">
                    Mode cepat maksimal 2 pilihan. Pilihan ke-3 dan seterusnya
                    disembunyikan.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {options.slice(0, 2).map((opt, idx) => (
                    <div
                      key={opt.id}
                      className="border-2 border-slate-300 rounded-xl p-3 bg-gradient-to-br from-white to-slate-50"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <input
                          className="flex-1 min-w-0 px-2 py-2 border-2 border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-500"
                          placeholder={
                            idx === 0 ? "Beli di Cafe" : "Bikin Sendiri"
                          }
                          value={opt.title}
                          onChange={(e) =>
                            updateOptionTitle(opt.id, e.target.value)
                          }
                        />
                      </div>

                      <button
                        onClick={() => addImpact(opt.id)}
                        className="w-full mb-2 px-2 py-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-semibold rounded-lg border-2 border-slate-200 active:scale-[0.98] transition-transform"
                      >
                        + Dampak
                      </button>

                      <div className="space-y-2">
                        {opt.impacts.map((impact) => (
                          <div
                            key={impact.id}
                            className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-2 border-2 border-slate-200"
                          >
                            <div className="flex items-center gap-2">
                              <select
                                value={impact.dimension}
                                onChange={(e) =>
                                  updateImpact(opt.id, impact.id, {
                                    dimension: e.target.value,
                                  })
                                }
                                className="flex-1 min-w-0 px-2 py-1.5 border-2 border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-500"
                              >
                                {DIMENSIONS.map((d) => (
                                  <option key={d.key} value={d.key}>
                                    {d.label}
                                  </option>
                                ))}
                              </select>

                              <input
                                type="number"
                                className="w-14 flex-shrink-0 px-1 py-1.5 border-2 border-slate-300 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-slate-500"
                                placeholder="0"
                                value={impact.value}
                                onChange={(e) =>
                                  updateImpact(opt.id, impact.id, {
                                    value: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {options.length >= 2 && (
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
                onClick={addConstraint}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                + Tambah Batasan
              </button>

              <div className="space-y-3">
                {constraints.map((constraint) => (
                  <div
                    key={constraint.id}
                    className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3"
                  >
                    <input
                      className="w-full px-3 py-2.5 border-2 border-amber-300 rounded-lg text-sm font-medium mb-3 focus:outline-none focus:border-amber-500"
                      placeholder="Budget kopi 300rb/bulan"
                      value={constraint.text}
                      onChange={(e) =>
                        updateConstraint(constraint.id, {
                          text: e.target.value,
                        })
                      }
                    />

                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-600 mb-2">
                        Pilihan yang memenuhi batasan ini?
                      </p>
                      <div className="space-y-2">
                        {options.map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={constraint.checks[opt.id] === true}
                              onChange={(e) =>
                                updateConstraintCheck(
                                  constraint.id,
                                  opt.id,
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 rounded border-2 border-slate-400 text-amber-600 focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-slate-700 font-medium">
                              {opt.title ||
                                `Pilihan ${options.indexOf(opt) + 1}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name={`type-${constraint.id}`}
                          checked={constraint.type === "soft"}
                          onChange={() =>
                            updateConstraint(constraint.id, { type: "soft" })
                          }
                          className="w-4 h-4 border-2 border-slate-400 text-amber-600 focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="text-slate-700 font-medium">
                          Lunak (kena penalti)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name={`type-${constraint.id}`}
                          checked={constraint.type === "hard"}
                          onChange={() =>
                            updateConstraint(constraint.id, { type: "hard" })
                          }
                          className="w-4 h-4 border-2 border-slate-400 text-red-600 focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="text-slate-700 font-medium">
                          Keras (gugur)
                        </span>
                      </label>
                    </div>

                    {constraint.type === "soft" && (
                      <div className="mb-3">
                        <label className="text-xs text-slate-600 font-bold block mb-1">
                          Penalti kalau dilanggar:
                        </label>
                        <input
                          type="number"
                          className="w-24 px-2.5 py-2 border-2 border-amber-300 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-amber-500"
                          value={constraint.penalty}
                          onChange={(e) =>
                            updateConstraint(constraint.id, {
                              penalty: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    <button
                      onClick={() => removeConstraint(constraint.id)}
                      className="text-xs text-red-600 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="px-4">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
              <h2 className="text-xs font-bold text-slate-600 mb-4 uppercase tracking-wider">
                Hasil
              </h2>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-700 w-20 text-right">
                    {result.a.title || "Pilihan A"}
                  </span>
                  <div className="flex-1 h-10 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg overflow-hidden flex border-2 border-slate-300">
                    {(() => {
                      const totalA = result.totals[0].total;
                      const totalB = result.totals[1].total;
                      const absTotal = Math.abs(totalA) + Math.abs(totalB);

                      if (absTotal === 0) {
                        return (
                          <>
                            <div className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                0
                              </span>
                            </div>
                            <div className="w-1/2 bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                0
                              </span>
                            </div>
                          </>
                        );
                      }

                      const aWidth = (Math.abs(totalA) / absTotal) * 100;
                      const bWidth = (Math.abs(totalB) / absTotal) * 100;

                      return (
                        <>
                          <div
                            className={`flex items-center justify-center transition-all duration-300 ${
                              result.totals[0].isDisqualified
                                ? "bg-gradient-to-r from-slate-400 to-slate-300"
                                : "bg-gradient-to-r from-blue-600 to-blue-500"
                            }`}
                            style={{ width: `${aWidth}%` }}
                          >
                            <span className="text-xs font-bold text-white">
                              {result.totals[0].isDisqualified ? "✗" : totalA}
                            </span>
                          </div>
                          <div
                            className={`flex items-center justify-center transition-all duration-300 ${
                              result.totals[1].isDisqualified
                                ? "bg-gradient-to-r from-slate-400 to-slate-300"
                                : "bg-gradient-to-r from-purple-600 to-purple-500"
                            }`}
                            style={{ width: `${bWidth}%` }}
                          >
                            <span className="text-xs font-bold text-white">
                              {result.totals[1].isDisqualified ? "✗" : totalB}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <span className="text-xs font-bold text-purple-700 w-20">
                    {result.b.title || "Pilihan B"}
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-xs text-slate-600 font-medium">
                    {result.totals[0].isDisqualified &&
                    result.totals[1].isDisqualified ? (
                      <>Kedua pilihan gugur</>
                    ) : result.totals[0].isDisqualified ? (
                      <>
                        <span className="font-bold text-blue-700">
                          {result.a.title || "Pilihan A"}
                        </span>{" "}
                        gugur
                      </>
                    ) : result.totals[1].isDisqualified ? (
                      <>
                        <span className="font-bold text-purple-700">
                          {result.b.title || "Pilihan B"}
                        </span>{" "}
                        gugur
                      </>
                    ) : result.totals[0].total > result.totals[1].total ? (
                      <>
                        <span className="font-bold text-blue-700">
                          {result.a.title || "Pilihan A"}
                        </span>{" "}
                        unggul{" "}
                        {Math.abs(
                          result.totals[0].total - result.totals[1].total,
                        )}{" "}
                        poin
                      </>
                    ) : result.totals[0].total < result.totals[1].total ? (
                      <>
                        <span className="font-bold text-purple-700">
                          {result.b.title || "Pilihan B"}
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

                {(result.totals[0].violations.length > 0 ||
                  result.totals[1].violations.length > 0) && (
                  <div className="mt-3 space-y-2">
                    {result.totals.map((total, idx) => {
                      if (total.violations.length === 0) return null;
                      return (
                        <div
                          key={total.optionId}
                          className={`text-xs px-3 py-2.5 rounded-lg border-2 ${
                            total.isDisqualified
                              ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                              : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300"
                          }`}
                        >
                          <div className="font-bold text-slate-700 mb-1">
                            {total.title || `Pilihan ${idx === 0 ? "A" : "B"}`}:
                          </div>
                          {total.violations.map((v, vIdx) => (
                            <div
                              key={vIdx}
                              className="text-slate-600 ml-2 font-medium"
                            >
                              • {v.text}
                              {v.type === "soft" && (
                                <span className="text-amber-700 font-bold ml-1">
                                  ({v.penalty} poin)
                                </span>
                              )}
                              {v.type === "hard" && (
                                <span className="text-red-700 font-bold ml-1">
                                  (gugur)
                                </span>
                              )}
                            </div>
                          ))}
                          {!total.isDisqualified &&
                            total.constraintPenalty !== 0 && (
                              <div className="mt-1 text-slate-500 text-xs font-medium">
                                Skor dampak: {total.impactTotal} → Skor akhir:{" "}
                                {total.total}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {result.deltas.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Beda Utama
                    </h3>
                    <div className="flex-1"></div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setFilterMode("all")}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
                          filterMode === "all"
                            ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-700"
                            : "bg-white text-slate-600 border-slate-300"
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => setFilterMode("positive")}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
                          filterMode === "positive"
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700"
                            : "bg-white text-slate-600 border-slate-300"
                        }`}
                      >
                        Untung
                      </button>
                      <button
                        onClick={() => setFilterMode("negative")}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
                          filterMode === "negative"
                            ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-700"
                            : "bg-white text-slate-600 border-slate-300"
                        }`}
                      >
                        Rugi
                      </button>
                      <button
                        onClick={() => setFilterMode("significant")}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
                          filterMode === "significant"
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-700"
                            : "bg-white text-slate-600 border-slate-300"
                        }`}
                      >
                        &gt;3
                      </button>
                    </div>
                  </div>

                  {filteredDeltas.length > 0 ? (
                    <div className="space-y-2">
                      {filteredDeltas.map((d) => {
                        const dimLabel =
                          DIMENSIONS.find((dim) => dim.key === d.dimension)
                            ?.label || d.dimension;

                        const winner = d.delta > 0 ? result.b : result.a;
                        const loser = d.delta > 0 ? result.a : result.b;
                        const winnerName =
                          winner.title ||
                          (d.delta > 0 ? "Pilihan B" : "Pilihan A");
                        const loserName =
                          loser.title ||
                          (d.delta > 0 ? "Pilihan A" : "Pilihan B");

                        return (
                          <div
                            key={d.dimension}
                            className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border-2 border-slate-300"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-700">
                                {dimLabel}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  d.delta > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                Δ {d.delta > 0 ? "+" : ""}
                                {d.delta}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              Pilih{" "}
                              <span
                                className={`font-bold ${
                                  d.delta > 0
                                    ? "text-purple-700"
                                    : "text-blue-700"
                                }`}
                              >
                                {winnerName}
                              </span>{" "}
                              dapat +{Math.abs(d.delta)}{" "}
                              {dimLabel.toLowerCase()} dibanding{" "}
                              <span className="font-bold text-slate-700">
                                {loserName}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-300">
                      <p className="text-xs text-slate-400 font-medium">
                        Tidak ada yang cocok dengan filter
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(result.isCloseCall || result.hasExtremeSacrifice) && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Perlu Diperhatikan
                  </h3>

                  {result.isCloseCall && (
                    <div className="px-3 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg text-xs text-amber-900 leading-relaxed font-medium">
                      <span className="font-bold">Hampir Sama:</span> Selisih
                      skor sangat tipis. Kembali pada prioritas Anda saat ini.
                    </div>
                  )}

                  {result.hasExtremeSacrifice && (
                    <div className="px-3 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-lg text-xs text-red-900 leading-relaxed font-medium">
                      <span className="font-bold">Ada Dampak Berat:</span> Ada
                      pengorbanan yang cukup signifikan di salah satu pilihan.
                      {result.sacrifices.a &&
                        result.sacrifices.a.value <= -5 && (
                          <div className="mt-1">
                            • {result.a.title || "Pilihan A"}:{" "}
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
                            • {result.b.title || "Pilihan B"}:{" "}
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
