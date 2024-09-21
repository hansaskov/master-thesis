import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "./db/pg";
import { sessionTable, userTable } from "./db/schema";
import { GitHub } from "arctic";
import { env } from "./config/env";


const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: env.IS_PRODUCTION  // set `Secure` flag in HTTPS
		}
	},
	getUserAttributes: (attributes) => {
		return {
			githubId: attributes.github_id,
			username: attributes.username
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			github_id: number;
			username: string;
		};
	}
}


export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);
