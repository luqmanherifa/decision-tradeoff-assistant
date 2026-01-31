export default function DecisionContext({ value, onChange }) {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
        <h2 className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
          Keputusan Apa?
        </h2>
        <input
          className="w-full px-3 py-2.5 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-500"
          placeholder="Beli kopi di kafe atau bikin sendiri?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
