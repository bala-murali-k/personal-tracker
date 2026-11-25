import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Entry, Tracker } from "@/model/tracker.model";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    TrendingUp,
    Zap,
} from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { calculateTrends } from "../utils/insights.utils";

export interface TrendsFeatureProps {
    tracker: Tracker;
    entries: Entry[];
}

export function TrendsInsightsFeature({
    tracker,
    entries,
}: TrendsFeatureProps) {
    const trends = useMemo(
        () => calculateTrends(tracker, entries),
        [tracker, entries]
    );

    const isPositiveChange = trends.weekOverWeekChange > 0;
    const isNegativeChange = trends.weekOverWeekChange < 0;

    return (
        <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2.5">
                    <View
                        className="w-8 h-8 rounded-xl items-center justify-center shadow-2xs"
                        style={{ backgroundColor: `${tracker.color}18` }}
                    >
                        <TrendingUp size={16} color={tracker.color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        Trends & Momentum
                    </Text>
                </View>

                {/* Momentum Badge */}
                <View
                    className={cn(
                        "flex-row items-center gap-1 px-2.5 py-1 rounded-full",
                        trends.momentum === "High Momentum"
                            ? "bg-amber-50 border border-amber-100"
                            : trends.momentum === "Cooling Down"
                            ? "bg-gray-100"
                            : "bg-blue-50 border border-blue-100"
                    )}
                >
                    <Zap
                        size={11}
                        color={
                            trends.momentum === "High Momentum"
                                ? "#D97706"
                                : trends.momentum === "Cooling Down"
                                ? "#6B7280"
                                : tracker.color
                        }
                    />
                    <Text
                        className={cn(
                            "text-[10px] font-bold",
                            trends.momentum === "High Momentum"
                                ? "text-amber-700"
                                : trends.momentum === "Cooling Down"
                                ? "text-gray-600"
                                : "text-blue-700"
                        )}
                    >
                        {trends.momentum}
                    </Text>
                </View>
            </View>

            {/* 7-day and 30-day Averages Cards */}
            <View className="flex-row items-center gap-3 mb-3.5">
                {/* 7-Day Average */}
                <View className="flex-1 bg-gray-50/90 rounded-2xl p-3.5 border border-gray-100">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        7-Day Average
                    </Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                        <Text className="text-2xl font-black text-gray-950 tracking-tight">
                            {trends.avg7Days}
                        </Text>
                        <Text className="text-xs font-semibold text-gray-400 capitalize">
                            {tracker.unit.label}/day
                        </Text>
                    </View>
                    <Text className="text-[11px] text-gray-400 mt-1 font-medium">
                        Total {trends.thisWeekTotal} this week
                    </Text>
                </View>

                {/* 30-Day Average */}
                <View className="flex-1 bg-gray-50/90 rounded-2xl p-3.5 border border-gray-100">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        30-Day Average
                    </Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                        <Text className="text-2xl font-black text-gray-950 tracking-tight">
                            {trends.avg30Days}
                        </Text>
                        <Text className="text-xs font-semibold text-gray-400 capitalize">
                            {tracker.unit.label}/day
                        </Text>
                    </View>
                    <Text className="text-[11px] text-gray-400 mt-1 font-medium">
                        Baseline daily pace
                    </Text>
                </View>
            </View>

            {/* Week-over-Week Change Card */}
            <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
                <View className="flex-row items-center gap-2.5 flex-1">
                    <View
                        className={cn(
                            "w-8 h-8 rounded-xl items-center justify-center",
                            isPositiveChange
                                ? "bg-emerald-100"
                                : isNegativeChange
                                ? "bg-rose-100"
                                : "bg-gray-100"
                        )}
                    >
                        {isPositiveChange ? (
                            <ArrowUpRight size={16} color="#059669" strokeWidth={2.5} />
                        ) : isNegativeChange ? (
                            <ArrowDownRight size={16} color="#E11D48" strokeWidth={2.5} />
                        ) : (
                            <Activity size={15} color="#6B7280" />
                        )}
                    </View>
                    <View>
                        <Text className="text-xs font-bold text-gray-900">
                            Week-over-Week Change
                        </Text>
                        <Text className="text-[11px] text-gray-400 font-medium">
                            {trends.momentumDescription}
                        </Text>
                    </View>
                </View>

                <View
                    className={cn(
                        "px-2.5 py-1 rounded-full",
                        isPositiveChange
                            ? "bg-emerald-50 border border-emerald-100"
                            : isNegativeChange
                            ? "bg-rose-50 border border-rose-100"
                            : "bg-gray-100"
                    )}
                >
                    <Text
                        className={cn(
                            "text-xs font-black",
                            isPositiveChange
                                ? "text-emerald-700"
                                : isNegativeChange
                                ? "text-rose-700"
                                : "text-gray-600"
                        )}
                    >
                        {trends.weekOverWeekChange > 0
                            ? `+${trends.weekOverWeekChange}%`
                            : `${trends.weekOverWeekChange}%`}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default TrendsInsightsFeature;
