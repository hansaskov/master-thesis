// convertKeys.test.ts
import { describe, expect, it } from "bun:test";
import { convertKeys } from "./transform";

describe("convertKeys - Edge Cases", () => {
	it("should handle empty objects and arrays", () => {
		expect(convertKeys({})).toEqual({});
		expect(convertKeys([])).toEqual([]);
	});

	it("should handle mixed nested structures", () => {
		const input = {
			Complex_Structure: {
				Array_Of_Objects: [{ First_Item: 1 }, { Second_Item: 2 }],
				Nested_Array: [[{ Deep_Nested: true }]],
				Mixed_Values: {
					Some_String: "test",
					Some_Number: 123,
					Some_Boolean: true,
					Some_Null: null,
					Some_Undefined: undefined,
				},
			},
		};

		const expected = {
			complexstructure: {
				arrayofobjects: [{ firstitem: 1 }, { seconditem: 2 }],
				nestedarray: [[{ deepnested: true }]],
				mixedvalues: {
					somestring: "test",
					somenumber: 123,
					someboolean: true,
					somenull: null,
					someundefined: undefined,
				},
			},
		};

		expect(convertKeys(input)).toEqual(expected);
	});
});

describe("convertKeys - Microsoft Graph User Data", () => {
	it("should correctly transform Microsoft Graph user data structure", () => {
		const input = {
			sub: "b-PncAH_Eo20KlWh1NeP0y8T0gmrcexwXB5RC_5WxAI",
			name: "Tanita Hjort Sode",
			family_name: "Sode",
			given_name: "Tanita Hjort",
			picture: "https://graph.microsoft.com/v1.0/me/photo/$value",
			email: "turnering@dsiovolley.dk",
		};

		const expected = {
			sub: "b-PncAH_Eo20KlWh1NeP0y8T0gmrcexwXB5RC_5WxAI",
			name: "Tanita Hjort Sode",
			familyname: "Sode",
			givenname: "Tanita Hjort",
			picture: "https://graph.microsoft.com/v1.0/me/photo/$value",
			email: "turnering@dsiovolley.dk",
		};

		const result = convertKeys(input);
		expect(result).toEqual(expected);
	});

	// Additional test to verify specific field transformations
	it("should specifically verify each field transformation", () => {
		const input = {
			family_name: "Sode",
			given_name: "Tanita Hjort",
		};

		const result = convertKeys(input);

		// Individual field checks
		expect(result).toHaveProperty("familyname");
		expect(result).toHaveProperty("givenname");
	});
});
