import {
	type AnyColumn,
	Column,
	type SQL,
	type SQLWrapper,
	is,
	sql,
} from "drizzle-orm";

type ValidUnits =
	| "microseconds"
	| "milliseconds"
	| "second"
	| "seconds"
	| "minute"
	| "minutes"
	| "hour"
	| "hours"
	| "day"
	| "days"
	| "week"
	| "weeks"
	| "month"
	| "months"
	| "year"
	| "years";

type IntervalString = `${number} ${ValidUnits}`;

export function TsTimeBucket(
	interval: IntervalString,
	expression: SQLWrapper,
): SQL<Date> {
	return sql`time_bucket(${interval}, ${expression})`.mapWith(
		(v) => new Date(v),
	);
}

export function avg(expression: SQLWrapper) {
	return sql`avg(${expression})`.mapWith(Number);
}

export function first<T extends SQLWrapper>(valueExpr: T, groupByExpr?: T) {
	return sql`first(${valueExpr}, ${groupByExpr ?? valueExpr})`.mapWith(
		is(valueExpr, Column) ? valueExpr : String,
	);
}

export function last<T extends SQLWrapper>(valueExpr: T, groupByExpr?: T) {
	return sql`last(${valueExpr}, ${groupByExpr ?? valueExpr})`.mapWith(
		is(valueExpr, Column) ? valueExpr : String,
	);
}

/**
 * Returns the maximum value in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // The employee with the highest salary
 * db.select({ value: max(employees.salary) }).from(employees)
 * ```
 */
export function max<T extends SQLWrapper>(expression: T) {
	return sql`max(${expression})`.mapWith(
		is(expression, Column) ? expression : String,
	);
}

/**
 * Returns the minimum value in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // The employee with the lowest salary
 * db.select({ value: min(employees.salary) }).from(employees)
 * ```
 */
export function min<T extends SQLWrapper>(expression: T) {
	return sql`min(${expression})`.mapWith(
		is(expression, Column) ? expression : String,
	);
}
