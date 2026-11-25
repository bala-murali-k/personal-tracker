import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { localDay, totalForDay, type Entry, type Tracker } from "@/model/tracker.model";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    FileText,
    MessageSquare,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

export interface HeatmapNotesFeatureProps {
    tracker: Tracker;
    entries: Entry[];
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

export function HeatmapNotesInsightsFeature({
    tracker,
    entries,
}: HeatmapNotesFeatureProps) {
    const todayStr = localDay();
    const [viewDate, setViewDate] = useState(() => new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dailyGoal = tracker.features.goals?.daily ?? 0;
    const hasGoal = dailyGoal > 0;
    const color = tracker.color;

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

    // Calculate grid
    const calendarDays = useMemo(() => {
        const firstDayDate = new Date(year, month, 1);
        const lastDayDate = new Date(year, month + 1, 0);
        const numDays = lastDayDate.getDate();

        const firstDayOfWeek = firstDayDate.getDay();
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

    // Check which days have notes
    const daysWithNotes = useMemo(() => {
        const set = new Set<string>();
        for (const e of entries) {
            if (e.note && e.note.trim().length > 0) {
                set.add(e.day);
            }
        }
        return set;
    }, [entries]);

    // Entries and notes for the selected date
    const selectedDateEntries = useMemo(() => {
        return entries.filter((e) => e.day === selectedDateStr);
    }, [entries, selectedDateStr]);

    const selectedTotal = useMemo(() => {
        return totalForDay(entries, tracker.id, selectedDateStr);
    }, [entries, tracker.id, selectedDateStr]);

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

    const notesForSelectedDay = useMemo(() => {
        return selectedDateEntries.filter((e) => Boolean(e.note && e.note.trim().length > 0));
    }, [selectedDateEntries]);

    return (
        <View className="w-full bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-2xs">
            {/* Header: Title & Month Switcher */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2.5">
                    <View
                        className="w-8 h-8 rounded-xl items-center justify-center shadow-2xs"
                        style={{ backgroundColor: `${color}18` }}
                    >
                        <CalendarIcon size={16} color={color} />
                    </View>
                    <View>
                        <Text className="text-base font-bold text-gray-900">
                            Calendar Heatmap
                        </Text>
                        <Text className="text-[11px] font-semibold text-gray-400">
                            {monthName} • Daily notes & logs
                        </Text>
                    </View>
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
                    const dayTotal = totalForDay(entries, tracker.id, item.dateStr);
                    const level = getIntensityLevel(dayTotal, dailyGoal, tracker.unit.step);
                    const isToday = item.dateStr === todayStr;
                    const isSelected = item.dateStr === selectedDateStr;
                    const cellBg = getCellBg(level, color);
                    const hasNote = daysWithNotes.has(item.dateStr);

                    return (
                        <Pressable
                            key={item.dateStr}
                            onPress={() => setSelectedDateStr(item.dateStr)}
                            accessibilityRole="button"
                            accessibilityLabel={`${item.dateStr}, ${dayTotal} ${tracker.unit.label}`}
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

                            {/* Note Indicator dot top-right */}
                            {hasNote && (
                                <View
                                    className="w-1.5 h-1.5 rounded-full absolute top-1 right-1 bg-amber-400"
                                />
                            )}

                            {/* Today Indicator Dot bottom */}
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

            {/* Selected Date Summary & Notes Banner */}
            <View className="mt-4 p-4 rounded-2xl bg-gray-50/90 border border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xs font-bold text-gray-900">
                        {formattedSelectedDate}
                        {selectedDateStr === todayStr ? " (Today)" : ""}
                    </Text>

                    <View
                        className="px-2.5 py-0.5 rounded-full"
                        style={{
                            backgroundColor:
                                selectedTotal > 0 ? `${color}18` : "#E5E7EB",
                        }}
                    >
                        <Text
                            className="text-[11px] font-bold"
                            style={{
                                color: selectedTotal > 0 ? color : "#6B7280",
                            }}
                        >
                            {selectedTotal} {tracker.unit.label}
                        </Text>
                    </View>
                </View>

                {/* Day Notes List */}
                {notesForSelectedDay.length > 0 ? (
                    <View className="gap-2 mt-2 pt-2 border-t border-gray-200/70">
                        <View className="flex-row items-center gap-1.5 mb-1">
                            <MessageSquare size={12} color="#4B5563" />
                            <Text className="text-[11px] font-bold text-gray-700">
                                Notes ({notesForSelectedDay.length})
                            </Text>
                        </View>
                        {notesForSelectedDay.map((e) => (
                            <View
                                key={e.id}
                                className="p-2.5 rounded-xl bg-white border border-gray-100"
                            >
                                <Text className="text-xs text-gray-800 leading-relaxed font-medium">
                                    "{e.note}"
                                </Text>
                                <Text className="text-[10px] text-gray-400 mt-1 font-semibold">
                                    Logged at{" "}
                                    {new Date(e.at).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="flex-row items-center gap-1.5 mt-1">
                        <FileText size={12} color="#9CA3AF" />
                        <Text className="text-[11px] text-gray-400 font-medium">
                            No notes recorded for this date
                        </Text>
                    </View>
                )}
            </View>

            {/* Heat Map Intensity Legend */}
            <View className="flex-row items-center justify-end gap-1.5 mt-3 pt-1">
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

export default HeatmapNotesInsightsFeature;
