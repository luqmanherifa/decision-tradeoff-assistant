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
  } = useDecisionComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-8">
      <div className="max-w-md mx-auto">
        <Header />

        <DecisionContext
          value={decisionContext}
          onChange={setDecisionContext}
          onConfirm={() => setIsDecisionConfirmed(true)}
          isConfirmed={isDecisionConfirmed}
        />

        {isDecisionConfirmed && (
          <>
            <OptionsSection
              options={options}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddOption={addOption}
              onUpdateTitle={updateOptionTitle}
              onAddImpact={addImpact}
              onUpdateImpact={updateImpact}
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
        )}
      </div>
    </div>
  );
}
