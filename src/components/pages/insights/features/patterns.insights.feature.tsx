import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Entry, Tracker } from "@/model/tracker.model";
import {
    CalendarDays,
    Clock,
    Sun,
    Sunset,
} from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import {
    calculateTimeOfDay,
    calculateWeekdayPattern,
} from "../utils/insights.utils";

export interface PatternsFeatureProps {
    tracker: Tracker;
    entries: Entry[];
}

export function PatternsInsightsFeature({
    tracker,
    entries,
}: PatternsFeatureProps) {
    const weekday = useMemo(
        () => calculateWeekdayPattern(tracker, entries),
        [tracker, entries]
    );

    const timeOfDay = useMemo(
        () => calculateTimeOfDay(tracker, entries),
        [tracker, entries]
    );

    // Find highest average for bar scaling
    const maxWeekdayAvg = useMemo(() => {
        return Math.max(1, ...weekday.dailyAverages.map((d) => d.avg));
    }, [weekday]);

    return (
        <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
            {/* Header: Weekday Patterns */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2.5">
                    <View
                        className="w-8 h-8 rounded-xl items-center justify-center shadow-2xs"
                        style={{ backgroundColor: `${tracker.color}18` }}
                    >
                        <CalendarDays size={16} color={tracker.color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        Weekday & Time Patterns
                    </Text>
                </View>
            </View>

            {/* Best & Worst Weekday highlights */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="flex-1 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Best Weekday
                    </Text>
                    <Text className="text-base font-black text-gray-950 mt-0.5">
                        {weekday.bestWeekday.day}
                    </Text>
                    <Text className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        Avg {weekday.bestWeekday.avg} {tracker.unit.label}
                    </Text>
                </View>

                <View className="flex-1 p-3 rounded-2xl bg-rose-50/70 border border-rose-100/80">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                        Worst Weekday
                    </Text>
                    <Text className="text-base font-black text-gray-950 mt-0.5">
                        {weekday.worstWeekday.day}
                    </Text>
                    <Text className="text-[11px] font-semibold text-rose-700 mt-0.5">
                        Avg {weekday.worstWeekday.avg} {tracker.unit.label}
                    </Text>
                </View>
            </View>

            {/* Daily Averages Mini Bar Chart */}
            <View className="bg-gray-50/80 rounded-2xl p-3.5 mb-4 border border-gray-100">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Daily Average Distribution
                </Text>
                <View className="flex-row items-end justify-between h-20 pt-2">
                    {weekday.dailyAverages.map((item, idx) => {
                        const heightPercent = Math.max(
                            8,
                            Math.round((item.avg / maxWeekdayAvg) * 100)
                        );
                        const isBest = item.day === weekday.bestWeekday.day;

                        return (
                            <View
                                key={idx}
                                className="items-center flex-1 h-full justify-end"
                            >
                                <Text className="text-[9px] font-bold text-gray-400 mb-1">
                                    {item.avg > 0 ? item.avg : 0}
                                </Text>
                                <View
                                    className="w-5 rounded-t-lg transition-all"
                                    style={{
                                        height: `${heightPercent}%`,
                                        backgroundColor: isBest
                                            ? tracker.color
                                            : `${tracker.color}45`,
                                    }}
                                />
                                <Text
                                    className={cn(
                                        "text-[10px] mt-1.5 font-bold",
                                        isBest ? "text-gray-900" : "text-gray-400"
                                    )}
                                >
                                    {item.short}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Weekday vs Weekend Comparison */}
            <View className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xs font-bold text-gray-900">
                        Weekday vs. Weekend
                    </Text>
                    <Text className="text-[11px] font-semibold text-gray-500">
                        {weekday.weekendDiffPercentage >= 0
                            ? `+${weekday.weekendDiffPercentage}% on weekends`
                            : `${weekday.weekendDiffPercentage}% on weekends`}
                    </Text>
                </View>

                <View className="flex-row items-center gap-2">
                    <View className="flex-1 flex-row items-center justify-between p-2.5 rounded-xl bg-white border border-gray-100">
                        <Text className="text-xs font-medium text-gray-500">
                            Mon - Fri
                        </Text>
                        <Text className="text-xs font-black text-gray-900">
                            {weekday.weekdayAvg} {tracker.unit.label}
                        </Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-between p-2.5 rounded-xl bg-white border border-gray-100">
                        <Text className="text-xs font-medium text-gray-500">
                            Sat - Sun
                        </Text>
                        <Text className="text-xs font-black text-gray-900">
                            {weekday.weekendAvg} {tracker.unit.label}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Time of Day Section */}
            <View className="pt-2 border-t border-gray-100">
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                        <Clock size={15} color="#4B5563" />
                        <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Time of Day
                        </Text>
                    </View>
                    <View className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                        <Text className="text-[11px] font-bold text-blue-700">
                            Peak: {timeOfDay.peakHour}
                        </Text>
                    </View>
                </View>

                {/* Morning vs Evening split bar */}
                <View className="bg-gray-50/80 rounded-2xl p-3.5 border border-gray-100">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-1.5">
                            <Sun size={14} color="#F59E0B" />
                            <Text className="text-xs font-bold text-gray-800">
                                Morning {timeOfDay.morningPercent}%
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                            <Text className="text-xs font-bold text-gray-800">
                                Evening {timeOfDay.eveningPercent}%
                            </Text>
                            <Sunset size={14} color="#6366F1" />
                        </View>
                    </View>

                    {/* Dual Color Progress Bar */}
                    <View className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex-row">
                        <View
                            className="h-full bg-amber-400"
                            style={{ width: `${timeOfDay.morningPercent}%` }}
                        />
                        <View
                            className="h-full bg-indigo-500"
                            style={{ width: `${timeOfDay.eveningPercent}%` }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default PatternsInsightsFeature;
