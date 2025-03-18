import { AnyColumn, Column, ColumnBaseConfig, is, sql, type SQL, type SQLWrapper } from 'drizzle-orm';
import { AnyPgColumn, customType, PgColumn, PgTimestamp } from 'drizzle-orm/pg-core';

type ValidUnits = 'microseconds' | 'milliseconds' | 'second' | 'seconds' | 'minute' | 'minutes' | 'hour' | 'hours' | 'day' | 'days' | 'week' | 'weeks' | 'month' | 'months' | 'year' | 'years';

type IntervalString = `${number} ${ValidUnits}`;

export function TsTimeBucket(
    interval: IntervalString,
    expression: SQLWrapper,
): SQL<Date> {
    return sql`time_bucket(${interval}, ${expression})`.mapWith((v) => new Date(v));
}



export function avg(expression: SQLWrapper): SQL<string> {
	return sql`avg(${expression})`.mapWith(String);
}


export function first<T extends SQLWrapper>(valueExpr: T, groupByExpr?: T ): SQL<(T extends AnyColumn ? T['_']['data'] : string)> {
    return sql`first(${valueExpr}, ${groupByExpr ?? valueExpr})`.mapWith(is(valueExpr, Column) ? valueExpr : String) as any
}

export function last<T extends SQLWrapper>(valueExpr: T, groupByExpr?: T ): SQL<(T extends AnyColumn ? T['_']['data'] : string)> {
    return sql`last(${valueExpr}, ${groupByExpr ?? valueExpr})`.mapWith(is(valueExpr, Column) ? valueExpr : String) as any
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
export function max<T extends SQLWrapper>(expression: T): SQL<(T extends AnyColumn ? T['_']['data'] : string)> {
	return sql`max(${expression})`.mapWith(is(expression, Column) ? expression : String) as any;
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
export function min<T extends SQLWrapper>(expression: T): SQL<(T extends AnyColumn ? T['_']['data'] : string)> {
	return sql`min(${expression})`.mapWith(is(expression, Column) ? expression : String) as any;
}

