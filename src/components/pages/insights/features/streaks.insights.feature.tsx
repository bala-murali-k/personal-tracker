import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Entry, Tracker } from "@/model/tracker.model";
import { CheckCircle2, Flame, Target } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { calculateStreaks } from "../utils/insights.utils";

export interface StreaksFeatureProps {
    tracker: Tracker;
    entries: Entry[];
}

export function StreaksInsightsFeature({
    tracker,
    entries,
}: StreaksFeatureProps) {
    const streaks = useMemo(
        () => calculateStreaks(tracker, entries),
        [tracker, entries]
    );

    return (
        <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2.5">
                    <View
                        className="w-8 h-8 rounded-xl items-center justify-center shadow-2xs"
                        style={{ backgroundColor: `${tracker.color}18` }}
                    >
                        <Flame size={16} color={tracker.color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        Streaks & Goal Adherence
                    </Text>
                </View>
                <Text className="text-[11px] font-semibold text-gray-400">
                    Target: {streaks.dailyTarget} {tracker.unit.label}
                </Text>
            </View>

            {/* Current & Longest Streak Cards */}
            <View className="flex-row items-center gap-3 mb-4">
                {/* Current Streak */}
                <View className="flex-1 bg-amber-50/70 rounded-2xl p-4 border border-amber-100/80">
                    <View className="flex-row items-center gap-1.5">
                        <Flame size={15} color="#D97706" />
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            Current Streak
                        </Text>
                    </View>
                    <View className="flex-row items-baseline gap-1 mt-1.5">
                        <Text className="text-3xl font-black text-gray-950 tracking-tight">
                            {streaks.currentStreak}
                        </Text>
                        <Text className="text-xs font-bold text-gray-500">
                            {streaks.currentStreak === 1 ? "day" : "days"}
                        </Text>
                    </View>
                    <Text className="text-[11px] text-amber-700 mt-1 font-medium">
                        Goal days only
                    </Text>
                </View>

                {/* Longest Streak */}
                <View className="flex-1 bg-gray-50/90 rounded-2xl p-4 border border-gray-100">
                    <View className="flex-row items-center gap-1.5">
                        <Target size={15} color="#4B5563" />
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Longest Streak
                        </Text>
                    </View>
                    <View className="flex-row items-baseline gap-1 mt-1.5">
                        <Text className="text-3xl font-black text-gray-950 tracking-tight">
                            {streaks.longestStreak}
                        </Text>
                        <Text className="text-xs font-bold text-gray-500">
                            {streaks.longestStreak === 1 ? "day" : "days"}
                        </Text>
                    </View>
                    <Text className="text-[11px] text-gray-400 mt-1 font-medium">
                        Personal milestone
                    </Text>
                </View>
            </View>

            {/* Goal Adherence This Week */}
            <View className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                <View className="flex-row items-center justify-between mb-3">
                    <View>
                        <Text className="text-xs font-bold text-gray-900">
                            Goal Adherence This Week
                        </Text>
                        <Text className="text-[11px] text-gray-400 mt-0.5">
                            {streaks.goalDaysThisWeek} of {streaks.totalDaysThisWeek} days hit target
                        </Text>
                    </View>

                    <View
                        className="px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${tracker.color}18` }}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{ color: tracker.color }}
                        >
                            {streaks.adherencePercent}% rate
                        </Text>
                    </View>
                </View>

                {/* 7-Day Pill Timeline for Current Week */}
                <View className="flex-row items-center justify-between pt-1">
                    {streaks.weekDaysStatus.map((item, idx) => (
                        <View key={idx} className="items-center flex-1">
                            <View
                                className={cn(
                                    "w-9 h-9 rounded-xl items-center justify-center mb-1",
                                    item.isHit
                                        ? ""
                                        : "bg-white border border-gray-200"
                                )}
                                style={
                                    item.isHit
                                        ? { backgroundColor: tracker.color }
                                        : undefined
                                }
                            >
                                {item.isHit ? (
                                    <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.5} />
                                ) : (
                                    <Text className="text-xs font-bold text-gray-400">
                                        {item.short[0]}
                                    </Text>
                                )}
                            </View>
                            <Text
                                className={cn(
                                    "text-[10px] font-semibold",
                                    item.isHit ? "text-gray-900 font-bold" : "text-gray-400"
                                )}
                            >
                                {item.short}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default StreaksInsightsFeature;
