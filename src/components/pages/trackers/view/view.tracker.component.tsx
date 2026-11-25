import { TrackerIcon } from "@/components/pages/createtracker/core.create.tracker.component";
import { DetailTrackerModal } from "@/components/pages/trackers/modal/detail.tracker.modal";
import { Text } from "@/components/ui/text";
import {
    localDay,
    makeEntry,
    totalForDay,
    type Tracker,
} from "@/model/tracker.model";
import { useTrackerStorage } from "@/store/tracker.store";
import {
    ChevronRight,
    Plus,
    Sparkles,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export interface ViewTrackerComponentProps {
    trackers?: Tracker[];
    onSelectTracker?: (tracker: Tracker) => void;
}

export function ViewTrackerComponent({
    trackers: propTrackers,
    onSelectTracker,
}: ViewTrackerComponentProps = {}) {
    const storedTrackers = useTrackerStorage((s) => s.trackers);
    const entries = useTrackerStorage((s) => s.entries);
    const addEntry = useTrackerStorage((s) => s.addEntry);

    const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
        null
    );

    const trackersList = propTrackers ?? storedTrackers;
    const todayStr = localDay();

    const selectedTracker = trackersList.find(
        (t) => t.id === internalSelectedId
    );

    const handleCardPress = (tracker: Tracker) => {
        if (onSelectTracker) {
            onSelectTracker(tracker);
        } else {
            setInternalSelectedId(tracker.id);
        }
    };

    const handleQuickAdd = (tracker: Tracker) => {
        const entry = makeEntry(tracker, tracker.unit.step);
        if (entry) {
            addEntry(entry);
        }
    };

    if (trackersList.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-20 px-6">
                <View className="w-16 h-16 rounded-3xl bg-blue-50 items-center justify-center mb-4">
                    <Sparkles size={28} color="#2563EB" />
                </View>
                <Text className="text-lg font-bold text-gray-900 text-center">
                    No Trackers Yet
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-1.5 max-w-[240px] leading-relaxed">
                    Tap the "+" button in the footer to create your first tracker and start logging.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="w-full flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
        >
            {trackersList.map((tracker) => {
                const { id, name, icon, color, unit, features } = tracker;
                const todayTotal = totalForDay(entries, id, todayStr);
                const goals = features.goals;
                const hasGoal = Boolean(goals?.enabled && (goals.daily ?? 0) > 0);
                const dailyGoal = goals?.daily ?? 0;
                const goalPercentage = hasGoal
                    ? Math.round((todayTotal / dailyGoal) * 100)
                    : 0;

                return (
                    <View
                        key={id}
                        className="w-full bg-white rounded-2xl mb-2.5 border border-gray-100 overflow-hidden"
                        style={{
                            elevation: 2,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.04,
                            shadowRadius: 6,
                        }}
                    >
                        <View className="w-full flex-row items-center justify-between p-3.5">
                            {/* Card Content (Tapping opens the single tracker modal) */}
                            <Pressable
                                onPress={() => handleCardPress(tracker)}
                                accessibilityRole="button"
                                accessibilityLabel={`View details for ${name}`}
                                className="flex-row items-center gap-3 flex-1 mr-2.5 active:opacity-70"
                            >
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center shadow-2xs"
                                    style={{ backgroundColor: color }}
                                >
                                    <TrackerIcon
                                        icon={icon}
                                        size={20}
                                        color="#FFFFFF"
                                        fill="#FFFFFF"
                                        strokeWidth={2}
                                    />
                                </View>

                                <View className="flex-1">
                                    <Text
                                        className="text-base font-bold text-gray-900 leading-tight"
                                        numberOfLines={1}
                                    >
                                        {name}
                                    </Text>
                                    <Text className="text-xs text-gray-400 mt-0.5 capitalize font-medium">
                                        {hasGoal
                                            ? `${todayTotal} / ${dailyGoal} ${unit.label}`
                                            : `${todayTotal} ${unit.label}`}
                                    </Text>
                                </View>
                            </Pressable>

                            {/* Right Actions: Goal Percentage + Quick Add + Open Chevron */}
                            <View className="flex-row items-center gap-2">
                                {hasGoal && (
                                    <Pressable
                                        onPress={() => handleCardPress(tracker)}
                                        className="px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: `${color}15` }}
                                    >
                                        <Text
                                            className="text-xs font-bold"
                                            style={{ color }}
                                        >
                                            {goalPercentage}%
                                        </Text>
                                    </Pressable>
                                )}

                                {/* Quick Add Button in Trackers list */}
                                <Pressable
                                    onPress={() => handleQuickAdd(tracker)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Quick add ${unit.step} ${unit.label}`}
                                    className="w-9 h-9 rounded-xl items-center justify-center active:scale-95 shadow-2xs"
                                    style={{ backgroundColor: color }}
                                    hitSlop={{
                                        top: 6,
                                        bottom: 6,
                                        left: 4,
                                        right: 4,
                                    }}
                                >
                                    <Plus
                                        size={18}
                                        color="#FFFFFF"
                                        strokeWidth={2.5}
                                    />
                                </Pressable>

                                {/* Chevron Open Modal Indicator */}
                                <Pressable
                                    onPress={() => handleCardPress(tracker)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Open ${name} details`}
                                    className="w-7 h-7 rounded-full items-center justify-center bg-gray-50 active:bg-gray-100"
                                    hitSlop={{
                                        top: 6,
                                        bottom: 6,
                                        left: 4,
                                        right: 6,
                                    }}
                                >
                                    <ChevronRight size={15} color="#6B7280" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                );
            })}

            {/* Standalone fallback modal support */}
            {!onSelectTracker && (
                <DetailTrackerModal
                    tracker={selectedTracker}
                    visible={Boolean(selectedTracker)}
                    onClose={() => setInternalSelectedId(null)}
                />
            )}
        </ScrollView>
    );
}