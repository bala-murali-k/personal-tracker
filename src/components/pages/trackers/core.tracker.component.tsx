import { DetailTrackerModal } from "@/components/pages/trackers/modal/detail.tracker.modal";
import { ViewTrackerComponent } from "@/components/pages/trackers/view/view.tracker.component";
import { Text } from "@/components/ui/text";
import { localDay, type Tracker } from "@/model/tracker.model";
import { useTrackerStorage } from "@/store/tracker.store";
import { useState } from "react";
import { View } from "react-native";

export default function CoreTrackerComponent() {
    const trackers = useTrackerStorage((s) => s.trackers);
    const entries = useTrackerStorage((s) => s.entries);
    const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(
        null
    );

    const todayStr = localDay();
    const todayLogsCount = entries.filter(
        (e) => e.day === todayStr && e.amount > 0
    ).length;

    const selectedTracker = trackers.find((t) => t.id === selectedTrackerId);

    return (
        <View className="flex-1 px-5 pt-2">
            {/* Header info */}
            <View className="mb-4">
                <Text className="text-2xl font-black text-gray-900 tracking-tight">
                    Trackers
                </Text>
                <Text className="text-xs font-medium text-gray-500 mt-0.5">
                    {trackers.length > 0
                        ? `${trackers.length} active tracker${
                              trackers.length === 1 ? "" : "s"
                          } • Tap a tracker to view details`
                        : "Track your habits, goals, and daily progress"}
                </Text>
            </View>

            {/* Trackers List View */}
            <ViewTrackerComponent
                trackers={trackers}
                onSelectTracker={(tracker: Tracker) =>
                    setSelectedTrackerId(tracker.id)
                }
            />

            {/* Single Tracker Detail Modal */}
            <DetailTrackerModal
                tracker={selectedTracker}
                visible={Boolean(selectedTracker)}
                onClose={() => setSelectedTrackerId(null)}
            />
        </View>
    );
}
