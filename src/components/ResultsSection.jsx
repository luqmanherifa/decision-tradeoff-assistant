import { DIMENSIONS } from "../constants/dimensions";

export default function ResultsSection({
  result,
  filterMode,
  filteredDeltas,
  onFilterModeChange,
}) {
  if (!result) return null;

  return (
    <div className="px-4">
      <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
        <h2 className="text-xs font-bold text-slate-600 mb-4 uppercase tracking-wider">
          Hasil
        </h2>

        <ScoreComparison result={result} />

        {(result.totals[0].violations.length > 0 ||
          result.totals[1].violations.length > 0) && (
          <ViolationsSection result={result} />
        )}

        {result.deltas.length > 0 && (
          <DeltasSection
            result={result}
            filterMode={filterMode}
            filteredDeltas={filteredDeltas}
            onFilterModeChange={onFilterModeChange}
          />
        )}

        {(result.isCloseCall || result.hasExtremeSacrifice) && (
          <NoticesSection result={result} />
        )}
      </div>
    </div>
  );
}

function ScoreComparison({ result }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 text-right">
          <div className="text-xs font-bold text-blue-700 mb-1">
            {result.a.title || "Pilihan A"}
          </div>
          <div className="text-lg font-bold text-blue-600">
            {result.totals[0].isDisqualified ? "✗" : result.totals[0].total}
          </div>
        </div>

        <div className="w-1 h-12 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 rounded-full"></div>

        <div className="flex-1">
          <div className="text-xs font-bold text-purple-700 mb-1">
            {result.b.title || "Pilihan B"}
          </div>
          <div className="text-lg font-bold text-purple-600">
            {result.totals[1].isDisqualified ? "✗" : result.totals[1].total}
          </div>
        </div>
      </div>

      <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden flex border-2 border-slate-300">
        {(() => {
          const totalA = result.totals[0].total;
          const totalB = result.totals[1].total;
          const absTotal = Math.abs(totalA) + Math.abs(totalB);

          if (absTotal === 0) {
            return (
              <>
                <div className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-400"></div>
                <div className="w-1/2 bg-gradient-to-r from-purple-500 to-purple-400"></div>
              </>
            );
          }

          const aWidth = (Math.abs(totalA) / absTotal) * 100;
          const bWidth = (Math.abs(totalB) / absTotal) * 100;

          return (
            <>
              <div
                className={`transition-all duration-300 ${
                  result.totals[0].isDisqualified
                    ? "bg-gradient-to-r from-slate-400 to-slate-300"
                    : "bg-gradient-to-r from-blue-600 to-blue-500"
                }`}
                style={{ width: `${aWidth}%` }}
              ></div>
              <div
                className={`transition-all duration-300 ${
                  result.totals[1].isDisqualified
                    ? "bg-gradient-to-r from-slate-400 to-slate-300"
                    : "bg-gradient-to-r from-purple-600 to-purple-500"
                }`}
                style={{ width: `${bWidth}%` }}
              ></div>
            </>
          );
        })()}
      </div>

      <div className="text-center mt-3 px-4">
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
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
              unggul {Math.abs(result.totals[0].total - result.totals[1].total)}{" "}
              poin
            </>
          ) : result.totals[0].total < result.totals[1].total ? (
            <>
              <span className="font-bold text-purple-700">
                {result.b.title || "Pilihan B"}
              </span>{" "}
              unggul {Math.abs(result.totals[0].total - result.totals[1].total)}{" "}
              poin
            </>
          ) : (
            <>Skor seimbang</>
          )}
        </p>
      </div>
    </div>
  );
}

function ViolationsSection({ result }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        Pelanggaran Batasan
      </h3>
      <div className="space-y-2">
        {result.totals.map((total, idx) => {
          if (total.violations.length === 0) return null;
          return (
            <div
              key={total.optionId}
              className={`rounded-xl p-3 border-2 ${
                total.isDisqualified
                  ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                  : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  {total.title || `Pilihan ${idx === 0 ? "A" : "B"}`}
                </span>
                {total.isDisqualified && (
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                    GUGUR
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {total.violations.map((v, vIdx) => (
                  <div
                    key={vIdx}
                    className="text-xs text-slate-600 font-medium flex items-start gap-1.5"
                  >
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span className="flex-1">
                      {v.text}
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
                    </span>
                  </div>
                ))}
              </div>
              {!total.isDisqualified && total.constraintPenalty !== 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">
                    Skor dampak:{" "}
                    <span className="font-bold">{total.impactTotal}</span> →
                    Skor akhir: <span className="font-bold">{total.total}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeltasSection({
  result,
  filterMode,
  filteredDeltas,
  onFilterModeChange,
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Beda Utama
        </h3>
        <div className="flex-1"></div>
        <div className="flex gap-1">
          <button
            onClick={() => onFilterModeChange("all")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
              filterMode === "all"
                ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-700"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => onFilterModeChange("positive")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
              filterMode === "positive"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Untung
          </button>
          <button
            onClick={() => onFilterModeChange("negative")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all border-2 ${
              filterMode === "negative"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-700"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Rugi
          </button>
          <button
            onClick={() => onFilterModeChange("significant")}
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
              DIMENSIONS.find((dim) => dim.key === d.dimension)?.label ||
              d.dimension;

            const winner = d.delta > 0 ? result.b : result.a;
            const loser = d.delta > 0 ? result.a : result.b;
            const winnerName =
              winner.title || (d.delta > 0 ? "Pilihan B" : "Pilihan A");
            const loserName =
              loser.title || (d.delta > 0 ? "Pilihan A" : "Pilihan B");

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
                      d.delta > 0 ? "text-green-600" : "text-red-600"
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
                      d.delta > 0 ? "text-purple-700" : "text-blue-700"
                    }`}
                  >
                    {winnerName}
                  </span>{" "}
                  dapat +{Math.abs(d.delta)} {dimLabel.toLowerCase()} dibanding{" "}
                  <span className="font-bold text-slate-700">{loserName}</span>
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
  );
}

function NoticesSection({ result }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        Perlu Diperhatikan
      </h3>

      {result.isCloseCall && (
        <div className="px-3 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
          <span className="font-bold">Hampir Sama:</span> Selisih skor sangat
          tipis. Kembali pada prioritas Anda saat ini.
        </div>
      )}

      {result.hasExtremeSacrifice && (
        <div className="px-3 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl text-xs text-red-900 leading-relaxed font-medium">
          <span className="font-bold">Ada Dampak Berat:</span> Ada pengorbanan
          yang cukup signifikan di salah satu pilihan.
          {result.sacrifices.a && result.sacrifices.a.value <= -5 && (
            <div className="mt-1">
              • {result.a.title || "Pilihan A"}:{" "}
              {
                DIMENSIONS.find((d) => d.key === result.sacrifices.a.dimension)
                  ?.label
              }{" "}
              ({result.sacrifices.a.value})
            </div>
          )}
          {result.sacrifices.b && result.sacrifices.b.value <= -5 && (
            <div className="mt-1">
              • {result.b.title || "Pilihan B"}:{" "}
              {
                DIMENSIONS.find((d) => d.key === result.sacrifices.b.dimension)
                  ?.label
              }{" "}
              ({result.sacrifices.b.value})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
