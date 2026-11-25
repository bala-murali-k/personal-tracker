// The counter unit model. It knows nothing about trackers or entries,
// it only owns the fields and rules that belong to counting.

export type CounterUnit = {
  kind: "count"; // discriminator: lets TypeScript tell this apart from other unit models
  label: string; // "applications", "glasses", ...
  step: number; // amount per tap, always a number (default 1)
  features: {
    decrement: { enabled: boolean }; // shows the "-" button
  };
};

export function createCounterUnit(label: string, step: number = 1): CounterUnit {
  return {
    kind: "count",
    label: label.trim(),
    step,
    features: { decrement: { enabled: true } },
  };
}

// "+" always adds one step.
export function incrementAmount(unit: CounterUnit): number {
  return unit.step;
}

// "-" removes up to one step, but never takes today's total below zero.
// Returns a negative number, or 0 when nothing can be removed.
export function decrementAmount(unit: CounterUnit, currentTotal: number): number {
  if (!unit.features.decrement.enabled) return 0;
  return -Math.min(unit.step, currentTotal);
}

export function canDecrement(unit: CounterUnit, currentTotal: number): boolean {
  return decrementAmount(unit, currentTotal) !== 0;
}