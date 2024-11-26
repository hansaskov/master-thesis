import { eq, sql } from "drizzle-orm";
import { type SessionNew, type SessionUpdate, sessions, users } from "..";
import { db } from "../../postgres";

const prepareSelectUniqueWithUser = db
	.select({ user: users, session: sessions })
	.from(sessions)
	.innerJoin(users, eq(sessions.user_id, users.id))
	.where(eq(sessions.id, sql.placeholder("sessionId")))
	.prepare("select_with_user");

export const sessionQueries = {
	selectWithUser: async (sessionId: string) =>
		await prepareSelectUniqueWithUser.execute({ sessionId }).then((v) => v.at(0)),
	create: async (session: SessionNew) => {
		await db.insert(sessions).values(session);
	},
	delete: async (sessionId: string) => {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
	},
	update: async (session: SessionUpdate) => {
		await db.update(sessions).set(session).where(eq(sessions.id, session.id));
	},
} as const;
