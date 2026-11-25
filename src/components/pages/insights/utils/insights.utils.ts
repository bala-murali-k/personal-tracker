import { localDay, type Entry, type Tracker } from "@/model/tracker.model";

export interface TrendStats {
    avg7Days: number;
    avg30Days: number;
    thisWeekTotal: number;
    prevWeekTotal: number;
    weekOverWeekChange: number;
    momentum: "High Momentum" | "Steady Rhythm" | "Cooling Down";
    momentumDescription: string;
}

export interface PersonalRecords {
    bestDay: { date: string; formattedDate: string; amount: number } | null;
    bestWeek: { weekLabel: string; amount: number } | null;
    bestMonth: { monthLabel: string; amount: number } | null;
}

export interface WeekdayPattern {
    bestWeekday: { day: string; avg: number };
    worstWeekday: { day: string; avg: number };
    weekdayAvg: number;
    weekendAvg: number;
    weekendDiffPercentage: number;
    dailyAverages: { day: string; short: string; avg: number }[];
}

export interface TimeOfDayPattern {
    peakHour: string;
    morningCount: number;
    afternoonCount: number;
    eveningCount: number;
    nightCount: number;
    morningPercent: number;
    eveningPercent: number;
}

export interface StreakStats {
    currentStreak: number;
    longestStreak: number;
    goalDaysThisWeek: number;
    totalDaysThisWeek: number;
    adherencePercent: number;
    dailyTarget: number;
    weekDaysStatus: { day: string; short: string; isHit: boolean; dateStr: string }[];
}

export interface LifetimeBehaviorStats {
    totalNet: number;
    totalGross: number;
    totalDecrements: number;
    decrementCount: number;
    decrementRate: number;
    activeDaysCount: number;
    avgPerActiveDay: number;
    daysSinceCreation: number;
}

export interface ReminderEffectStats {
    reminderEnabled: boolean;
    reminderTime: string;
    hasEntries: boolean;
    avgFirstEntryTime: string;
    onTimeRate: number;
    avgMinutesDiff: number;
}

const WEEKDAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const WEEKDAY_SHORTS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper: Get date N days ago as "YYYY-MM-DD"
function getDateOffset(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return localDay(d);
}

// 1. Calculate Trends: 7/30-day averages, WoW change, momentum
export function calculateTrends(
    tracker: Tracker,
    entries: Entry[]
): TrendStats {
    // Map entries to daily totals
    const dayTotalsMap: Record<string, number> = {};
    for (const e of entries) {
        dayTotalsMap[e.day] = (dayTotalsMap[e.day] ?? 0) + e.amount;
    }

    // Last 7 days
    let thisWeekTotal = 0;
    for (let i = 0; i < 7; i++) {
        const dStr = getDateOffset(i);
        thisWeekTotal += Math.max(0, dayTotalsMap[dStr] ?? 0);
    }
    const avg7Days = Math.round((thisWeekTotal / 7) * 10) / 10;

    // Prior 7 days (days 7 to 13 ago)
    let prevWeekTotal = 0;
    for (let i = 7; i < 14; i++) {
        const dStr = getDateOffset(i);
        prevWeekTotal += Math.max(0, dayTotalsMap[dStr] ?? 0);
    }

    // Week-over-week change %
    let weekOverWeekChange = 0;
    if (prevWeekTotal > 0) {
        weekOverWeekChange = Math.round(
            ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100
        );
    } else if (thisWeekTotal > 0) {
        weekOverWeekChange = 100;
    }

    // Last 30 days
    let last30Total = 0;
    for (let i = 0; i < 30; i++) {
        const dStr = getDateOffset(i);
        last30Total += Math.max(0, dayTotalsMap[dStr] ?? 0);
    }
    const avg30Days = Math.round((last30Total / 30) * 10) / 10;

    // Momentum
    let momentum: TrendStats["momentum"] = "Steady Rhythm";
    let momentumDescription = "Consistent logging pace";
    if (weekOverWeekChange >= 15) {
        momentum = "High Momentum";
        momentumDescription = `+${weekOverWeekChange}% activity surge this week`;
    } else if (weekOverWeekChange <= -15) {
        momentum = "Cooling Down";
        momentumDescription = `${weekOverWeekChange}% pace drop vs last week`;
    }

    return {
        avg7Days,
        avg30Days,
        thisWeekTotal,
        prevWeekTotal,
        weekOverWeekChange,
        momentum,
        momentumDescription,
    };
}

