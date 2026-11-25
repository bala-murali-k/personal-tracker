import {
    TrackerIcon,
    type PresetColors,
    type PresetIcons,
} from "@/components/pages/createtracker/core.create.tracker.component";
import { Text } from "@/components/ui/text";
import type { Tracker } from "@/model/tracker.model";
import { View } from "react-native";

export interface PreviewCreateSetupProps {
    currentStep?: number;
    tracker?: Partial<Tracker>;
    name?: string;
    icon?: PresetIcons | string;
    color?: PresetColors;
    unitLabel?: string;
    step?: number;
    goal?: number;
}

export default function PreviewCreateSetupComponent({
    currentStep,
    tracker,
    name: propName,
    icon: propIcon,
    color: propColor,
    unitLabel: propUnitLabel,
    step: propStep,
    goal: propGoal,
}: PreviewCreateSetupProps) {
    const name = tracker?.name || propName || "Tracker Name";
    const icon = tracker?.icon || propIcon || "Target";
    const color = tracker?.color || propColor || "#2563EB";
    const unitLabel = tracker?.unit?.label || propUnitLabel || "Pages";
    const step = tracker?.unit?.step || propStep || 1;
    const goal = tracker?.features?.goals?.daily || propGoal || 8;

    return (
        <View className="w-full px-6 py-6 items-center justify-center">
            {/* Tracker Preview Card */}
            <View
                className="w-full max-w-sm bg-white rounded-3xl p-5 border border-gray-100"
                style={{
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                }}
            >
                {/* Header: Icon, Name, Category */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View
                            className="w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
                            style={{ backgroundColor: `${color}` }}
                        >
                            <TrackerIcon
                                icon={icon}
                                size={24}
                                color="#FFFFFF"
                                fill="#FFFFFF"
                            />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-900">
                                {name || "Tracker Name"}
                            </Text>
                            <Text className="text-xs text-gray-500 capitalize">
                                Counting {unitLabel}
                            </Text>
                        </View>
                    </View>

                    <View className="px-2.5 py-1 rounded-full bg-gray-100">
                        <Text className="text-xs font-medium text-gray-600">
                            Today
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
