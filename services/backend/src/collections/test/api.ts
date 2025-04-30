import { createSession, generateSessionToken, setSessionTokenCookie } from "$auth/lucia";
import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, redirect, t } from "elysia";
import { env } from "elysia";

export const testApi = new Elysia({ prefix: "test" })
    .get(
        "/e2e",
        async ({ cookie }) => {
            if (env.IS_TEST !== "true") {
                console.log("Not a test. Endpoint not accessible");
                return
            }

            //await Queries.

            const dummyUser = await Queries.users.create({
                provider_name: "Microsoft",
                provider_id: "2",
                name: "John",
                email: "du-mmy_acc@outlook.com",
                image: null,
                is_superadmin: true
            });

            const testUser = await Queries.users.create({
                provider_name: "Microsoft",
                provider_id: "3",
                name: "Test",
                email: "test_email@hotmail.com",
                image: null,
                is_superadmin: true
            });

            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, dummyUser.id);
            setSessionTokenCookie(cookie.sessionId, sessionToken, session.expires_at);

            return redirect("/organization", 302)
        }
    )
    