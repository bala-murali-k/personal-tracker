import { Text } from "@/components/ui/text";
import type { Entry, Tracker } from "@/model/tracker.model";
import { Award, Calendar, Flame, Trophy } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { calculateRecords } from "../utils/insights.utils";

export interface RecordsFeatureProps {
    tracker: Tracker;
    entries: Entry[];
}

export function RecordsInsightsFeature({
    tracker,
    entries,
}: RecordsFeatureProps) {
    const records = useMemo(
        () => calculateRecords(tracker, entries),
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
                        <Trophy size={16} color={tracker.color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        Personal Records
                    </Text>
                </View>
                <Text className="text-[11px] font-semibold text-gray-400">
                    All-Time Bests
                </Text>
            </View>

            {/* 3 Records Grid: Best Day, Best Week, Best Month */}
            <View className="gap-2.5">
                {/* Best Day */}
                <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                    <View className="flex-row items-center gap-3">
                        <View className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 items-center justify-center">
                            <Flame size={18} color="#D97706" />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-gray-900">
                                Best Day
                            </Text>
                            <Text className="text-[11px] text-gray-400 mt-0.5 font-medium">
                                {records.bestDay
                                    ? records.bestDay.formattedDate
                                    : "No records yet"}
                            </Text>
                        </View>
                    </View>

                    <View className="items-end">
                        <Text className="text-lg font-black text-gray-950">
                            {records.bestDay ? records.bestDay.amount : 0}
                        </Text>
                        <Text className="text-[10px] font-semibold text-gray-400 capitalize">
                            {tracker.unit.label}
                        </Text>
                    </View>
                </View>

                {/* Best Week */}
                <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                    <View className="flex-row items-center gap-3">
                        <View className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center">
                            <Award size={18} color="#2563EB" />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-gray-900">
                                Best Week
                            </Text>
                            <Text className="text-[11px] text-gray-400 mt-0.5 font-medium">
                                {records.bestWeek
                                    ? records.bestWeek.weekLabel
                                    : "No records yet"}
                            </Text>
                        </View>
                    </View>

                    <View className="items-end">
                        <Text className="text-lg font-black text-gray-950">
                            {records.bestWeek ? records.bestWeek.amount : 0}
                        </Text>
                        <Text className="text-[10px] font-semibold text-gray-400 capitalize">
                            {tracker.unit.label}
                        </Text>
                    </View>
                </View>

                {/* Best Month */}
                <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                    <View className="flex-row items-center gap-3">
                        <View className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 items-center justify-center">
                            <Calendar size={18} color="#9333EA" />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-gray-900">
                                Best Month
                            </Text>
                            <Text className="text-[11px] text-gray-400 mt-0.5 font-medium">
                                {records.bestMonth
                                    ? records.bestMonth.monthLabel
                                    : "No records yet"}
                            </Text>
                        </View>
                    </View>

                    <View className="items-end">
                        <Text className="text-lg font-black text-gray-950">
                            {records.bestMonth ? records.bestMonth.amount : 0}
                        </Text>
                        <Text className="text-[10px] font-semibold text-gray-400 capitalize">
                            {tracker.unit.label}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default RecordsInsightsFeature;
