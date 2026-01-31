import { DIMENSIONS } from "../constants/dimensions";
import { ChartBarIcon, CloseIcon } from "./icons";

export default function ResultsSection({
  result,
  filterMode,
  filteredDeltas,
  onFilterModeChange,
}) {
  if (!result) return null;

  return (
    <div className="px-5">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <ChartBarIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Hasil
          </h2>
        </div>

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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
            {result.a.title || "Pilihan A"}
          </div>
          <div className="text-3xl font-black text-blue-600">
            {result.totals[0].isDisqualified ? "✗" : result.totals[0].total}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
            <span className="text-xs font-black text-stone-600 tracking-wide">
              VS
            </span>
          </div>
        </div>

        <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">
            {result.b.title || "Pilihan B"}
          </div>
          <div className="text-3xl font-black text-purple-600">
            {result.totals[1].isDisqualified ? "✗" : result.totals[1].total}
          </div>
        </div>
      </div>

      <div className="h-3 bg-stone-100 rounded-full overflow-hidden flex border border-stone-200 mb-4">
        {(() => {
          const totalA = result.totals[0].total;
          const totalB = result.totals[1].total;
          const absTotal = Math.abs(totalA) + Math.abs(totalB);

          if (absTotal === 0) {
            return (
              <>
                <div className="w-1/2 bg-blue-500"></div>
                <div className="w-1/2 bg-purple-500"></div>
              </>
            );
          }

          const aWidth = (Math.abs(totalA) / absTotal) * 100;
          const bWidth = (Math.abs(totalB) / absTotal) * 100;

          return (
            <>
              <div
                className={`${
                  result.totals[0].isDisqualified
                    ? "bg-stone-400"
                    : "bg-blue-500"
                }`}
                style={{ width: `${aWidth}%` }}
              ></div>
              <div
                className={`${
                  result.totals[1].isDisqualified
                    ? "bg-stone-400"
                    : "bg-purple-500"
                }`}
                style={{ width: `${bWidth}%` }}
              ></div>
            </>
          );
        })()}
      </div>

      <div className="text-center">
        <div className="inline-block bg-stone-50 border border-stone-200 rounded-lg px-5 py-3">
          <p className="text-sm text-stone-700 font-semibold leading-relaxed tracking-normal">
            {result.totals[0].isDisqualified &&
            result.totals[1].isDisqualified ? (
              <>Kedua pilihan gugur</>
            ) : result.totals[0].isDisqualified ? (
              <>
                <span className="font-bold text-blue-600">
                  {result.a.title || "Pilihan A"}
                </span>{" "}
                gugur
              </>
            ) : result.totals[1].isDisqualified ? (
              <>
                <span className="font-bold text-purple-600">
                  {result.b.title || "Pilihan B"}
                </span>{" "}
                gugur
              </>
            ) : result.totals[0].total > result.totals[1].total ? (
              <>
                <span className="font-bold text-blue-600">
                  {result.a.title || "Pilihan A"}
                </span>{" "}
                unggul{" "}
                <span className="font-bold text-amber-600">
                  {Math.abs(result.totals[0].total - result.totals[1].total)}
                </span>{" "}
                poin
              </>
            ) : result.totals[0].total < result.totals[1].total ? (
              <>
                <span className="font-bold text-purple-600">
                  {result.b.title || "Pilihan B"}
                </span>{" "}
                unggul{" "}
                <span className="font-bold text-amber-600">
                  {Math.abs(result.totals[0].total - result.totals[1].total)}
                </span>{" "}
                poin
              </>
            ) : (
              <>Skor seimbang</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function ViolationsSection({ result }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
        Pelanggaran Batasan
      </h3>

      <div className="space-y-3">
        {result.totals.map((total, idx) => {
          if (total.violations.length === 0) return null;
          return (
            <div
              key={total.optionId}
              className={`rounded-xl p-4 border ${
                total.isDisqualified
                  ? "bg-rose-50 border-rose-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-stone-800 tracking-normal">
                  {total.title || `Pilihan ${idx === 0 ? "A" : "B"}`}
                </span>
                {total.isDisqualified && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                    GUGUR
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {total.violations.map((v, vIdx) => (
                  <div key={vIdx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-stone-700 font-medium flex-1 leading-relaxed tracking-normal">
                      {v.text}
                      {v.type === "soft" && (
                        <span className="text-amber-700 font-bold ml-1">
                          ({v.penalty} poin)
                        </span>
                      )}
                      {v.type === "hard" && (
                        <span className="text-rose-700 font-bold ml-1">
                          (gugur)
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {!total.isDisqualified && total.constraintPenalty !== 0 && (
                <div className="mt-3 pt-3 border-t border-stone-200">
                  <p className="text-xs text-stone-600 font-medium tracking-normal">
                    Skor dampak:{" "}
                    <span className="font-bold text-stone-800">
                      {total.impactTotal}
                    </span>{" "}
                    → Skor akhir:{" "}
                    <span className="font-bold text-stone-800">
                      {total.total}
                    </span>
                  </p>
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
          Beda Utama
        </h3>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onFilterModeChange("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "all"
                ? "bg-stone-600 text-white border-stone-600"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => onFilterModeChange("positive")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "positive"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            Untung
          </button>
          <button
            onClick={() => onFilterModeChange("negative")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "negative"
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            Rugi
          </button>
          <button
            onClick={() => onFilterModeChange("significant")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "significant"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            &gt;3
          </button>
        </div>
      </div>

      {filteredDeltas.length > 0 ? (
        <div className="space-y-3">
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
                className={`rounded-xl p-4 border ${
                  d.delta > 0
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-bold text-stone-800 tracking-normal">
                    {dimLabel}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-lg border ${
                      d.delta > 0
                        ? "bg-emerald-100 border-emerald-300"
                        : "bg-rose-100 border-rose-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        d.delta > 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      Δ {d.delta > 0 ? "+" : ""}
                      {d.delta}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium tracking-normal">
                  Pilih{" "}
                  <span
                    className={`font-bold ${
                      d.delta > 0 ? "text-purple-600" : "text-blue-600"
                    }`}
                  >
                    {winnerName}
                  </span>{" "}
                  dapat{" "}
                  <span className="font-bold text-amber-600">
                    +{Math.abs(d.delta)}
                  </span>{" "}
                  {dimLabel.toLowerCase()} dibanding{" "}
                  <span className="font-bold text-stone-800">{loserName}</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-stone-200 mx-auto mb-3 flex items-center justify-center">
            <CloseIcon className="w-5 h-5 text-stone-400" />
          </div>
          <p className="text-sm text-stone-500 font-medium tracking-normal">
            Tidak ada yang cocok dengan filter
          </p>
        </div>
      )}
    </div>
  );
}

function NoticesSection({ result }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
        Perlu Diperhatikan
      </h3>

      {result.isCloseCall && (
        <div className="px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-900 leading-relaxed font-medium tracking-normal">
            <span className="font-bold">Hampir Sama:</span> Selisih skor sangat
            tipis. Kembali pada prioritas Anda saat ini.
          </p>
        </div>
      )}

      {result.hasExtremeSacrifice && (
        <div className="px-4 py-3.5 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-sm text-rose-900 leading-relaxed font-medium mb-2.5 tracking-normal">
            <span className="font-bold">Ada Dampak Berat:</span> Ada pengorbanan
            yang cukup signifikan di salah satu pilihan.
          </p>
          <div className="space-y-2 pl-2">
            {result.sacrifices.a && result.sacrifices.a.value <= -5 && (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-rose-800 font-medium tracking-normal">
                  {result.a.title || "Pilihan A"}:{" "}
                  {
                    DIMENSIONS.find(
                      (d) => d.key === result.sacrifices.a.dimension,
                    )?.label
                  }{" "}
                  <span className="font-bold">
                    ({result.sacrifices.a.value})
                  </span>
                </p>
              </div>
            )}
            {result.sacrifices.b && result.sacrifices.b.value <= -5 && (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-rose-800 font-medium tracking-normal">
                  {result.b.title || "Pilihan B"}:{" "}
                  {
                    DIMENSIONS.find(
                      (d) => d.key === result.sacrifices.b.dimension,
                    )?.label
                  }{" "}
                  <span className="font-bold">
                    ({result.sacrifices.b.value})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
