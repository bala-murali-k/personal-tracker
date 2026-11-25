import { TrackerIcon } from "@/components/pages/createtracker/core.create.tracker.component";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { decrementAmount } from "@/model/counter.model";
import {
    localDay,
    makeEntry,
    totalForDay,
    type Tracker,
} from "@/model/tracker.model";
import { useTrackerStorage } from "@/store/tracker.store";
import {
    Bell,
    Calendar,
    ChevronDown,
    ChevronUp,
    Minus,
    Plus,
    Sparkles,
} from "lucide-react-native";
import { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    UIManager,
    View,
} from "react-native";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ViewTrackersProps {
    trackers?: Tracker[];
    onSelectTracker?: (tracker: Tracker) => void;
}

export function ViewTrackers({
    trackers: propTrackers,
    onSelectTracker,
}: ViewTrackersProps = {}) {
    const storedTrackers = useTrackerStorage((s) => s.trackers);
    const entries = useTrackerStorage((s) => s.entries);
    const addEntry = useTrackerStorage((s) => s.addEntry);

    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    const trackersList = propTrackers ?? storedTrackers;
    const todayStr = localDay();

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleIncrement = (tracker: Tracker) => {
        const entry = makeEntry(tracker, tracker.unit.step);
        if (entry) {
            addEntry(entry);
        }
    };

    const handleDecrement = (tracker: Tracker, todayTotal: number) => {
        const decAmount = decrementAmount(tracker.unit, todayTotal);
        if (decAmount !== 0) {
            const entry = makeEntry(tracker, decAmount);
            if (entry) {
                addEntry(entry);
            }
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
            className="w-full"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
        >
            {trackersList.map((tracker) => {
                const { id, name, icon, color, unit, features } = tracker;
                const isExpanded = Boolean(expandedIds[id]);
                const todayTotal = totalForDay(entries, id, todayStr);
                const goals = features.goals;
                const hasGoal = Boolean(goals?.enabled && (goals.daily ?? 0) > 0);
                const dailyGoal = goals?.daily ?? 0;
                const goalPercentage = hasGoal
                    ? Math.round((todayTotal / dailyGoal) * 100)
                    : 0;
                const decrementAllowed =
                    Boolean(unit.features?.decrement?.enabled) && todayTotal > 0;
                const weeklyDaysCount = goals?.weeklyActiveDays?.length ?? 0;

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
                        {/* List Row Header */}
                        <View className="w-full flex-row items-center justify-between p-3.5">
                            {/* Clickable Area: Icon & Info (Toggles Expand) */}
                            <Pressable
                                onPress={() => {
                                    toggleExpand(id);
                                    onSelectTracker?.(tracker);
                                }}
                                accessibilityRole="button"
                                accessibilityLabel={`${name}, ${
                                    isExpanded ? "collapse" : "expand"
                                }`}
                                className="flex-row items-center gap-3 flex-1 mr-2.5 active:opacity-75"
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

                            {/* Right Actions: Goal Percentage + Quick Add + Expand Chevron */}
                            <View className="flex-row items-center gap-2">
                                {hasGoal && (
                                    <Pressable
                                        onPress={() => {
                                            toggleExpand(id);
                                            onSelectTracker?.(tracker);
                                        }}
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

                                {/* Quick Add Button in List View */}
                                <Pressable
                                    onPress={() => handleIncrement(tracker)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Add ${unit.step} ${unit.label}`}
                                    className="w-9 h-9 rounded-xl items-center justify-center active:scale-95 shadow-2xs"
                                    style={{ backgroundColor: color }}
                                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                                >
                                    <Plus
                                        size={18}
                                        color="#FFFFFF"
                                        strokeWidth={2.5}
                                    />
                                </Pressable>

                                {/* Chevron Toggle */}
                                <Pressable
                                    onPress={() => {
                                        toggleExpand(id);
                                        onSelectTracker?.(tracker);
                                    }}
                                    accessibilityRole="button"
                                    accessibilityLabel={
                                        isExpanded ? "Collapse" : "Expand"
                                    }
                                    className="w-7 h-7 rounded-full items-center justify-center bg-gray-50 active:bg-gray-100"
                                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 6 }}
                                >
                                    {isExpanded ? (
                                        <ChevronUp size={15} color="#6B7280" />
                                    ) : (
                                        <ChevronDown size={15} color="#6B7280" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Expanded Available Information */}
                        {isExpanded && (
                            <View className="px-3.5 pb-3.5 pt-1 border-t border-gray-100/70">
                                {/* Detailed Counter & Goal */}
                                <View className="my-3">
                                    <View className="flex-row items-baseline justify-between mb-2">
                                        <View className="flex-row items-baseline gap-1.5">
                                            <Text className="text-3xl font-black text-gray-950 tracking-tight">
                                                {todayTotal}
                                            </Text>
                                            <Text className="text-sm font-semibold text-gray-400 capitalize">
                                                {unit.label} today
                                            </Text>
                                        </View>

                                        {hasGoal && (
                                            <Text className="text-xs font-semibold text-gray-400">
                                                Daily Target: {dailyGoal}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Progress Bar (when daily goal exists) */}
                                    {hasGoal && (
                                        <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <View
                                                className="h-full rounded-full"
                                                style={{
                                                    backgroundColor: color,
                                                    width: `${Math.min(
                                                        100,
                                                        goalPercentage
                                                    )}%`,
                                                }}
                                            />
                                        </View>
                                    )}
                                </View>

                                {/* Feature Badges / Metadata */}
                                {(features.reminder?.enabled ||
                                    weeklyDaysCount > 0 ||
                                    unit.step > 1) && (
                                    <View className="flex-row flex-wrap items-center gap-1.5 mb-3">
                                        {features.reminder?.enabled && (
                                            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                                                <Bell size={11} color="#6B7280" />
                                                <Text className="text-[11px] font-medium text-gray-600">
                                                    {features.reminder.time}
                                                </Text>
                                            </View>
                                        )}
                                        {weeklyDaysCount > 0 && (
                                            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                                                <Calendar size={11} color="#6B7280" />
                                                <Text className="text-[11px] font-medium text-gray-600">
                                                    {weeklyDaysCount} days/wk
                                                </Text>
                                            </View>
                                        )}
                                        <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                                            <Text className="text-[11px] font-medium text-gray-500">
                                                Step: +{unit.step}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Action Buttons */}
                                <View className="flex-row items-center gap-2">
                                    {unit.features?.decrement?.enabled && (
                                        <Pressable
                                            onPress={() =>
                                                handleDecrement(tracker, todayTotal)
                                            }
                                            disabled={!decrementAllowed}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Decrease ${unit.step} ${unit.label}`}
                                            className={cn(
                                                "h-11 w-11 rounded-xl bg-gray-100 items-center justify-center active:bg-gray-200 transition-all",
                                                !decrementAllowed && "opacity-30"
                                            )}
                                        >
                                            <Minus
                                                size={16}
                                                color="#374151"
                                                strokeWidth={2.5}
                                            />
                                        </Pressable>
                                    )}

                                    <Pressable
                                        onPress={() => handleIncrement(tracker)}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Add ${unit.step} ${unit.label}`}
                                        className="flex-1 h-11 flex-row items-center justify-center gap-2 rounded-xl active:opacity-90 shadow-xs"
                                        style={{ backgroundColor: color }}
                                    >
                                        <Plus
                                            size={16}
                                            color="#FFFFFF"
                                            strokeWidth={2.5}
                                        />
                                        <Text className="text-sm font-bold text-white">
                                            +{unit.step} {unit.label}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}