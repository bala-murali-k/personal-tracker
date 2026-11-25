import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { type Goals, type WeekDays } from "@/model/tracker.model";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";

export interface StepthreeCreateSetupProps {
    goals: Goals;
    changeGoals: (goal: Goals) => void;
    unitLabel?: string;
    color?: string;
}

const PRESET_AMOUNTS = [1, 3, 5, 8, 10, 15];

const WEEK_DAYS: { key: WeekDays; label: string }[] = [
    { key: "Monday", label: "M" },
    { key: "Tuesday", label: "T" },
    { key: "Wednesday", label: "W" },
    { key: "Thursday", label: "T" },
    { key: "Friday", label: "F" },
    { key: "Saturday", label: "S" },
    { key: "Sunday", label: "S" },
];

export default function StepthreeCreateSetupComponent({
    goals,
    changeGoals,
    unitLabel = "times",
    color = "#2563EB",
}: StepthreeCreateSetupProps) {
    const dailyTarget = goals.daily ?? 0;
    const activeDays = goals.weeklyActiveDays ?? [];
    const activeCount = activeDays.length;
    const restCount = Math.max(0, 7 - activeCount);
    const weeklyTotal = dailyTarget * activeCount;

    const handleDailyChange = (val: number) => {
        const nextDaily = Math.max(0, val);
        const nextDays =
            activeDays.length > 0
                ? activeDays
                : WEEK_DAYS.map((d) => d.key);

        changeGoals({
            ...goals,
            enabled: true,
            daily: nextDaily,
            weeklyActiveDays: nextDays,
            weekly: nextDaily * nextDays.length,
        });
    };

    const handleToggleDay = (day: WeekDays) => {
        const isSelected = activeDays.includes(day);
        const nextDays = isSelected
            ? activeDays.filter((d) => d !== day)
            : [...activeDays, day];

        changeGoals({
            ...goals,
            enabled: true,
            weeklyActiveDays: nextDays,
            weekly: dailyTarget * nextDays.length,
        });
    };

    return (
        <ScrollView
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Minimal Header */}
            <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900">
                    Goal & Schedule
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                    Set your daily target and select your active days.
                </Text>
            </View>

            {/* Clean Hero Card */}
            <View
                className="bg-white rounded-3xl p-6 border border-gray-100 items-center"
                style={{
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                }}
            >
                {/* Hero Stepper Section */}
                <View className="items-center w-full py-2">
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Daily Target
                    </Text>

                    <View className="flex-row items-center justify-center gap-6 w-full">
                        <Pressable
                            onPress={() => handleDailyChange(dailyTarget - 1)}
                            disabled={dailyTarget <= 0}
                            accessibilityRole="button"
                            accessibilityLabel="Decrease goal"
                            className={cn(
                                "w-13 h-13 rounded-full items-center justify-center bg-gray-100 border border-gray-200 active:scale-95 transition-all",
                                dailyTarget <= 0 ? "opacity-30" : ""
                            )}
                        >
                            <Minus size={20} color="#374151" strokeWidth={2.5} />
                        </Pressable>

                        <View className="items-center justify-center min-w-[100px]">
                            <TextInput
                                value={String(dailyTarget)}
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/[^0-9]/g, "");
                                    handleDailyChange(
                                        cleaned === "" ? 0 : parseInt(cleaned, 10)
                                    );
                                }}
                                keyboardType="number-pad"
                                maxLength={5}
                                style={Platform.select({
                                    web: { outlineStyle: "none" } as any,
                                })}
                                className="text-5xl font-black text-gray-900 text-center tracking-tight outline-none"
                            />
                            <Text className="text-sm font-semibold text-gray-400 capitalize mt-1">
                                {unitLabel} / day
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => handleDailyChange(dailyTarget + 1)}
                            accessibilityRole="button"
                            accessibilityLabel="Increase goal"
                            className="w-13 h-13 rounded-full items-center justify-center active:scale-95 shadow-sm transition-all"
                            style={{ backgroundColor: color }}
                        >
                            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
                        </Pressable>
                    </View>

                    {/* Minimal Quick Preset Chips */}
                    <View className="flex-row flex-wrap items-center justify-center gap-2 mt-5">
                        {PRESET_AMOUNTS.map((amt) => {
                            const isSelected = dailyTarget === amt;
                            return (
                                <Pressable
                                    key={amt}
                                    onPress={() => handleDailyChange(amt)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Set to ${amt}`}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-full border transition-all active:scale-95",
                                        isSelected
                                            ? "shadow-2xs"
                                            : "bg-gray-50 border-gray-200/70 active:bg-gray-100"
                                    )}
                                    style={{
                                        borderColor: isSelected ? color : undefined,
                                        backgroundColor: isSelected
                                            ? `${color}15`
                                            : undefined,
                                    }}
                                >
                                    <Text
                                        className={cn(
                                            "text-xs font-bold",
                                            isSelected ? "" : "text-gray-600"
                                        )}
                                        style={{
                                            color: isSelected ? color : undefined,
                                        }}
                                    >
                                        {amt}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Subtle Divider */}
                <View className="h-px w-full bg-gray-100 my-6" />

                {/* Day Selection Row */}
                <View className="w-full items-center">
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Active Days
                    </Text>

                    <View className="flex-row justify-between w-full gap-2">
                        {WEEK_DAYS.map((day) => {
                            const isSelected = activeDays.includes(day.key);
                            return (
                                <Pressable
                                    key={day.key}
                                    onPress={() => handleToggleDay(day.key)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Toggle ${day.key}`}
                                    className={cn(
                                        "flex-1 aspect-square rounded-full items-center justify-center transition-all active:scale-95 border",
                                        isSelected
                                            ? "shadow-2xs"
                                            : "bg-gray-100/90 border-transparent active:bg-gray-200"
                                    )}
                                    style={{
                                        backgroundColor: isSelected ? color : undefined,
                                        borderColor: isSelected ? color : undefined,
                                    }}
                                >
                                    <Text
                                        className={cn(
                                            "text-sm font-extrabold",
                                            isSelected ? "text-white" : "text-gray-600"
                                        )}
                                    >
                                        {day.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Modern Pill Summary Banner */}
                <View className="mt-6 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-100 flex-row items-center justify-center gap-2">
                    <Text className="text-xs font-semibold text-gray-600">
                        {activeCount} active {activeCount === 1 ? "day" : "days"}
                    </Text>
                    <Text className="text-xs text-gray-300">•</Text>
                    <Text className="text-xs font-semibold text-gray-400">
                        {restCount} rest
                    </Text>
                    <Text className="text-xs text-gray-300">•</Text>
                    <Text
                        className="text-xs font-bold"
                        style={{ color }}
                    >
                        ≈ {weeklyTotal} {unitLabel}/wk
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
