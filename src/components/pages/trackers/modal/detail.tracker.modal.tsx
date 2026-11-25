import { TrackerIcon } from "@/components/pages/createtracker/core.create.tracker.component";
import { CalendarHeatmapComponent } from "@/components/pages/trackers/features/calendar.heatmap.component";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { decrementAmount } from "@/model/counter.model";
import {
    localDay,
    makeEntry,
    totalForDay,
    type Tracker,
    type WeekDays,
} from "@/model/tracker.model";
import { useTrackerStorage } from "@/store/tracker.store";
import {
    Bell,
    Calendar,
    ChevronLeft,
    Minus,
    Plus,
} from "lucide-react-native";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface DetailTrackerModalProps {
    tracker: Tracker | null | undefined;
    visible: boolean;
    onClose: () => void;
}

const DAYS_OF_WEEK: { key: WeekDays; label: string; short: string }[] = [
    { key: "Monday", label: "Mon", short: "M" },
    { key: "Tuesday", label: "Tue", short: "T" },
    { key: "Wednesday", label: "Wed", short: "W" },
    { key: "Thursday", label: "Thu", short: "T" },
    { key: "Friday", label: "Fri", short: "F" },
    { key: "Saturday", label: "Sat", short: "S" },
    { key: "Sunday", label: "Sun", short: "S" },
];

