// React Native Imports
import { View } from "react-native";

// React Reusables imports
import { Text } from "@/components/ui/text";

// Model imports
import { localDay } from "@/model/tracker.model";

// Zustand Imports
import { useTrackerStorage } from "@/store/tracker.store";

// Component Imports
import { ViewTrackers } from "@/components/pages/home/trackers/view.trackers.component";

export default function CoreHomeComponent() {
    const trackers = useTrackerStorage((tracker) => tracker.trackers);
    const entries = useTrackerStorage((tracker) => tracker.entries);

    const todayStr = localDay();
    const todayLogsCount = entries.filter(
        (e) => e.day === todayStr && e.amount > 0
    ).length;

    return (
        <View className="flex-1 px-5 pt-2">
            {/* Header info */}
            <View className="mb-4">
                <Text className="text-2xl font-black text-gray-900 tracking-tight">
                    My Trackers
                </Text>
                <Text className="text-xs font-medium text-gray-500 mt-0.5">
                    {trackers.length > 0
                        ? `${trackers.length} active tracker${
                              trackers.length === 1 ? "" : "s"
                          } • ${todayLogsCount} logged today`
                        : "Track your habits, goals, and daily progress"}
                </Text>
            </View>

            {/* Realtime Trackers List */}
            <ViewTrackers trackers={trackers} />
        </View>
    );
}
