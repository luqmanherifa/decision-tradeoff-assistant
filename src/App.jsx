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
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-700 text-white p-4 mb-4">
          <h1 className="text-xl font-bold">Decision Trade-off</h1>
          <p className="text-xs text-slate-300 mt-1">
            Lihat jelas apa yang kamu dapat dan korbankan
          </p>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Keputusan Apa?
            </h2>
            <input
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              placeholder="Beli kopi di cafe atau bikin sendiri?"
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
              + Tambah Pilihan
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
                      placeholder={idx === 0 ? "Beli di Cafe" : "Bikin Sendiri"}
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
          </div>
        </div>

        {options.length >= 2 && (
          <div className="px-4 mb-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Batasan Penting
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ada yang tidak bisa dikompromikan? Tulis di sini
                </p>
              </div>

              <button
                onClick={addConstraint}
                className="w-full mb-4 px-4 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium active:bg-amber-700"
              >
                + Tambah Batasan
              </button>

              <div className="space-y-3">
                {constraints.map((constraint) => (
                  <div
                    key={constraint.id}
                    className="border border-amber-200 bg-amber-50 rounded-lg p-3"
                  >
                    <input
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Budget kopi 300rb/bulan"
                      value={constraint.text}
                      onChange={(e) =>
                        updateConstraint(constraint.id, {
                          text: e.target.value,
                        })
                      }
                    />

                    <div className="mb-3">
                      <p className="text-xs font-medium text-slate-600 mb-2">
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
                              className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-slate-700">
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
                          className="w-3.5 h-3.5 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-slate-700">
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
                          className="w-3.5 h-3.5 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-slate-700">Keras (gugur)</span>
                      </label>
                    </div>

                    {constraint.type === "soft" && (
                      <div className="mb-3">
                        <label className="text-xs text-slate-600 block mb-1">
                          Penalti kalau dilanggar:
                        </label>
                        <input
                          type="number"
                          className="w-24 px-2 py-1.5 border border-slate-300 rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
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
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                Hasil
              </h2>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-700 w-20 text-right">
                    {result.a.title || "Pilihan A"}
                  </span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden flex">
                    {(() => {
                      const totalA = result.totals[0].total;
                      const totalB = result.totals[1].total;
                      const absTotal = Math.abs(totalA) + Math.abs(totalB);

                      if (absTotal === 0) {
                        return (
                          <>
                            <div className="w-1/2 bg-blue-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                0
                              </span>
                            </div>
                            <div className="w-1/2 bg-purple-400 flex items-center justify-center">
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
                                ? "bg-slate-400"
                                : "bg-blue-500"
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
                                ? "bg-slate-400"
                                : "bg-purple-500"
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
                  <span className="text-xs font-medium text-purple-700 w-20">
                    {result.b.title || "Pilihan B"}
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-xs text-slate-600">
                    {result.totals[0].isDisqualified &&
                    result.totals[1].isDisqualified ? (
                      <>Kedua pilihan gugur</>
                    ) : result.totals[0].isDisqualified ? (
                      <>
                        <span className="font-semibold text-blue-700">
                          {result.a.title || "Pilihan A"}
                        </span>{" "}
                        gugur
                      </>
                    ) : result.totals[1].isDisqualified ? (
                      <>
                        <span className="font-semibold text-purple-700">
                          {result.b.title || "Pilihan B"}
                        </span>{" "}
                        gugur
                      </>
                    ) : result.totals[0].total > result.totals[1].total ? (
                      <>
                        <span className="font-semibold text-blue-700">
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
                        <span className="font-semibold text-purple-700">
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
                          className={`text-xs px-3 py-2 rounded ${
                            total.isDisqualified
                              ? "bg-red-50 border border-red-200"
                              : "bg-amber-50 border border-amber-200"
                          }`}
                        >
                          <div className="font-semibold text-slate-700 mb-1">
                            {total.title || `Pilihan ${idx === 0 ? "A" : "B"}`}:
                          </div>
                          {total.violations.map((v, vIdx) => (
                            <div key={vIdx} className="text-slate-600 ml-2">
                              • {v.text}
                              {v.type === "soft" && (
                                <span className="text-amber-700 font-medium ml-1">
                                  ({v.penalty} poin)
                                </span>
                              )}
                              {v.type === "hard" && (
                                <span className="text-red-700 font-medium ml-1">
                                  (gugur)
                                </span>
                              )}
                            </div>
                          ))}
                          {!total.isDisqualified &&
                            total.constraintPenalty !== 0 && (
                              <div className="mt-1 text-slate-500 text-[11px]">
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
                    <h3 className="text-xs font-semibold text-slate-500 uppercase">
                      Beda Utama
                    </h3>
                    <div className="flex-1"></div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setFilterMode("all")}
                        className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                          filterMode === "all"
                            ? "bg-slate-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => setFilterMode("positive")}
                        className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                          filterMode === "positive"
                            ? "bg-green-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Untung
                      </button>
                      <button
                        onClick={() => setFilterMode("negative")}
                        className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                          filterMode === "negative"
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Rugi
                      </button>
                      <button
                        onClick={() => setFilterMode("significant")}
                        className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                          filterMode === "significant"
                            ? "bg-amber-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                            className="bg-slate-50 rounded-lg p-3 border border-slate-200"
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
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Pilih{" "}
                              <span
                                className={`font-semibold ${
                                  d.delta > 0
                                    ? "text-purple-700"
                                    : "text-blue-700"
                                }`}
                              >
                                {winnerName}
                              </span>{" "}
                              dapat +{Math.abs(d.delta)}{" "}
                              {dimLabel.toLowerCase()} dibanding{" "}
                              <span className="font-semibold text-slate-700">
                                {loserName}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-400">
                        Tidak ada yang cocok dengan filter
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(result.isCloseCall || result.hasExtremeSacrifice) && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase">
                    Perlu Diperhatikan
                  </h3>

                  {result.isCloseCall && (
                    <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 leading-relaxed">
                      <span className="font-semibold">⚖️ Hampir Sama:</span>{" "}
                      Selisih skor sangat tipis. Kembali pada prioritas Anda
                      saat ini.
                    </div>
                  )}

                  {result.hasExtremeSacrifice && (
                    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-900 leading-relaxed">
                      <span className="font-semibold">
                        ⚠️ Ada Dampak Berat:
                      </span>{" "}
                      Ada pengorbanan yang cukup signifikan di salah satu
                      pilihan.
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
