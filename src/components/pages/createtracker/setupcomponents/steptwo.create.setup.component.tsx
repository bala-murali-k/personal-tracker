import {
    PRESET_UNITS,
    type PreSetUnits,
} from "@/components/pages/createtracker/core.create.tracker.component";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Check, Tag } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";

export interface SteptwoCreateSetupProps {
    unit: PreSetUnits;
    isCustomUnit: boolean;
    customUnit: string;
    changeUnit: (unit: PreSetUnits) => void;
    changeCustomUnit: (unit: string) => void;
    color?: string;
}

export default function SteptwoCreateSetupComponent({
    unit,
    isCustomUnit,
    customUnit,
    changeUnit,
    changeCustomUnit,
    color = "#2563EB",
}: SteptwoCreateSetupProps) {
    
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <ScrollView
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header / Intro */}
            <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900">
                    Unit of Measurement
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                    Select what you count each time you log this tracker.
                </Text>
            </View>

            {/* Chip Selector */}
            <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                    Choose Unit
                </Text>

                <View className="flex-row flex-wrap gap-2.5">
                    {PRESET_UNITS.map((preset) => {
                        const isSelected = unit.label === preset.label;
                        return (
                            <Pressable
                                key={preset.label}
                                onPress={() => changeUnit(preset)}
                                accessibilityRole="button"
                                accessibilityLabel={`Select unit ${preset.label}`}
                                className={cn(
                                    "flex-row items-center gap-1.5 px-4 py-2.5 rounded-full transition-all active:scale-95",
                                    isSelected
                                        ? "shadow-sm"
                                        : "bg-gray-100/90 border border-gray-200/80 active:bg-gray-200"
                                )}
                                style={{
                                    backgroundColor: isSelected ? color : undefined,
                                    borderColor: isSelected ? color : undefined,
                                }}
                            >
                                {isSelected && (
                                    <Check
                                        size={14}
                                        color="#FFFFFF"
                                        strokeWidth={2.5}
                                    />
                                )}
                                <Text
                                    className={cn(
                                        "text-sm font-medium capitalize",
                                        isSelected
                                            ? "text-white font-semibold"
                                            : "text-gray-700"
                                    )}
                                >
                                    {preset.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Custom Unit Input (shown when "Custom" is selected) */}
            {isCustomUnit && (
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Custom Unit Name
                    </Text>

                    <View
                        className={cn(
                            "w-full h-14 px-4 flex-row items-center rounded-2xl transition-all",
                            isFocused ? "bg-white" : "bg-gray-50/80"
                        )}
                        style={{
                            borderWidth: 2,
                            borderColor: isFocused ? color : "#E5E7EB",
                            elevation: isFocused ? 2 : 0,
                            shadowColor: color,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: isFocused ? 0.18 : 0,
                            shadowRadius: 6,
                        }}
                    >
                        <View className="mr-3">
                            <Tag
                                size={18}
                                color={isFocused ? color : "#9CA3AF"}
                            />
                        </View>
                        <TextInput
                            value={customUnit}
                            onChangeText={changeCustomUnit}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="e.g., chapters, pushups, pomodoros..."
                            placeholderTextColor="#9CA3AF"
                            maxLength={20}
                            style={Platform.select({
                                web: { outlineStyle: "none" } as any,
                            })}
                            className="flex-1 h-full text-base font-medium text-gray-900 outline-none"
                        />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}
