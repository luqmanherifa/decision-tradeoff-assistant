import { useState } from "react";
import { InfoIcon, CloseIcon, AntraIcon } from "./icons";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AntraIcon className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-base font-bold text-stone-900 tracking-wide">
                ANTRA
              </h1>
              <p className="text-xs text-stone-500 tracking-normal">
                Keputusan jadi lebih jelas
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-400 transition-colors"
            aria-label="Info"
          >
            <InfoIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showInfo && (
        <div
          className="fixed inset-0 bg-stone-900/40 z-40 px-4 flex items-center justify-center"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-stone-50 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-stone-200 px-5 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AntraIcon className="w-6 h-6 text-amber-600" />
                  <h2 className="text-base font-bold text-stone-900 tracking-wide">
                    Tentang ANTRA
                  </h2>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-8 h-8 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors flex-shrink-0"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-3">
              <div className="bg-white rounded-xl p-4 border border-stone-200">
                <p className="text-sm text-stone-700 leading-relaxed">
                  <span className="font-bold text-amber-600">ANTRA</span> adalah
                  alat bantu untuk membandingkan pilihan-pilihan dalam hidup
                  dengan lebih terstruktur dan objektif.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-stone-200">
                <p className="text-sm text-stone-700 leading-relaxed">
                  Setiap keputusan memiliki dampak di berbagai dimensi seperti
                  waktu, uang, energi, dan stres. ANTRA membantu melihat
                  pengorbanan yang sebenarnya terjadi.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-stone-200">
                <p className="text-xs font-bold text-amber-700 mb-3 uppercase tracking-wide">
                  Cara Menggunakan:
                </p>
                <ol className="space-y-2">
                  <li className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Tulis keputusan yang sedang dihadapi
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Tambahkan minimal 2 pilihan yang tersedia
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Untuk setiap pilihan, tambahkan dampaknya (positif atau
                      negatif)
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Opsional: Tambahkan batasan penting yang tidak dapat
                      dikompromikan
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      5
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Lihat hasil perbandingan dan analisis yang muncul
                    </p>
                  </li>
                </ol>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm text-stone-900 leading-relaxed font-semibold">
                  ANTRA tidak membuat keputusan - tetapi memberikan kejelasan
                  yang dibutuhkan untuk memutuskan dengan lebih percaya diri.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
