import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useTrackerStorage } from "@/store/tracker.store";
import {
    Bell,
    Calendar,
    ChevronRight,
    Download,
    FileText,
    HardDrive,
    Heart,
    HelpCircle,
    Info,
    Palette,
    Shield,
    Sparkles,
    Star,
    Trash2,
    Vibrate,
    Volume2,
    type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, View } from "react-native";

interface SettingItemProps {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    label: string;
    subtitle?: string;
    valueText?: string;
    isSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (val: boolean) => void;
    onPress?: () => void;
    isDestructive?: boolean;
    isLast?: boolean;
}

function SettingItem({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    subtitle,
    valueText,
    isSwitch,
    switchValue,
    onSwitchChange,
    onPress,
    isDestructive,
    isLast,
}: SettingItemProps) {
    return (
        <Pressable
            onPress={isSwitch ? undefined : onPress}
            disabled={isSwitch}
            accessibilityRole={isSwitch ? "switch" : "button"}
            accessibilityLabel={label}
            className={cn(
                "w-full flex-row items-center justify-between py-3.5 px-4 active:bg-gray-50/80 transition-colors",
                !isLast && "border-b border-gray-50"
            )}
        >
            <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center shadow-2xs"
                    style={{ backgroundColor: iconBg }}
                >
                    <Icon size={18} color={iconColor} strokeWidth={2.2} />
                </View>
                <View className="flex-1">
                    <Text
                        className={cn(
                            "text-sm font-semibold",
                            isDestructive ? "text-red-600" : "text-gray-900"
                        )}
                    >
                        {label}
                    </Text>
                    {subtitle && (
                        <Text className="text-[11px] text-gray-400 mt-0.5 font-medium">
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            <View className="flex-row items-center gap-1">
                {isSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
                        thumbColor="#FFFFFF"
                    />
                ) : (
                    <>
                        {valueText && (
                            <Text className="text-xs font-semibold text-gray-400 mr-1">
                                {valueText}
                            </Text>
                        )}
                        <ChevronRight size={16} color="#9CA3AF" />
                    </>
                )}
            </View>
        </Pressable>
    );
}

export default function CoreSettingsComponent() {
    const trackers = useTrackerStorage((s) => s.trackers);
    const entries = useTrackerStorage((s) => s.entries);

    // Standard toggles and preferences
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [appearanceMode, setAppearanceMode] = useState<
        "System" | "Light" | "Dark"
    >("System");
    const [startWeekDay, setStartWeekDay] = useState<"Monday" | "Sunday">(
        "Monday"
    );

    const toggleAppearance = () => {
        setAppearanceMode((prev) => {
            if (prev === "System") return "Light";
            if (prev === "Light") return "Dark";
            return "System";
        });
    };

    const toggleStartWeek = () => {
        setStartWeekDay((prev) => (prev === "Monday" ? "Sunday" : "Monday"));
    };

    const handleExportData = () => {
        const payload = JSON.stringify({ trackers, entries }, null, 2);
        Alert.alert(
            "Export Data",
            `Backup generated with ${trackers.length} tracker(s) and ${entries.length} log entry(ies). Ready for export.`,
            [{ text: "OK" }]
        );
        console.log("Exported tracker backup payload:", payload.length, "bytes");
    };

    const handleClearData = () => {
        Alert.alert(
            "Reset All Data?",
            "This will delete all your trackers and logged entries permanently. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset Everything",
                    style: "destructive",
                    onPress: () => {
                        useTrackerStorage.setState({
                            trackers: [],
                            entries: [],
                        });
                        Alert.alert(
                            "Data Cleared",
                            "All trackers and entries have been reset."
                        );
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 px-5 pt-2">
            {/* Header */}
            <View className="mb-4">
                <Text className="text-2xl font-black text-gray-900 tracking-tight">
                    Settings
                </Text>
                <Text className="text-xs font-medium text-gray-500 mt-0.5">
                    Preferences, storage & app information
                </Text>
            </View>

            <ScrollView
                className="w-full flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 36 }}
            >
                {/* Account & Storage Overview Card */}
                <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
                    <View className="flex-row items-center gap-3.5">
                        <View className="w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center shadow-xs">
                            <Sparkles size={24} color="#FFFFFF" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-gray-900">
                                Tracker Workspace
                            </Text>
                            <Text className="text-xs text-gray-400 mt-0.5 font-medium">
                                Local Storage • 100% Private & Offline
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <View className="items-center flex-1">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Trackers
                            </Text>
                            <Text className="text-lg font-black text-gray-900 mt-0.5">
                                {trackers.length}
                            </Text>
                        </View>
                        <View className="w-[1px] h-6 bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Total Logs
                            </Text>
                            <Text className="text-lg font-black text-gray-900 mt-0.5">
                                {entries.length}
                            </Text>
                        </View>
                        <View className="w-[1px] h-6 bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Sync Status
                            </Text>
                            <Text className="text-xs font-bold text-emerald-600 mt-1">
                                Saved
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Section 1: Preferences */}
                <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
                    Preferences
                </Text>
                <View className="w-full bg-white rounded-3xl mb-5 border border-gray-100 overflow-hidden shadow-2xs">
                    <SettingItem
                        icon={Palette}
                        iconBg="#EEF2FF"
                        iconColor="#4F46E5"
                        label="Appearance"
                        subtitle="Theme mode for the app"
                        valueText={appearanceMode}
                        onPress={toggleAppearance}
                    />

                    <SettingItem
                        icon={Calendar}
                        iconBg="#ECFDF5"
                        iconColor="#059669"
                        label="Start Week On"
                        subtitle="First day shown on calendar grids"
                        valueText={startWeekDay}
                        onPress={toggleStartWeek}
                    />

                    <SettingItem
                        icon={Vibrate}
                        iconBg="#FEF3C7"
                        iconColor="#D97706"
                        label="Haptic Feedback"
                        subtitle="Tactile feedback on logging actions"
                        isSwitch
                        switchValue={hapticsEnabled}
                        onSwitchChange={setHapticsEnabled}
                    />

                    <SettingItem
                        icon={Volume2}
                        iconBg="#F3E8FF"
                        iconColor="#9333EA"
                        label="Sound Effects"
                        subtitle="Audio cues on goal completion"
                        isSwitch
                        switchValue={soundEnabled}
                        onSwitchChange={setSoundEnabled}
                    />

                    <SettingItem
                        icon={Bell}
                        iconBg="#FDF2F8"
                        iconColor="#DB2777"
                        label="Push Reminders"
                        subtitle="Allow reminders for habit schedules"
                        isSwitch
                        switchValue={notificationsEnabled}
                        onSwitchChange={setNotificationsEnabled}
                        isLast
                    />
                </View>

                {/* Section 2: Data Management */}
                <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
                    Data Management
                </Text>
                <View className="w-full bg-white rounded-3xl mb-5 border border-gray-100 overflow-hidden shadow-2xs">
                    <SettingItem
                        icon={Download}
                        iconBg="#EFF6FF"
                        iconColor="#2563EB"
                        label="Export Data"
                        subtitle="Create a backup file of trackers & logs"
                        onPress={handleExportData}
                    />

                    <SettingItem
                        icon={HardDrive}
                        iconBg="#F1F5F9"
                        iconColor="#475569"
                        label="Storage Usage"
                        subtitle={`${trackers.length} trackers, ${entries.length} log entries`}
                        valueText="Local Cache"
                    />

                    <SettingItem
                        icon={Trash2}
                        iconBg="#FEF2F2"
                        iconColor="#DC2626"
                        label="Clear All Data"
                        subtitle="Permanently delete all trackers and logs"
                        isDestructive
                        onPress={handleClearData}
                        isLast
                    />
                </View>

                {/* Section 3: Support & About */}
                <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
                    Support & About
                </Text>
                <View className="w-full bg-white rounded-3xl mb-5 border border-gray-100 overflow-hidden shadow-2xs">
                    <SettingItem
                        icon={HelpCircle}
                        iconBg="#F0FDF4"
                        iconColor="#16A34A"
                        label="Help & FAQ"
                        subtitle="Tips on getting the most from trackers"
                        onPress={() =>
                            Alert.alert(
                                "Help & FAQ",
                                "Tap '+' in the bottom tab to create habits, goals, and count-based trackers. Tap cards to see heat maps and full stats."
                            )
                        }
                    />

                    <SettingItem
                        icon={Star}
                        iconBg="#FFFBEB"
                        iconColor="#F59E0B"
                        label="Rate Tracker"
                        subtitle="Share your love on the store"
                        onPress={() =>
                            Alert.alert(
                                "Thank You!",
                                "Thank you for using Tracker! Your feedback helps us build a better experience."
                            )
                        }
                    />

                    <SettingItem
                        icon={Shield}
                        iconBg="#F8FAFC"
                        iconColor="#64748B"
                        label="Privacy Policy"
                        subtitle="Your habits never leave this device"
                        onPress={() =>
                            Alert.alert(
                                "Privacy Guarantee",
                                "Tracker is offline-first. No accounts, tracking, or cloud telemetries are transmitted."
                            )
                        }
                    />

                    <SettingItem
                        icon={FileText}
                        iconBg="#F8FAFC"
                        iconColor="#64748B"
                        label="Terms of Service"
                        onPress={() =>
                            Alert.alert(
                                "Terms",
                                "Standard open-source personal use license."
                            )
                        }
                    />

                    <SettingItem
                        icon={Info}
                        iconBg="#F1F5F9"
                        iconColor="#334155"
                        label="Version"
                        valueText="1.0.0 (Build 42)"
                        isLast
                    />
                </View>

                {/* Footer Brand Note */}
                <View className="items-center py-4">
                    <View className="flex-row items-center gap-1.5">
                        <Text className="text-xs text-gray-400 font-medium">
                            Designed with
                        </Text>
                        <Heart size={12} color="#EF4444" fill="#EF4444" />
                        <Text className="text-xs text-gray-400 font-medium">
                            for mindful habits
                        </Text>
                    </View>
                    <Text className="text-[11px] text-gray-300 font-semibold mt-1">
                        Tracker App • 2026
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}