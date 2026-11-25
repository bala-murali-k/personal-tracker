import { TrackerIcon } from "@/components/pages/createtracker/core.create.tracker.component";
import { HeatmapNotesInsightsFeature } from "@/components/pages/insights/features/heatmap.insights.feature";
import { LifetimeInsightsFeature } from "@/components/pages/insights/features/lifetime.insights.feature";
import { PatternsInsightsFeature } from "@/components/pages/insights/features/patterns.insights.feature";
import { RecordsInsightsFeature } from "@/components/pages/insights/features/records.insights.feature";
import { ReminderInsightsFeature } from "@/components/pages/insights/features/reminder.insights.feature";
import { StreaksInsightsFeature } from "@/components/pages/insights/features/streaks.insights.feature";
import { TrendsInsightsFeature } from "@/components/pages/insights/features/trends.insights.feature";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useTrackerStorage } from "@/store/tracker.store";
import { Activity, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function CoreInsightsComponent() {
    const trackers = useTrackerStorage((s) => s.trackers);
    const entries = useTrackerStorage((s) => s.entries);

    const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(
        null
    );

    const activeTracker =
        trackers.find((t) => t.id === selectedTrackerId) ||
        trackers[0] ||
        null;

    const trackerEntries = activeTracker
        ? entries.filter((e) => e.trackerId === activeTracker.id)
        : [];

    if (trackers.length === 0) {
        return (
            <View className="flex-1 px-5 pt-2 items-center justify-center">
                <View className="w-16 h-16 rounded-3xl bg-blue-50 items-center justify-center mb-4">
                    <Activity size={28} color="#2563EB" />
                </View>
                <Text className="text-lg font-bold text-gray-900 text-center">
                    No Insights Yet
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-1.5 max-w-[260px] leading-relaxed">
                    Create your first tracker and start logging to unlock trends, streaks, heatmaps, and behavior patterns.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 px-5 pt-2">
            {/* Header */}
            <View className="mb-3">
                <Text className="text-2xl font-black text-gray-900 tracking-tight">
                    Insights
                </Text>
                <Text className="text-xs font-medium text-gray-500 mt-0.5">
                    Trends, records, patterns & behavior analytics
                </Text>
            </View>

            {/* Tracker Selector Chips */}
            <View className="mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingRight: 16 }}
                >
                    {trackers.map((t) => {
                        const isSelected = activeTracker?.id === t.id;
                        return (
                            <Pressable
                                key={t.id}
                                onPress={() => setSelectedTrackerId(t.id)}
                                accessibilityRole="button"
                                accessibilityLabel={`Select ${t.name} insights`}
                                className={cn(
                                    "flex-row items-center gap-2 px-3 py-2 rounded-2xl border transition-all",
                                    isSelected
                                        ? "bg-white border-gray-900 shadow-2xs"
                                        : "bg-white/80 border-gray-100"
                                )}
                            >
                                <View
                                    className="w-6 h-6 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: t.color }}
                                >
                                    <TrackerIcon
                                        icon={t.icon}
                                        size={13}
                                        color="#FFFFFF"
                                        fill="#FFFFFF"
                                        strokeWidth={2}
                                    />
                                </View>
                                <Text
                                    className={cn(
                                        "text-xs",
                                        isSelected
                                            ? "font-bold text-gray-950"
                                            : "font-semibold text-gray-600"
                                    )}
                                >
                                    {t.name}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Insights Dashboard Scrollable Content */}
            {activeTracker && (
                <ScrollView
                    className="w-full flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* 1. Trends: 7/30-day averages, WoW change, momentum */}
                    <TrendsInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />

                    {/* 2. Streaks & Goal Adherence: current & longest, weekly goal days */}
                    <StreaksInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />

                    {/* 3. Personal Records: best day, week, month */}
                    <RecordsInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />

                    {/* 4. Weekday Pattern & Time of Day */}
                    <PatternsInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />

                    {/* 5. Calendar Heatmap with Notes by Day */}
                    <HeatmapNotesInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />

                    {/* 6. Lifetime Stats & Correction Behavior (net vs gross, decrement rate) */}
                    <LifetimeInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />

                    {/* 7. Reminder Effect: first entry vs reminder.time */}
                    <ReminderInsightsFeature
                        tracker={activeTracker}
                        entries={trackerEntries}
                    />
                </ScrollView>
            )}
        </View>
    );
}