// 2. Personal Records: best day, week, and month
export function calculateRecords(
    tracker: Tracker,
    entries: Entry[]
): PersonalRecords {
    if (entries.length === 0) {
        return { bestDay: null, bestWeek: null, bestMonth: null };
    }

    // Daily totals
    const dayTotals: Record<string, number> = {};
    const monthTotals: Record<string, number> = {};

    for (const e of entries) {
        dayTotals[e.day] = (dayTotals[e.day] ?? 0) + e.amount;
        const monthKey = e.day.slice(0, 7); // "YYYY-MM"
        monthTotals[monthKey] = (monthTotals[monthKey] ?? 0) + e.amount;
    }

    // Best Day
    let bestDayEntry: { date: string; amount: number } | null = null;
    for (const [date, amount] of Object.entries(dayTotals)) {
        if (amount > 0 && (!bestDayEntry || amount > bestDayEntry.amount)) {
            bestDayEntry = { date, amount };
        }
    }

    const bestDay = bestDayEntry
        ? {
              date: bestDayEntry.date,
              formattedDate: new Date(bestDayEntry.date).toLocaleDateString(
                  "default",
                  { month: "short", day: "numeric", year: "numeric" }
              ),
              amount: bestDayEntry.amount,
          }
        : null;

    // Best 7-day rolling window
    const sortedDays = Object.keys(dayTotals).sort();
    let bestWeekAmount = 0;
    let bestWeekLabel = "";

    if (sortedDays.length > 0) {
        // Calculate rolling 7 days across date range
        const startDate = new Date(sortedDays[0]);
        const endDate = new Date(sortedDays[sortedDays.length - 1]);
        const dayCount = Math.max(
            7,
            Math.ceil(
                (endDate.getTime() - startDate.getTime()) / 86400000
            ) + 1
        );

        for (let i = 0; i <= dayCount - 7; i++) {
            let rollingSum = 0;
            const wStart = new Date(startDate);
            wStart.setDate(wStart.getDate() + i);

            for (let j = 0; j < 7; j++) {
                const cur = new Date(wStart);
                cur.setDate(cur.getDate() + j);
                const k = localDay(cur);
                rollingSum += Math.max(0, dayTotals[k] ?? 0);
            }

            if (rollingSum > bestWeekAmount) {
                bestWeekAmount = rollingSum;
                bestWeekLabel = `Week of ${wStart.toLocaleDateString("default", {
                    month: "short",
                    day: "numeric",
                })}`;
            }
        }
    }

    const bestWeek =
        bestWeekAmount > 0
            ? { weekLabel: bestWeekLabel || "Recent week", amount: bestWeekAmount }
            : null;

    // Best Month
    let bestMonthEntry: { monthKey: string; amount: number } | null = null;
    for (const [mKey, amt] of Object.entries(monthTotals)) {
        if (amt > 0 && (!bestMonthEntry || amt > bestMonthEntry.amount)) {
            bestMonthEntry = { monthKey: mKey, amount: amt };
        }
    }

    const bestMonth = bestMonthEntry
        ? {
              monthLabel: new Date(
                  `${bestMonthEntry.monthKey}-01`
              ).toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
              }),
              amount: bestMonthEntry.amount,
          }
        : null;

    return { bestDay, bestWeek, bestMonth };
}

