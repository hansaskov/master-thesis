import { customAlphabet } from "nanoid";

// Used for generating random ids for primary keys
export const generateRandomString = customAlphabet(
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);
