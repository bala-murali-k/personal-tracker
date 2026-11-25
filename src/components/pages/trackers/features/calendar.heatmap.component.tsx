import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { localDay, totalForDay, type Entry } from "@/model/tracker.model";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Flame,
    Trophy,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

export interface CalendarHeatmapProps {
    trackerId: string;
    entries: Entry[];
    color: string;
    unitLabel: string;
    dailyGoal?: number;
    step?: number;
}

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function getIntensityLevel(total: number, goal?: number, step: number = 1): number {
    if (total <= 0) return 0;
    if (goal && goal > 0) {
        const ratio = total / goal;
        if (ratio >= 1.0) return 4;
        if (ratio >= 0.66) return 3;
        if (ratio >= 0.33) return 2;
        return 1;
    }
    if (total >= step * 4) return 4;
    if (total >= step * 3) return 3;
    if (total >= step * 2) return 2;
    return 1;
}

function getCellBg(level: number, color: string): string {
    switch (level) {
        case 4:
            return color;
        case 3:
            return `${color}B8`;
        case 2:
            return `${color}75`;
        case 1:
            return `${color}35`;
        default:
            return "#F3F4F6";
    }
}

export function CalendarHeatmapComponent({
    trackerId,
    entries,
    color,
    unitLabel,
    dailyGoal,
    step = 1,
}: CalendarHeatmapProps) {
    const todayStr = localDay();
    const [viewDate, setViewDate] = useState(() => new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

    const hasGoal = Boolean(dailyGoal && dailyGoal > 0);
    const targetGoal = dailyGoal ?? 0;

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthName = viewDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const prevMonth = () => {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    // Calculate all calendar grid days
    const calendarDays = useMemo(() => {
        const firstDayDate = new Date(year, month, 1);
        const lastDayDate = new Date(year, month + 1, 0);
        const numDays = lastDayDate.getDate();

        const firstDayOfWeek = firstDayDate.getDay();
        // Monday-first offset (0 for Mon, 6 for Sun)
        const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const prevMonthLastDate = new Date(year, month, 0).getDate();
        const prevPadding: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
        for (let i = startOffset - 1; i >= 0; i--) {
            const d = prevMonthLastDate - i;
            const pMonth = month === 0 ? 11 : month - 1;
            const pYear = month === 0 ? year - 1 : year;
            const dateStr = `${pYear}-${String(pMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            prevPadding.push({ day: d, isCurrentMonth: false, dateStr });
        }

        const currentDays: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
        for (let d = 1; d <= numDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            currentDays.push({ day: d, isCurrentMonth: true, dateStr });
        }

        const totalFilled = prevPadding.length + currentDays.length;
        const remaining = totalFilled % 7 === 0 ? 0 : 7 - (totalFilled % 7);
        const nextPadding: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
        for (let d = 1; d <= remaining; d++) {
            const nMonth = month === 11 ? 0 : month + 1;
            const nYear = month === 11 ? year + 1 : year;
            const dateStr = `${nYear}-${String(nMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            nextPadding.push({ day: d, isCurrentMonth: false, dateStr });
        }

        return [...prevPadding, ...currentDays, ...nextPadding];
    }, [year, month]);

    // Monthly summary stats
    const monthStats = useMemo(() => {
        let activeDays = 0;
        let totalAmount = 0;
        let goalMetDays = 0;

        const daysInCurrentMonth = calendarDays.filter((d) => d.isCurrentMonth);
        for (const d of daysInCurrentMonth) {
            const total = totalForDay(entries, trackerId, d.dateStr);
            if (total > 0) {
                activeDays += 1;
                totalAmount += total;
                if (dailyGoal && dailyGoal > 0 && total >= dailyGoal) {
                    goalMetDays += 1;
                }
            }
        }

        return {
            activeDays,
            totalAmount,
            goalMetDays,
        };
    }, [calendarDays, entries, trackerId, dailyGoal]);

    // Selected day total
    const selectedTotal = useMemo(() => {
        return totalForDay(entries, trackerId, selectedDateStr);
    }, [entries, trackerId, selectedDateStr]);

    const formattedSelectedDate = useMemo(() => {
        const [y, m, d] = selectedDateStr.split("-").map(Number);
        if (!y || !m || !d) return selectedDateStr;
        const dateObj = new Date(y, m - 1, d);
        return dateObj.toLocaleDateString("default", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }, [selectedDateStr]);

    return (
        <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
            {/* Header: Title & Month Picker */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                    <View
                        className="w-7 h-7 rounded-lg items-center justify-center"
                        style={{ backgroundColor: `${color}18` }}
                    >
                        <CalendarIcon size={15} color={color} />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                        {monthName}
                    </Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                    <Pressable
                        onPress={prevMonth}
                        accessibilityRole="button"
                        accessibilityLabel="Previous month"
                        className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                        hitSlop={6}
                    >
                        <ChevronLeft size={16} color="#374151" />
                    </Pressable>
                    <Pressable
                        onPress={nextMonth}
                        accessibilityRole="button"
                        accessibilityLabel="Next month"
                        className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                        hitSlop={6}
                    >
                        <ChevronRight size={16} color="#374151" />
                    </Pressable>
                </View>
            </View>

            {/* Quick Monthly Stats Pills */}
            <View className="flex-row items-center justify-between bg-gray-50/80 rounded-2xl p-3 mb-4 border border-gray-100">
                <View className="items-center flex-1">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Active Days
                    </Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                        <Flame size={12} color="#F59E0B" />
                        <Text className="text-sm font-black text-gray-900">
                            {monthStats.activeDays}
                        </Text>
                    </View>
                </View>

                <View className="w-[1px] h-6 bg-gray-200" />

                <View className="items-center flex-1">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Month Total
                    </Text>
                    <Text className="text-sm font-black text-gray-900 mt-0.5">
                        {monthStats.totalAmount}
                    </Text>
                </View>

                {Boolean(dailyGoal && dailyGoal > 0) && (
                    <>
                        <View className="w-[1px] h-6 bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Goals Met
                            </Text>
                            <View className="flex-row items-center gap-1 mt-0.5">
                                <Trophy size={11} color={color} />
                                <Text className="text-sm font-black text-gray-900">
                                    {monthStats.goalMetDays}
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Weekday Labels (Mon - Sun) */}
            <View className="flex-row justify-between mb-2">
                {WEEK_DAYS.map((dayLabel, index) => (
                    <Text
                        key={index}
                        className="text-center font-bold text-[11px] text-gray-400"
                        style={{ width: "13.2%" }}
                    >
                        {dayLabel}
                    </Text>
                ))}
            </View>

            {/* Heat Map Calendar Grid */}
            <View className="flex-row flex-wrap justify-between">
                {calendarDays.map((item) => {
                    const dayTotal = totalForDay(entries, trackerId, item.dateStr);
                    const level = getIntensityLevel(dayTotal, dailyGoal, step);
                    const isToday = item.dateStr === todayStr;
                    const isSelected = item.dateStr === selectedDateStr;
                    const cellBg = getCellBg(level, color);

                    return (
                        <Pressable
                            key={item.dateStr}
                            onPress={() => setSelectedDateStr(item.dateStr)}
                            accessibilityRole="button"
                            accessibilityLabel={`${item.dateStr}, ${dayTotal} ${unitLabel}`}
                            style={{
                                width: "13.2%",
                                aspectRatio: 1,
                                backgroundColor: cellBg,
                            }}
                            className={cn(
                                "rounded-xl items-center justify-center my-1 relative transition-all",
                                !item.isCurrentMonth && "opacity-25",
                                isSelected && "border-2 border-gray-900"
                            )}
                        >
                            <Text
                                className={cn(
                                    "text-xs",
                                    level >= 2
                                        ? "text-white font-bold"
                                        : level === 1
                                        ? "text-gray-800 font-bold"
                                        : "text-gray-400 font-medium"
                                )}
                            >
                                {item.day}
                            </Text>

                            {/* Today Indicator Dot */}
                            {isToday && (
                                <View
                                    className={cn(
                                        "w-1 h-1 rounded-full absolute bottom-1",
                                        level >= 2 ? "bg-white" : "bg-blue-600"
                                    )}
                                />
                            )}
                        </Pressable>
                    );
                })}
            </View>

            {/* Selected Date Detail Banner */}
            <View className="mt-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                    <Text className="text-xs font-bold text-gray-900">
                        {formattedSelectedDate}
                        {selectedDateStr === todayStr ? " (Today)" : ""}
                    </Text>
                    <Text className="text-[11px] text-gray-500 mt-0.5">
                        {selectedTotal > 0
                            ? `${selectedTotal} ${unitLabel} logged`
                            : "No activity logged"}
                    </Text>
                </View>

                {hasGoal && (
                    <View
                        className="px-2.5 py-1 rounded-full"
                        style={{
                            backgroundColor:
                                selectedTotal >= targetGoal
                                    ? `${color}20`
                                    : "#E5E7EB",
                        }}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{
                                color:
                                    selectedTotal >= targetGoal
                                        ? color
                                        : "#6B7280",
                            }}
                        >
                            {selectedTotal >= targetGoal
                                ? "Goal Met 🎉"
                                : `${Math.round(
                                      (selectedTotal / targetGoal) * 100
                                  )}%`}
                        </Text>
                    </View>
                )}
            </View>

            {/* Heat Map Intensity Legend */}
            <View className="flex-row items-center justify-end gap-1.5 mt-3 pt-2">
                <Text className="text-[10px] font-semibold text-gray-400 mr-1">
                    Less
                </Text>
                <View className="w-3.5 h-3.5 rounded-sm bg-gray-100" />
                <View
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ backgroundColor: `${color}35` }}
                />
                <View
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ backgroundColor: `${color}75` }}
                />
                <View
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ backgroundColor: `${color}B8` }}
                />
                <View
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ backgroundColor: color }}
                />
                <Text className="text-[10px] font-semibold text-gray-400 ml-1">
                    More
                </Text>
            </View>
        </View>
    );
}

export default CalendarHeatmapComponent;