// 3. Weekday Pattern: best/worst weekday, weekday vs weekend
export function calculateWeekdayPattern(
    tracker: Tracker,
    entries: Entry[]
): WeekdayPattern {
    const dayTotals: Record<string, number> = {};
    for (const e of entries) {
        dayTotals[e.day] = (dayTotals[e.day] ?? 0) + e.amount;
    }

    // Group by weekday index (0 = Sun, 1 = Mon ... 6 = Sat)
    const weekdaySums: number[] = [0, 0, 0, 0, 0, 0, 0];
    const weekdayCounts: number[] = [0, 0, 0, 0, 0, 0, 0];

    for (const [dateStr, total] of Object.entries(dayTotals)) {
        if (total > 0) {
            const dayOfWeek = new Date(dateStr).getDay();
            weekdaySums[dayOfWeek] += total;
            weekdayCounts[dayOfWeek] += 1;
        }
    }

    // Monday first ordering (1, 2, 3, 4, 5, 6, 0)
    const order = [1, 2, 3, 4, 5, 6, 0];
    const dailyAverages = order.map((idx) => {
        const count = weekdayCounts[idx] || 1;
        const sum = weekdaySums[idx] || 0;
        const avg = Math.round((sum / count) * 10) / 10;
        return {
            day: WEEKDAY_NAMES[idx],
            short: WEEKDAY_SHORTS[idx],
            avg,
        };
    });

    // Best and worst weekday
    let best = dailyAverages[0];
    let worst = dailyAverages[0];

    for (const d of dailyAverages) {
        if (d.avg > best.avg) best = d;
        if (d.avg < worst.avg) worst = d;
    }

    // Weekdays (Mon-Fri) vs Weekends (Sat-Sun)
    const weekdayTotal = [1, 2, 3, 4, 5].reduce(
        (sum, i) => sum + weekdaySums[i],
        0
    );
    const weekdayDayCount = [1, 2, 3, 4, 5].reduce(
        (cnt, i) => cnt + (weekdayCounts[i] || 0),
        0
    );
    const weekdayAvg =
        weekdayDayCount > 0
            ? Math.round((weekdayTotal / weekdayDayCount) * 10) / 10
            : 0;

    const weekendTotal = [0, 6].reduce((sum, i) => sum + weekdaySums[i], 0);
    const weekendDayCount = [0, 6].reduce(
        (cnt, i) => cnt + (weekdayCounts[i] || 0),
        0
    );
    const weekendAvg =
        weekendDayCount > 0
            ? Math.round((weekendTotal / weekendDayCount) * 10) / 10
            : 0;

    let weekendDiffPercentage = 0;
    if (weekdayAvg > 0) {
        weekendDiffPercentage = Math.round(
            ((weekendAvg - weekdayAvg) / weekdayAvg) * 100
        );
    }

    return {
        bestWeekday: best,
        worstWeekday: worst,
        weekdayAvg,
        weekendAvg,
        weekendDiffPercentage,
        dailyAverages,
    };
}

