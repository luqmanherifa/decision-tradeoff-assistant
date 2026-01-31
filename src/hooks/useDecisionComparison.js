import { useState } from "react";
import { DIMENSIONS } from "../constants/dimensions";

export function useDecisionComparison() {
  const [decisionContext, setDecisionContext] = useState("");
  const [options, setOptions] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [constraints, setConstraints] = useState([]);
  const [viewMode, setViewMode] = useState("detail");
  const [isDecisionConfirmed, setIsDecisionConfirmed] = useState(false);

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

  const getFilteredDeltas = () => {
    const result = compare();
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

  return {
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

    result: compare(),
    filteredDeltas: getFilteredDeltas(),
  };
}
