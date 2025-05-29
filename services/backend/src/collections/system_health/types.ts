import { Prettify } from "elysia/types";
import type { table } from "./table";

export type Select = typeof table.$inferSelect;

export type WithStatus = Prettify<
	Select & {
		running: boolean;
	}
>;
