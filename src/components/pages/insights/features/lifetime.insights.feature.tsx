import { Text } from "@/components/ui/text";
import type { Entry, Tracker } from "@/model/tracker.model";
import {
    Activity,
    CheckCircle,
    Clock,
    MinusCircle,
    PlusCircle,
    RotateCcw,
} from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { calculateLifetime } from "../utils/insights.utils";

export interface LifetimeFeatureProps {
    tracker: Tracker;
    entries: Entry[];
}

export function LifetimeInsightsFeature({
    tracker,
    entries,
}: LifetimeFeatureProps) {
    const stats = useMemo(
        () => calculateLifetime(tracker, entries),
        [tracker, entries]
    );

    return (
        <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
            {/* Header: Lifetime Stats */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2.5">
                    <View
                        className="w-8 h-8 rounded-xl items-center justify-center shadow-2xs"
                        style={{ backgroundColor: `${tracker.color}18` }}
                    >
                        <Activity size={16} color={tracker.color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        Lifetime & Correction Stats
                    </Text>
                </View>
                <Text className="text-[11px] font-semibold text-gray-400">
                    {stats.daysSinceCreation} {stats.daysSinceCreation === 1 ? "day" : "days"} active
                </Text>
            </View>

            {/* 3 Lifetime Metric Cards */}
            <View className="flex-row items-center gap-2.5 mb-4">
                {/* Total Net */}
                <View className="flex-1 bg-gray-50/90 rounded-2xl p-3 border border-gray-100">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Total Net
                    </Text>
                    <Text className="text-xl font-black text-gray-950 mt-1">
                        {stats.totalNet}
                    </Text>
                    <Text className="text-[10px] font-semibold text-gray-400 capitalize mt-0.5">
                        {tracker.unit.label}
                    </Text>
                </View>

                {/* Avg Per Active Day */}
                <View className="flex-1 bg-gray-50/90 rounded-2xl p-3 border border-gray-100">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Active Day Avg
                    </Text>
                    <Text className="text-xl font-black text-gray-950 mt-1">
                        {stats.avgPerActiveDay}
                    </Text>
                    <Text className="text-[10px] font-semibold text-gray-400 capitalize mt-0.5">
                        {tracker.unit.label}/day
                    </Text>
                </View>

                {/* Active Days */}
                <View className="flex-1 bg-gray-50/90 rounded-2xl p-3 border border-gray-100">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Logged Days
                    </Text>
                    <Text className="text-xl font-black text-gray-950 mt-1">
                        {stats.activeDaysCount}
                    </Text>
                    <Text className="text-[10px] font-semibold text-gray-400 mt-0.5">
                        of {stats.daysSinceCreation} days
                    </Text>
                </View>
            </View>

            {/* Correction Behavior: Net vs Gross & Decrement Rate */}
            <View className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-1.5">
                        <RotateCcw size={14} color="#6B7280" />
                        <Text className="text-xs font-bold text-gray-900">
                            Correction Behavior
                        </Text>
                    </View>

                    <View
                        className="px-2.5 py-0.5 rounded-full"
                        style={{
                            backgroundColor:
                                stats.decrementRate <= 5
                                    ? "#ECFDF5"
                                    : "#FEF2F2",
                        }}
                    >
                        <Text
                            className="text-[11px] font-bold"
                            style={{
                                color:
                                    stats.decrementRate <= 5
                                        ? "#059669"
                                        : "#DC2626",
                            }}
                        >
                            {stats.decrementRate}% decrement rate
                        </Text>
                    </View>
                </View>

                {/* Net vs Gross Breakdown */}
                <View className="gap-2 pt-1">
                    <View className="flex-row items-center justify-between p-2.5 rounded-xl bg-white border border-gray-100">
                        <View className="flex-row items-center gap-2">
                            <PlusCircle size={14} color="#059669" />
                            <Text className="text-xs font-semibold text-gray-700">
                                Gross Additions
                            </Text>
                        </View>
                        <Text className="text-xs font-black text-gray-900">
                            +{stats.totalGross} {tracker.unit.label}
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 rounded-xl bg-white border border-gray-100">
                        <View className="flex-row items-center gap-2">
                            <MinusCircle size={14} color="#DC2626" />
                            <Text className="text-xs font-semibold text-gray-700">
                                Corrections / Decrements
                            </Text>
                        </View>
                        <Text className="text-xs font-black text-rose-600">
                            {stats.totalDecrements} {tracker.unit.label} ({stats.decrementCount}x)
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 rounded-xl bg-white border border-gray-100">
                        <View className="flex-row items-center gap-2">
                            <CheckCircle size={14} color={tracker.color} />
                            <Text className="text-xs font-semibold text-gray-700">
                                Net Total
                            </Text>
                        </View>
                        <Text
                            className="text-xs font-black"
                            style={{ color: tracker.color }}
                        >
                            {stats.totalNet} {tracker.unit.label}
                        </Text>
                    </View>
                </View>

                <Text className="text-[10px] text-gray-400 mt-2.5 text-center">
                    Low decrement rate indicates high logging confidence and rare corrections.
                </Text>
            </View>
        </View>
    );
}

export default LifetimeInsightsFeature;