// 4. Time of Day: peak hour, morning/evening split
export function calculateTimeOfDay(
    tracker: Tracker,
    entries: Entry[]
): TimeOfDayPattern {
    const hourlyCounts: number[] = new Array(24).fill(0);
    let morningCount = 0;
    let afternoonCount = 0;
    let eveningCount = 0;
    let nightCount = 0;

    for (const e of entries) {
        if (e.at > 0 && e.amount > 0) {
            const hour = new Date(e.at).getHours();
            hourlyCounts[hour] += e.amount;

            if (hour >= 5 && hour < 12) {
                morningCount += e.amount;
            } else if (hour >= 12 && hour < 17) {
                afternoonCount += e.amount;
            } else if (hour >= 17 && hour < 22) {
                eveningCount += e.amount;
            } else {
                nightCount += e.amount;
            }
        }
    }

    // Find peak hour
    let peakHourIdx = 9; // default 9am
    let maxHourAmount = 0;
    for (let h = 0; h < 24; h++) {
        if (hourlyCounts[h] > maxHourAmount) {
            maxHourAmount = hourlyCounts[h];
            peakHourIdx = h;
        }
    }

    const formatHour = (h: number) => {
        const period = h >= 12 ? "PM" : "AM";
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:00 ${period}`;
    };

    const peakHour = `${formatHour(peakHourIdx)} - ${formatHour(
        (peakHourIdx + 1) % 24
    )}`;

    const totalLogged =
        morningCount + afternoonCount + eveningCount + nightCount;
    const morningPercent =
        totalLogged > 0 ? Math.round((morningCount / totalLogged) * 100) : 50;
    const eveningPercent =
        totalLogged > 0
            ? Math.round(((afternoonCount + eveningCount + nightCount) / totalLogged) * 100)
            : 50;

    return {
        peakHour,
        morningCount,
        afternoonCount,
        eveningCount,
        nightCount,
        morningPercent,
        eveningPercent,
    };
}

// 5. Streaks & Goal Adherence: counting only goal days & weekly adherence
export function calculateStreaks(
    tracker: Tracker,
    entries: Entry[]
): StreakStats {
    const goals = tracker.features.goals;
    const dailyTarget = goals?.daily && goals.daily > 0 ? goals.daily : 1;
    const activeWeekDays = goals?.weeklyActiveDays ?? [];

    const dayTotals: Record<string, number> = {};
    for (const e of entries) {
        dayTotals[e.day] = (dayTotals[e.day] ?? 0) + e.amount;
    }

    // 1. Goal days hit this week (Monday through Sunday of current week)
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sun
    const mondayOffset = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - mondayOffset);

    const weekDaysStatus: StreakStats["weekDaysStatus"] = [];
    let goalDaysThisWeek = 0;
    const totalDaysThisWeek = mondayOffset + 1; // days elapsed this week up to today

    for (let i = 0; i < 7; i++) {
        const d = new Date(mondayDate);
        d.setDate(mondayDate.getDate() + i);
        const dStr = localDay(d);
        const dayTotal = dayTotals[dStr] ?? 0;
        const isHit = dayTotal >= dailyTarget;

        if (i <= mondayOffset && isHit) {
            goalDaysThisWeek += 1;
        }

        const weekdayIdx = d.getDay();
        weekDaysStatus.push({
            day: WEEKDAY_NAMES[weekdayIdx],
            short: WEEKDAY_SHORTS[weekdayIdx],
            isHit,
            dateStr: dStr,
        });
    }

    const adherencePercent =
        totalDaysThisWeek > 0
            ? Math.round((goalDaysThisWeek / totalDaysThisWeek) * 100)
            : 0;

    // 2. Streaks counting goal days (with consideration for rest days if configured)
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check today or yesterday as start of current streak
    const todayStr = localDay(today);
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() - 1);
    const yesterdayStr = localDay(yesterdayDate);

    const isTodayHit = (dayTotals[todayStr] ?? 0) >= dailyTarget;
    const isYesterdayHit = (dayTotals[yesterdayStr] ?? 0) >= dailyTarget;

    // Walk backwards for current streak
    let walkDate = new Date(isTodayHit ? today : yesterdayDate);
    if (isTodayHit || isYesterdayHit) {
        while (true) {
            const dStr = localDay(walkDate);
            const total = dayTotals[dStr] ?? 0;
            const dayName = WEEKDAY_NAMES[walkDate.getDay()] as any;
            const isRestDay =
                activeWeekDays.length > 0 && !activeWeekDays.includes(dayName);

            if (total >= dailyTarget) {
                currentStreak += 1;
            } else if (isRestDay) {
                // Rest day does not break streak
            } else {
                break;
            }

            walkDate.setDate(walkDate.getDate() - 1);
            // Safety limit (1 year)
            if (currentStreak > 365) break;
        }
    }

    // Longest streak across all dates
    const sortedDates = Object.keys(dayTotals).sort();
    if (sortedDates.length > 0) {
        const start = new Date(sortedDates[0]);
        const end = new Date(today);
        const totalSpan = Math.ceil(
            (end.getTime() - start.getTime()) / 86400000
        ) + 1;

        for (let i = 0; i < totalSpan; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const dStr = localDay(d);
            const total = dayTotals[dStr] ?? 0;
            const dayName = WEEKDAY_NAMES[d.getDay()] as any;
            const isRestDay =
                activeWeekDays.length > 0 && !activeWeekDays.includes(dayName);

            if (total >= dailyTarget) {
                tempStreak += 1;
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
            } else if (isRestDay) {
                // Rest day keeps streak alive
            } else {
                tempStreak = 0;
            }
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
        currentStreak,
        longestStreak,
        goalDaysThisWeek,
        totalDaysThisWeek,
        adherencePercent,
        dailyTarget,
        weekDaysStatus,
    };
}

// 6. Lifetime Stats & Correction Behavior
export function calculateLifetime(
    tracker: Tracker,
    entries: Entry[]
): LifetimeBehaviorStats {
    let totalGross = 0;
    let totalDecrements = 0;
    let decrementCount = 0;
    const activeDaysSet = new Set<string>();

    for (const e of entries) {
        if (e.amount > 0) {
            totalGross += e.amount;
            activeDaysSet.add(e.day);
        } else if (e.amount < 0) {
            totalDecrements += e.amount;
            decrementCount += 1;
        }
    }

    const totalNet = totalGross + totalDecrements;
    const activeDaysCount = activeDaysSet.size;
    const avgPerActiveDay =
        activeDaysCount > 0
            ? Math.round((totalNet / activeDaysCount) * 10) / 10
            : 0;

    const decrementRate =
        totalGross > 0
            ? Math.round((Math.abs(totalDecrements) / totalGross) * 100 * 10) / 10
            : 0;

    const daysSinceCreation = Math.max(
        1,
        Math.floor((Date.now() - tracker.createdAt) / 86400000)
    );

    return {
        totalNet,
        totalGross,
        totalDecrements,
        decrementCount,
        decrementRate,
        activeDaysCount,
        avgPerActiveDay,
        daysSinceCreation,
    };
}

// 7. Reminder Effect: first entry vs reminder.time
export function calculateReminderEffect(
    tracker: Tracker,
    entries: Entry[]
): ReminderEffectStats {
    const reminder = tracker.features.reminder;
    const reminderEnabled = Boolean(reminder?.enabled && reminder.time);
    const reminderTime = reminder?.time || "09:00";

    const [remH, remM] = reminderTime.split(":").map(Number);
    const reminderMinutesFromMidnight = (remH || 9) * 60 + (remM || 0);

    // Group entries by day and find first entry of each day
    const firstEntriesByDay: Record<string, Entry> = {};
    for (const e of entries) {
        if (e.at > 0 && e.amount > 0) {
            if (
                !firstEntriesByDay[e.day] ||
                e.at < firstEntriesByDay[e.day].at
            ) {
                firstEntriesByDay[e.day] = e;
            }
        }
    }

    const firstEntries = Object.values(firstEntriesByDay);
    if (firstEntries.length === 0) {
        return {
            reminderEnabled,
            reminderTime,
            hasEntries: false,
            avgFirstEntryTime: "None",
            onTimeRate: 0,
            avgMinutesDiff: 0,
        };
    }

    let totalDiffMinutes = 0;
    let onTimeCount = 0;
    let totalFirstMinutes = 0;

    for (const e of firstEntries) {
        const d = new Date(e.at);
        const entryMinutes = d.getHours() * 60 + d.getMinutes();
        totalFirstMinutes += entryMinutes;

        const diff = entryMinutes - reminderMinutesFromMidnight;
        totalDiffMinutes += diff;

        // On-time if logged within 60 minutes after reminder time
        if (diff >= -15 && diff <= 60) {
            onTimeCount += 1;
        }
    }

    const avgMinutes = Math.round(totalFirstMinutes / firstEntries.length);
    const avgH = Math.floor(avgMinutes / 60);
    const avgM = avgMinutes % 60;
    const period = avgH >= 12 ? "PM" : "AM";
    const displayH = avgH % 12 === 0 ? 12 : avgH % 12;
    const avgFirstEntryTime = `${displayH}:${String(avgM).padStart(
        2,
        "0"
    )} ${period}`;

    const onTimeRate = Math.round(
        (onTimeCount / firstEntries.length) * 100
    );
    const avgMinutesDiff = Math.round(
        totalDiffMinutes / firstEntries.length
    );

    return {
        reminderEnabled,
        reminderTime,
        hasEntries: true,
        avgFirstEntryTime,
        onTimeRate,
        avgMinutesDiff,
    };
}
