import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en"; // Import the locale you want to use (e.g., "en" for English)

// Extend Dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Set the locale for relative time formatting
dayjs.locale("en"); // Use the desired locale

export const RelativeTime = (time?: string): string | null => {
    if (time) {
        return dayjs(time).fromNow(true); // Use the 'true' argument to get abbreviated relative time
    }
    return null;
};

export const DateAndMonth = (time?: string): string | null => {
    let date = dayjs(time).format('MMM D, ddd');
    if (time) {
        return date
    }
    return null
}