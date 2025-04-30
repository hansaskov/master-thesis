import { createSession, generateSessionToken, setSessionTokenCookie } from "$auth/lucia";
import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import { Reading } from "$collections/types";
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

            // Delete database to start clean environment
            await Queries.test.deleteDatabase();

            // Seed users
            const dummyUser = await Queries.users.create({
                provider_name: "Microsoft",
                provider_id: "2",
                name: "John",
                email: "du-mmy_acc@outlook.com",
                image: null,
                is_superadmin: true
            });

            await Queries.users.create({
                provider_name: "Microsoft",
                provider_id: "3",
                name: "Test",
                email: "test_email@hotmail.com",
                image: null,
                is_superadmin: true
            });

            // Seed parts
            await Queries.part.create({
                name: "E2E test part",
                image: ""
            })


            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, dummyUser.id);
            setSessionTokenCookie(cookie.sessionId, sessionToken, session.expires_at);

            return redirect("/organization", 302)
        }
    )
    .get(
        "e2e/reading",
        async ({ cookie }) => {
            if (env.IS_TEST !== "true") {
                console.log("Not a test. Endpoint not accessible");
                return
            }

            await Queries.test.deleteDatabase();

            const dummyUser = await Queries.users.create({
                provider_name: "Microsoft",
                provider_id: "2",
                name: "John",
                email: "du-mmy_acc@outlook.com",
                image: null,
                is_superadmin: true
            });

            const organization = await Queries.organizations.create({
                name: "Trivision",
            });
        
            // Insert system
            const system = await Queries.systems.create({
                name: "VisioPointer",
                organization_id: organization.id,
                system_model: "VisioPointer",
            });
        
            // Insert key
            const key = await Queries.keys.create({
                system_id: system.id,
                name: "Key from seed api",
            });

            const reading: Reading[] = [{
                name: "test reading",
                system_id: system.id,
                time: new Date(),
                value: 2,
                unit: "%",
                category: "test"
            }]

            await Queries.readings.insert(reading)

            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, dummyUser.id);
            setSessionTokenCookie(cookie.sessionId, sessionToken, session.expires_at);

            return redirect("/organization", 302)
        }
    )
    