import {
    MAX_TITLE_LENGTH,
    PRESET_COLORS,
    PRESET_ICONS,
    PRESET_ICONS_MAP,
    type PresetColors,
    type PresetIcons,
} from "@/components/pages/createtracker/core.create.tracker.component";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Check, PenLine, X } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";

export interface SteponeCreateSetupProps {
    trackerName: string;
    color: PresetColors;
    icon: PresetIcons;
    changeTrackerName: (state: string) => void;
    changeColor: (state: PresetColors) => void;
    changeIcon: (state: PresetIcons) => void;
}

export default function SteponeCreateSetupComponent({
    trackerName,
    color,
    icon,
    changeTrackerName,
    changeColor,
    changeIcon,
}: SteponeCreateSetupProps) {
    const selectedIcon = icon || PRESET_ICONS[0];
    const selectedColor = color || PRESET_COLORS[0];
    const [isFocused, setIsFocused] = useState(false);

    return (
        <ScrollView
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Form Title & Subtitle */}
            <View className="mb-6">
                <Text className="text-xs text-gray-500 mt-1">
                    Set a name, icon, and theme color for your new tracker.
                </Text>
            </View>

            {/* Tracker Name Input - Modern Textbox with Even Focus */}
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm font-semibold text-gray-700">
                        Tracker Name
                    </Text>
                    {trackerName.length > 0 && (
                        <Text className="text-xs text-gray-400">
                            {trackerName.length}/{MAX_TITLE_LENGTH}
                        </Text>
                    )}
                </View>

                <View
                    className={cn(
                        "w-full h-14 px-4 flex-row items-center rounded-2xl transition-all",
                        isFocused ? "bg-white" : "bg-gray-50/80"
                    )}
                    style={{
                        borderWidth: 2,
                        borderColor: isFocused ? selectedColor : "#E5E7EB",
                        elevation: isFocused ? 2 : 0,
                        shadowColor: selectedColor,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: isFocused ? 0.18 : 0,
                        shadowRadius: 6,
                    }}
                >
                    <View className="mr-3">
                        <PenLine
                            size={18}
                            color={isFocused ? selectedColor : "#9CA3AF"}
                        />
                    </View>
                    <TextInput
                        value={trackerName}
                        onChangeText={changeTrackerName}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="e.g., Daily Water, Reading, Push-ups..."
                        placeholderTextColor="#9CA3AF"
                        maxLength={MAX_TITLE_LENGTH}
                        style={Platform.select({
                            web: { outlineStyle: "none" } as any,
                        })}
                        className="flex-1 h-full text-base font-medium text-gray-900 outline-none"
                    />
                    {trackerName.length > 0 && (
                        <Pressable
                            onPress={() => changeTrackerName("")}
                            hitSlop={8}
                            className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center active:opacity-70 ml-2"
                        >
                            <X size={12} color="#6B7280" />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Icon Selection - Filled Lucide Icons */}
            <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Choose Icon
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                    {PRESET_ICONS.map((item) => {
                        const isSelected = selectedIcon === item;
                        const IconComp = PRESET_ICONS_MAP[item];
                        if (!IconComp) return null;

                        return (
                            <Pressable
                                key={item}
                                onPress={() => changeIcon(item)}
                                accessibilityRole="button"
                                accessibilityLabel={`Select icon ${item}`}
                                className={cn(
                                    "w-12 h-12 rounded-2xl items-center justify-center transition-all",
                                    isSelected
                                        ? "bg-blue-50/70"
                                        : "bg-gray-50/80 active:bg-gray-100"
                                )}
                                style={{
                                    borderWidth: 2,
                                    borderColor: isSelected
                                        ? selectedColor
                                        : "#E5E7EB",
                                }}
                            >
                                <IconComp
                                    size={22}
                                    color={isSelected ? selectedColor : "#64748B"}
                                    fill={isSelected ? selectedColor : "#CBD5E1"}
                                    strokeWidth={2}
                                />
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Color Selection */}
            <View className="mb-8">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Theme Color
                </Text>
                <View className="flex-row flex-wrap gap-3">
                    {PRESET_COLORS.map((item) => {
                        const isSelected =
                            selectedColor.toLowerCase() === item.toLowerCase();
                        return (
                            <Pressable
                                key={item}
                                onPress={() => changeColor(item)}
                                accessibilityRole="button"
                                accessibilityLabel={`Select color ${item}`}
                                className="w-11 h-11 rounded-full items-center justify-center active:scale-95"
                                style={{
                                    backgroundColor: item,
                                    borderWidth: isSelected ? 3 : 0,
                                    borderColor: "#FFFFFF",
                                    elevation: isSelected ? 3 : 0,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: isSelected ? 0.25 : 0,
                                    shadowRadius: 4,
                                }}
                            >
                                {isSelected && (
                                    <Check
                                        size={18}
                                        color="#FFFFFF"
                                        strokeWidth={3}
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}
