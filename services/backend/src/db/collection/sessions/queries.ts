import { eq, sql } from "drizzle-orm";

import type { Types } from "$types/index";
import { db } from "../../postgres";
import { users } from "../users/schema";
import { sessions } from "./schema";

const prepareSelectUniqueWithUser = db
	.select({ user: users, session: sessions })
	.from(sessions)
	.innerJoin(users, eq(sessions.user_id, users.id))
	.where(eq(sessions.id, sql.placeholder("sessionId")))
	.prepare("select_with_user");

export const sessionQueries = {
	selectWithUser: async (sessionId: string) =>
		await prepareSelectUniqueWithUser
			.execute({ sessionId })
			.then((v) => v.at(0)),
	create: async (session: Types.SessionNew) => {
		await db.insert(sessions).values(session);
	},
	delete: async (sessionId: string) => {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
	},
	update: async (session: Types.SessionUpdate) => {
		await db.update(sessions).set(session).where(eq(sessions.id, session.id));
	},
} as const;
