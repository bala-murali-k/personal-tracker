import type { Entry, Tracker } from "@/model/tracker.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TrackerState = {
    // data saved
    trackers: Tracker[];
    entries: Entry[];
    // runtime only not saved
    hydrated: boolean;
    // actions: thin on purpose. Rules like "never below zero" stay in the model files.
    addTracker: (tracker: Tracker) => void;
    addEntry: (entry: Entry) => void;
    removeEntry: (entryId: string) => void;
    setHydrated: () => void;
}

const noStorageFound = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export const useTrackerStorage = create<TrackerState>()(
    persist(
        (set) => ({
            trackers: [],
            entries: [],
            hydrated: false,
            addTracker: (tracker) => set((s) => ({ trackers: [ ...s.trackers, tracker ] })),
            addEntry: (entry) => set((s) => ({ entries: [ ...s.entries, entry ] })),
            removeEntry: (entryId) => set((s) => ({ entries: s.entries.filter((e) => e.id !== entryId) })),
            setHydrated: () => set({ hydrated: true }),
        }),
        {
            name: "tracker-store",
            version: 1,
            storage: createJSONStorage(() => (typeof window === "undefined" ? noStorageFound : AsyncStorage)),
            partialize: (s) => ({ trackers: s.trackers, entries: s.entries }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHydrated();
                } else {
                    setTimeout(() => useTrackerStorage.setState({ hydrated: true }), 0);
                }
            }
        }
    )
);