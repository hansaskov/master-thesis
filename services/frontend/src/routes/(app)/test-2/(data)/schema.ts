import { Type as t, type Static } from '@sinclair/typebox';
import type { Types } from 'backend';

export const taskSchema = t.Object({
	id: t.String(),
	name: t.String()
});

export type Part = Types.Part
