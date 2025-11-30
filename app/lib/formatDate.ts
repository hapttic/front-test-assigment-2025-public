export function formatDateDisplay(date: string) {

    if (date.includes("T")) {
        const [d, t] = date.split("T");
        const parsed = new Date(date);
        const time = parsed.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const month = parsed.toLocaleString("en-US", { month: "short" });
        const day = parsed.getDate();

        return `${month}${day}, ${time}`; 
    }

    // ---------- DAILY ----------
    // Format: 2025-01-01
    if (date.length === 10) {
        const parsed = new Date(date);
        const month = parsed.toLocaleString("en-US", { month: "short" });
        const day = parsed.getDate();
        const year = parsed.getFullYear();

        return `${month} ${day}, ${year}`; // Jan 1, 2025
    }


    if (date.length === 7) {
        const [year, month] = date.split("-");
        const parsed = new Date(Number(year), Number(month) - 1, 1);

        const monthName = parsed.toLocaleString("en-US", { month: "long" });
        return `${monthName} ${year}`; 
    }


    if (date.includes("W")) {
        const [yr, wk] = date.split("-W");
        const year = Number(yr);
        const week = Number(wk);

        // Compute start-of-week (Monday)
        const firstDay = new Date(year, 0, 1);
        const dayOffset = firstDay.getDay() <= 1 ? 1 - firstDay.getDay() : 8 - firstDay.getDay();
        const start = new Date(year, 0, 1 + (week - 1) * 7 + dayOffset);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const startMonth = start.toLocaleString("en-US", { month: "short" });
        const endMonth = end.toLocaleString("en-US", { month: "short" });

        const startDay = start.getDate();
        const endDay = end.getDate();

        return `${startMonth} ${startDay}–${endDay}, ${year}`; // Jan 13–19, 2025
    }

    return date;
}
