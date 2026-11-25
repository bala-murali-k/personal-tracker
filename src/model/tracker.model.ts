import { CounterUnit, createCounterUnit } from "@/model/counter.model";

// Add DurationUnit etc. here later: type Unit = CounterUnit | DurationUnit;
export type Unit = CounterUnit;

export type WeekDays = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// Only what the user chose is stored. Anything derivable is computed, not saved.
export type Goals = {
  enabled: boolean;
  daily?: number; // not used for now
  weeklyActiveDays: WeekDays[]; // which weekdays the goal applies to
  weekly?: number; // not used for now
};

// Features every tracker has. Config is kept even when disabled.
export type CommonFeatures = {
  calendar: { enabled: boolean };
  insights: { enabled: boolean };
  goals: Goals;
  reminder: { enabled: boolean; time: string; sound: string };
};

export type Tracker = {
  id: string;
  name: string;
  icon: string; // preset icon name, e.g. "Target". Look up the component at render time
  color: string; // hex color
  unit: Unit; // unit-specific fields and features live inside the unit model
  features: CommonFeatures;
  createdAt: number;
  schemaVersion: number; // bump when the shape changes, so old saved data can be upgraded
};

// Entries are stored separately. amount is signed: "+" is positive, "-" is negative.
export type Entry = {
  id: string;
  trackerId: string;
  amount: number;
  at: number; // exact moment (ms)
  day: string; // local day "YYYY-MM-DD", fixed when logged
  note?: string;
};

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function localDay(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function createTracker(input: {
  name: string;
  unitLabel: string;
  step?: number;
  icon?: string;
  color?: string;
  goals?: Goals;
}): Tracker {
  // Copy the goals (and the days array) so the tracker never shares a reference with a preset constant.
  const goals: Goals = input.goals
    ? { ...input.goals, weeklyActiveDays: [...input.goals.weeklyActiveDays] }
    : { enabled: false, weeklyActiveDays: [] };

  return {
    id: newId(),
    name: input.name.trim(),
    icon: input.icon ?? "Target",
    color: input.color ?? "#2563EB",
    unit: createCounterUnit(input.unitLabel, input.step),
    features: {
      calendar: { enabled: true },
      insights: { enabled: true },
      goals,
      reminder: { enabled: false, time: "09:00", sound: "Default" },
    },
    createdAt: Date.now(),
    schemaVersion: 3, // bumped: weeklyActiveDays changed from a number to a list of weekdays
  };
}

// Today's total is derived from entries, never stored. No entries means 0.
export function totalForDay(entries: Entry[], trackerId: string, day: string): number {
  return entries
    .filter((e) => e.trackerId === trackerId && e.day === day)
    .reduce((sum, e) => sum + e.amount, 0);
}

// Builds an entry from a signed amount. Returns null when there is nothing to record.
export function makeEntry(tracker: Tracker, amount: number, now: Date = new Date()): Entry | null {
  if (amount === 0) return null;
  return { id: newId(), trackerId: tracker.id, amount, at: now.getTime(), day: localDay(now) };
}