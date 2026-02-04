import { useDecisionComparison } from "./hooks/useDecisionComparison";
import Header from "./components/Header";
import DecisionContext from "./components/DecisionContext";
import OptionsSection from "./components/OptionsSection";
import ConstraintsSection from "./components/ConstraintsSection";
import ResultsSection from "./components/ResultsSection";

export default function App() {
  const {
    decisionContext,
    options,
    filterMode,
    constraints,
    viewMode,
    isDecisionConfirmed,
    setDecisionContext,
    setFilterMode,
    setViewMode,
    setIsDecisionConfirmed,
    addConstraint,
    updateConstraint,
    updateConstraintCheck,
    removeConstraint,
    addOption,
    updateOptionTitle,
    addImpact,
    updateImpact,
    result,
    filteredDeltas,
    removeOption,
  } = useDecisionComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-8 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <Header />
        <DecisionContext
          value={decisionContext}
          onChange={setDecisionContext}
          onConfirm={() => setIsDecisionConfirmed(true)}
          isConfirmed={isDecisionConfirmed}
        />
        {isDecisionConfirmed ? (
          <>
            <OptionsSection
              options={options}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddOption={addOption}
              onUpdateTitle={updateOptionTitle}
              onAddImpact={addImpact}
              onUpdateImpact={updateImpact}
              onRemoveOption={removeOption}
            />
            <ConstraintsSection
              constraints={constraints}
              options={options}
              onAddConstraint={addConstraint}
              onUpdateConstraint={updateConstraint}
              onUpdateCheck={updateConstraintCheck}
              onRemoveConstraint={removeConstraint}
            />
            <ResultsSection
              result={result}
              filterMode={filterMode}
              filteredDeltas={filteredDeltas}
              onFilterModeChange={setFilterMode}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-5 py-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-5 bg-stone-400 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="w-6 h-6 text-white fill-current"
                >
                  <path d="M416 64C457 64 496.3 80.3 525.2 109.2L530.7 114.7C559.7 143.7 576 183 576 223.9C576 248 570.3 271.5 559.8 292.7C557.9 296.4 554.5 299.2 550.5 300.4L438.5 334C434.6 335.2 432 338.7 432 342.8C432 347.9 436.1 352 441.2 352L473.4 352C487.7 352 494.8 369.2 484.7 379.3L462.3 401.7C460.4 403.6 458.1 404.9 455.6 405.7L374.6 430C370.7 431.2 368.1 434.7 368.1 438.8C368.1 443.9 372.2 448 377.3 448C390.5 448 396.2 463.7 385.1 470.9C344 497.5 295.8 512 246.1 512L160.1 512L112.1 560C103.3 568.8 88.9 568.8 80.1 560C71.3 551.2 71.3 536.8 80.1 528L320 288C328.8 279.2 328.8 264.8 320 256C311.2 247.2 296.8 247.2 288 256L143.5 400.5C137.8 406.2 128 402.2 128 394.1C128 326.2 155 261.1 203 213.1L306.8 109.2C335.7 80.3 375 64 416 64z" />
                </svg>
              </div>
              <p className="text-xs text-stone-500 mb-2">
                Isi keputusan yang ingin dibandingkan,
              </p>
              <p className="text-xs text-stone-500">
                lalu klik tombol centang untuk lanjut.
              </p>
            </div>
          </div>
        )}
        <div className="w-full pt-6 text-center mt-auto">
          <p className="text-xs text-stone-500 font-normal">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/luqmanherifa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-600 hover:underline transition-colors"
            >
              Luqman Herifa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
