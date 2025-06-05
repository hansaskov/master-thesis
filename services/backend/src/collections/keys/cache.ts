import { redis } from "bun";
import { Keys, KeysUnique } from "./schema";

async function get(key: KeysUnique) {
    const lookupKey = `key:${key.private_key}`;

    const cachedKey = await redis.get(lookupKey)

    if (cachedKey) {
        return JSON.parse(cachedKey) as Keys
    }
}

async function set(key: Keys) {
    const lookupKey = `key:${key.private_key}`;
		
    await redis.set(lookupKey, JSON.stringify(key));
}

export default {get, set}
