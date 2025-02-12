import { Type as t } from '@sinclair/typebox';
import type { Types } from 'backend';

export const partSchema = t.Object({
	id: t.String(),
	name: t.String()
});

export type Part = Types.Part;
