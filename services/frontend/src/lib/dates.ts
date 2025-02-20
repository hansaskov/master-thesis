// utils/dateFormatter.ts

type TimeUnit = {
	ms: number;
	label: Intl.RelativeTimeFormatUnit;
};

const TIME_UNITS: TimeUnit[] = [
	{ ms: 31536000000, label: 'year' }, // 365 days
	{ ms: 2592000000, label: 'month' }, // 30 days
	{ ms: 86400000, label: 'day' }, // 24 hours
	{ ms: 3600000, label: 'hour' }, // 60 minutes
	{ ms: 60000, label: 'minute' }, // 60 seconds
	{ ms: 0, label: 'second' } // fallback
];

/**
 * Returns a relative time string (e.g., "2 hours ago") for a given date
 * @param date - Date to format
 * @param locale - Optional locale for internationalization (defaults to user's locale)
 * @returns Formatted relative time string
 */
export function getRelativeTimeString(date: Date | string | number, locale?: string): string {
	// Handle various input types and invalid dates
	const parsedDate = new Date(date);
	if (isNaN(parsedDate.getTime())) {
		throw new Error('Invalid date provided');
	}

	// Cache current time to avoid multiple Date instantiations
	const now = Date.now();
	const diffMs = now - parsedDate.getTime();

	// Handle "just now" case
	if (Math.abs(diffMs) < 45000) {
		// 45 seconds threshold
		return 'Just now';
	}

	// Find the appropriate time unit
	const unit =
		TIME_UNITS.find((unit) => Math.abs(diffMs) >= unit.ms) || TIME_UNITS[TIME_UNITS.length - 1];
	const value = Math.round(diffMs / (unit.ms || 1000)); // Use 1000 for seconds

	// Use Intl.RelativeTimeFormat for localized formatting
	const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
	return formatter.format(-value, unit.label);
}