export function DetailTrackerModal({
    tracker,
    visible,
    onClose,
}: DetailTrackerModalProps) {
    const insets = useSafeAreaInsets();
    const entries = useTrackerStorage((s) => s.entries);
    const addEntry = useTrackerStorage((s) => s.addEntry);

    if (!tracker) {
        return null;
    }

    const { id, name, icon, color, unit, features } = tracker;
    const todayStr = localDay();
    const todayTotal = totalForDay(entries, id, todayStr);

    const goals = features.goals;
    const hasGoal = Boolean(goals?.enabled && (goals.daily ?? 0) > 0);
    const dailyGoal = goals?.daily ?? 0;
    const goalPercentage = hasGoal
        ? Math.round((todayTotal / dailyGoal) * 100)
        : 0;
    const decrementAllowed =
        Boolean(unit.features?.decrement?.enabled) && todayTotal > 0;

    const handleIncrement = () => {
        const entry = makeEntry(tracker, unit.step);
        if (entry) {
            addEntry(entry);
        }
    };

    const handleDecrement = () => {
        const decAmount = decrementAmount(unit, todayTotal);
        if (decAmount !== 0) {
            const entry = makeEntry(tracker, decAmount);
            if (entry) {
                addEntry(entry);
            }
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="h-full w-full bg-white flex-col">
                {/* Topbar */}
                <View
                    className="w-full px-5 py-3 flex-row items-center justify-between border-b border-gray-100 bg-white"
                    style={{ paddingTop: Math.max(insets.top, 16) }}
                >
                    <Pressable
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Close tracker details"
                        hitSlop={8}
                        className="active:opacity-70"
                    >
                        <View className="h-10 w-10 items-center justify-center bg-gray-100 rounded-full">
                            <ChevronLeft size={22} color="#1F2937" />
                        </View>
                    </Pressable>

                    <Text className="text-base font-bold text-gray-900">
                        Tracker Details
                    </Text>

                    <View
                        className="px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${color}18` }}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{ color }}
                        >
                            {unit.label}
                        </Text>
                    </View>
                </View>

                {/* Scrollable Content Body */}
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    {/* Hero Tracker Section */}
                    <View className="items-center py-6">
                        <View
                            className="w-20 h-20 rounded-3xl items-center justify-center shadow-sm mb-3"
                            style={{ backgroundColor: color }}
                        >
                            <TrackerIcon
                                icon={icon}
                                size={40}
                                color="#FFFFFF"
                                fill="#FFFFFF"
                                strokeWidth={2}
                            />
                        </View>
                        <Text className="text-2xl font-black text-gray-950 text-center tracking-tight">
                            {name}
                        </Text>
                        <Text className="text-xs font-medium text-gray-400 mt-1 capitalize text-center">
                            Counting {unit.label} • +{unit.step} per entry
                        </Text>
                    </View>

                    {/* Today's Status & Quick Log Card */}
                    <View
                        className="w-full rounded-3xl p-5 mb-5 border border-gray-100"
                        style={{ backgroundColor: `${color}0A` }}
                    >
                        <View className="flex-row items-baseline justify-between mb-1">
                            <Text className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Today's Total
                            </Text>
                            {hasGoal && (
                                <Text
                                    className="text-xs font-bold"
                                    style={{ color }}
                                >
                                    {goalPercentage}% of {dailyGoal} {unit.label}
                                </Text>
                            )}
                        </View>

                        <View className="flex-row items-baseline gap-2 my-2">
                            <Text className="text-4xl font-black text-gray-950 tracking-tight">
                                {todayTotal}
                            </Text>
                            <Text className="text-base font-semibold text-gray-500 capitalize">
                                {unit.label}
                            </Text>
                        </View>

                        {/* Progress Bar */}
                        {hasGoal && (
                            <View className="h-2.5 w-full bg-gray-200/80 rounded-full overflow-hidden my-1">
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

                        {/* Quick Log Action Steppers */}
                        <View className="flex-row items-center gap-2.5 mt-4 pt-3 border-t border-gray-200/60">
                            {unit.features?.decrement?.enabled && (
                                <Pressable
                                    onPress={handleDecrement}
                                    disabled={!decrementAllowed}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Decrease ${unit.step} ${unit.label}`}
                                    className={cn(
                                        "h-12 px-4 flex-row items-center justify-center gap-1.5 rounded-2xl bg-white border border-gray-200 active:bg-gray-100 transition-all",
                                        !decrementAllowed && "opacity-30"
                                    )}
                                >
                                    <Minus
                                        size={18}
                                        color="#374151"
                                        strokeWidth={2.5}
                                    />
                                    <Text className="text-sm font-bold text-gray-700">
                                        -{unit.step}
                                    </Text>
                                </Pressable>
                            )}

                            <Pressable
                                onPress={handleIncrement}
                                accessibilityRole="button"
                                accessibilityLabel={`Add ${unit.step} ${unit.label}`}
                                className="flex-1 h-12 flex-row items-center justify-center gap-2 rounded-2xl active:opacity-90 shadow-xs"
                                style={{ backgroundColor: color }}
                            >
                                <Plus
                                    size={18}
                                    color="#FFFFFF"
                                    strokeWidth={2.5}
                                />
                                <Text className="text-sm font-bold text-white">
                                    Log +{unit.step} {unit.label}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Feature 1: Modern Heat Map Calendar (Enabled by default) */}
                    {features.calendar?.enabled !== false && (
                        <CalendarHeatmapComponent
                            trackerId={id}
                            entries={entries}
                            color={color}
                            unitLabel={unit.label}
                            dailyGoal={dailyGoal}
                            step={unit.step}
                        />
                    )}

                    {/* Feature 2: Weekly Schedule Days (if goals enabled with active days) */}
                    {Boolean(
                        goals?.enabled &&
                            goals.weeklyActiveDays &&
                            goals.weeklyActiveDays.length > 0
                    ) && (
                        <View className="mb-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs">
                            <View className="flex-row items-center gap-2 mb-3">
                                <View
                                    className="w-7 h-7 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: `${color}18` }}
                                >
                                    <Calendar size={15} color={color} />
                                </View>
                                <Text className="text-base font-bold text-gray-900">
                                    Weekly Schedule
                                </Text>
                            </View>

                            <View className="flex-row items-center justify-between mt-1">
                                {DAYS_OF_WEEK.map((day) => {
                                    const isActive =
                                        goals.weeklyActiveDays.includes(day.key);
                                    return (
                                        <View
                                            key={day.key}
                                            className="items-center"
                                        >
                                            <View
                                                className={cn(
                                                    "w-9 h-9 rounded-xl items-center justify-center mb-1",
                                                    isActive
                                                        ? ""
                                                        : "bg-gray-50 border border-gray-100"
                                                )}
                                                style={
                                                    isActive
                                                        ? { backgroundColor: color }
                                                        : undefined
                                                }
                                            >
                                                <Text
                                                    className={cn(
                                                        "text-xs font-bold",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-gray-400"
                                                    )}
                                                >
                                                    {day.short}
                                                </Text>
                                            </View>
                                            <Text
                                                className={cn(
                                                    "text-[10px] font-semibold",
                                                    isActive
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                )}
                                            >
                                                {day.label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Feature 3: Reminder Card (if reminder feature is enabled) */}
                    {Boolean(features.reminder?.enabled) && (
                        <View className="mb-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View
                                        className="w-10 h-10 rounded-2xl items-center justify-center"
                                        style={{ backgroundColor: `${color}18` }}
                                    >
                                        <Bell size={20} color={color} />
                                    </View>
                                    <View>
                                        <Text className="text-base font-bold text-gray-900">
                                            Daily Reminder
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-0.5">
                                            Sound: {features.reminder.sound || "Default"}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    className="px-3.5 py-1.5 rounded-full"
                                    style={{ backgroundColor: `${color}15` }}
                                >
                                    <Text
                                        className="text-sm font-bold"
                                        style={{ color }}
                                    >
                                        {features.reminder.time}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Footer Done Button */}
                <View
                    className="w-full px-5 pt-3 bg-white border-t border-gray-100"
                    style={{ paddingBottom: Math.max(insets.bottom, 16) }}
                >
                    <Pressable
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Done"
                        className="w-full h-14 rounded-full items-center justify-center bg-gray-900 active:bg-gray-800 shadow-sm"
                    >
                        <Text className="text-base font-bold text-white">
                            Done
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

export default DetailTrackerModal;
