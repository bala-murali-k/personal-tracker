import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Entry, Tracker } from "@/model/tracker.model";
import {
    AlarmClock,
    Bell,
    CheckCircle2,
    Clock,
    Sparkles,
} from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { calculateReminderEffect } from "../utils/insights.utils";

export interface ReminderFeatureProps {
    tracker: Tracker;
    entries: Entry[];
}

export function ReminderInsightsFeature({
    tracker,
    entries,
}: ReminderFeatureProps) {
    const reminder = useMemo(
        () => calculateReminderEffect(tracker, entries),
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
                        <Bell size={16} color={tracker.color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        Reminder Effect & Timing
                    </Text>
                </View>

                <View
                    className={cn(
                        "px-2.5 py-1 rounded-full",
                        reminder.reminderEnabled
                            ? "bg-emerald-50 border border-emerald-100"
                            : "bg-gray-100"
                    )}
                >
                    <Text
                        className={cn(
                            "text-[10px] font-bold",
                            reminder.reminderEnabled
                                ? "text-emerald-700"
                                : "text-gray-500"
                        )}
                    >
                        {reminder.reminderEnabled ? "Active Alert" : "No Alert Set"}
                    </Text>
                </View>
            </View>

            {reminder.reminderEnabled ? (
                <View className="gap-3">
                    {/* Reminder Config & Average First Log Comparison */}
                    <View className="flex-row items-center gap-3">
                        <View className="flex-1 bg-gray-50/90 rounded-2xl p-3.5 border border-gray-100">
                            <View className="flex-row items-center gap-1.5 mb-1">
                                <AlarmClock size={13} color="#6B7280" />
                                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Reminder Time
                                </Text>
                            </View>
                            <Text className="text-xl font-black text-gray-950 mt-0.5">
                                {reminder.reminderTime}
                            </Text>
                            <Text className="text-[11px] text-gray-400 mt-1 font-medium">
                                Scheduled daily
                            </Text>
                        </View>

                        <View className="flex-1 bg-gray-50/90 rounded-2xl p-3.5 border border-gray-100">
                            <View className="flex-row items-center gap-1.5 mb-1">
                                <Clock size={13} color="#6B7280" />
                                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    First Log Avg
                                </Text>
                            </View>
                            <Text className="text-xl font-black text-gray-950 mt-0.5">
                                {reminder.avgFirstEntryTime}
                            </Text>
                            <Text className="text-[11px] text-gray-400 mt-1 font-medium">
                                First entry of the day
                            </Text>
                        </View>
                    </View>

                    {/* Latency & On-Time Adherence */}
                    <View className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-xs font-bold text-gray-900">
                                Response Latency & On-Time Rate
                            </Text>
                            <View className="flex-row items-center gap-1">
                                <CheckCircle2 size={13} color={tracker.color} />
                                <Text
                                    className="text-xs font-black"
                                    style={{ color: tracker.color }}
                                >
                                    {reminder.onTimeRate}% on time
                                </Text>
                            </View>
                        </View>

                        <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                            {reminder.avgMinutesDiff > 0
                                ? `You typically log your first entry about ${reminder.avgMinutesDiff} minutes after your reminder notification.`
                                : reminder.avgMinutesDiff < 0
                                ? `You proactively log about ${Math.abs(
                                      reminder.avgMinutesDiff
                                  )} minutes ahead of your scheduled reminder!`
                                : "You log your first entry right on time when your reminder fires!"}
                        </Text>
                    </View>
                </View>
            ) : (
                <View className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 items-center justify-center">
                    <Clock size={20} color="#9CA3AF" />
                    <Text className="text-xs font-bold text-gray-800 mt-2 text-center">
                        No Daily Reminder Configured
                    </Text>
                    <Text className="text-[11px] text-gray-400 text-center mt-1 max-w-[260px] leading-relaxed">
                        Enable daily reminders on this tracker to track on-time logging consistency and response speed.
                    </Text>
                </View>
            )}
        </View>
    );
}

export default ReminderInsightsFeature;
