import { Type as t, type Static } from '@sinclair/typebox';

export const taskSchema = t.Object({
	id: t.String(),
	title: t.String(),
	status: t.String(),
	label: t.String(),
	priority: t.String()
});

export type Task = Static<typeof taskSchema>;
