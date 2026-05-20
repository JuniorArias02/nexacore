// src/utils/dateFormatter.js
/**
 * Utility functions for handling dates with timezone conversion
 * Backend sends dates in UTC (ISO 8601), we convert to local timezone
 */

/**
 * Format a UTC date string to local date
 * @param {string} utcDateString - ISO 8601 date string from backend (often just YYYY-MM-DD)
 * @param {string} locale - Locale for formatting (default: 'es-CO')
 * @returns {string} Formatted date in local timezone
 */
export const formatDate = (utcDateString, locale = 'es-CO') => {
    if (!utcDateString) return 'N/A';

    const dateStr = String(utcDateString).trim();
    const datePattern = /^(\d{4})-(\d{2})-(\d{2})/;
    const match = dateStr.match(datePattern);

    if (match) {
        const [_, yearStr, monthStr, dayStr] = match;
        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);

        let timePart = '';
        if (dateStr.includes('T')) {
            timePart = dateStr.split('T')[1];
        } else if (dateStr.includes(' ')) {
            timePart = dateStr.split(' ')[1];
        }

        const isMidnight = !timePart || timePart.startsWith('00:00:00') || timePart.startsWith('00:00');

        if (isMidnight) {
            const dateObj = new Date(year, month - 1, day);
            return dateObj.toLocaleDateString(locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } else {
            let parsedDateStr = dateStr;
            if (!dateStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateStr)) {
                parsedDateStr = dateStr.replace(' ', 'T') + 'Z';
            }
            const dateObj = new Date(parsedDateStr);
            if (isNaN(dateObj.getTime())) return 'N/A';

            return dateObj.toLocaleString(locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }

    const fallbackDate = new Date(utcDateString);
    if (isNaN(fallbackDate.getTime())) return 'N/A';
    return fallbackDate.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

/**
 * Format a UTC date string to local datetime
 * @param {string} utcDateString - ISO 8601 date string from backend
 * @param {string} locale - Locale for formatting (default: 'es-CO')
 * @returns {string} Formatted datetime in local timezone
 */
export const formatDateTime = (utcDateString, locale = 'es-CO') => {
    if (!utcDateString) return 'N/A';

    const date = new Date(utcDateString);
    return date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Format a UTC date string to relative time (e.g., "hace 2 horas")
 * @param {string} utcDateString - ISO 8601 date string from backend
 * @param {string} locale - Locale for formatting (default: 'es-CO')
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (utcDateString, locale = 'es-CO') => {
    if (!utcDateString) return 'N/A';

    const date = new Date(utcDateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
};

/**
 * Get current datetime in ISO format (for sending to backend)
 * @returns {string} ISO 8601 datetime string in UTC
 */
export const getCurrentUTCDateTime = () => {
    return new Date().toISOString();
};

/**
 * Convert local datetime to UTC ISO string (for sending to backend)
 * @param {Date} localDate - Local date object
 * @returns {string} ISO 8601 datetime string in UTC
 */
export const toUTCISOString = (localDate) => {
    return localDate.toISOString();
};
