import { QuestionCircleIcon } from "./icons";

export default function DecisionContext({ value, onChange }) {
  return (
    <div className="px-5 mb-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <QuestionCircleIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Keputusan Apa?
          </h2>
        </div>

        <input
          className="w-full px-4 py-3 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors bg-stone-50"
          placeholder="Beli kopi di kafe atau bikin sendiri?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
