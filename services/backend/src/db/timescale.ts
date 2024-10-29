import { sql, type SQL, type SQLWrapper } from 'drizzle-orm';

type ValidUnits = 'microseconds' | 'milliseconds' | 'second' | 'seconds' | 'minute' | 'minutes' | 'hour' | 'hours' | 'day' | 'days' | 'week' | 'weeks' | 'month' | 'months' | 'year' | 'years';

type IntervalString = `${number} ${ValidUnits}`;

// Define the time_bucket function with type-safe interval argument
export function time_bucket<T extends SQLWrapper & { _ : { data: Date } }>(
    expression: T,
    interval: IntervalString,
): SQL<Date> {
    return sql`time_bucket(${interval}, ${expression})`.mapWith((v) => new Date(v));
}