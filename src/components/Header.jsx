import { useState } from "react";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white px-4 py-4 mb-4">
        <div className="text-center">
          <h1 className="text-base font-semibold tracking-wider">ANTRA</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-xs text-slate-200 font-medium">
              Keputusan jadi lebih jelas
            </p>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-slate-200 hover:text-white transition-colors"
              aria-label="Info"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-4 h-4 fill-current"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-sm font-bold text-blue-900">Tentang ANTRA</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="w-4 h-4 fill-current"
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-blue-900 leading-relaxed space-y-2">
              <p>
                <span className="font-bold">ANTRA</span> adalah alat bantu untuk
                membandingkan pilihan-pilihan dalam hidup dengan lebih
                terstruktur dan objektif.
              </p>
              <p>
                Setiap keputusan memiliki dampak di berbagai dimensi seperti
                waktu, uang, energi, dan stres. ANTRA membantu melihat
                pengorbanan yang sebenarnya terjadi.
              </p>
              <p className="font-semibold pt-2 border-t border-blue-200">
                Cara Menggunakan:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Tulis keputusan yang sedang dihadapi</li>
                <li>Tambahkan minimal 2 pilihan yang tersedia</li>
                <li>
                  Untuk setiap pilihan, tambahkan dampaknya (positif atau
                  negatif)
                </li>
                <li>
                  Opsional: Tambahkan batasan penting yang tidak dapat
                  dikompromikan
                </li>
                <li>Lihat hasil perbandingan dan analisis yang muncul</li>
              </ol>
              <p className="pt-2 border-t border-blue-200">
                ANTRA tidak membuat keputusan - tetapi memberikan kejelasan yang
                dibutuhkan untuk memutuskan dengan lebih percaya diri.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
