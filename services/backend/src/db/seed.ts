import { exit } from "process";
import { Table } from "./model";
import { db } from "./postgres";


const transaction = db.transaction(async (tx) => {
	// Insert organization
	const organization = await tx
		.insert(Table.organizations)
		.values([{ name: "Trivision" }])
		.returning()
		.then((v) => v.at(0));
		
	if (!organization) {
		throw new Error("Failed to insert organization");
	}

	const system = await tx
		.insert(Table.systems)
		.values([{ 
			name: "VisioPointer", 
			organization_id: organization.id 
		}])
		.returning()
		.then((v) => v.at(0));
		
	if (!system) {
		throw new Error("Failed to insert system");
	}

	const key = await tx
		.insert(Table.keys)
		.values([{ private_key: system.id }])
		.returning()
		.then((v) => v.at(0));
		
	if (!key) {
		throw new Error("Failed to insert key");
	}

	return { organization, system, key };
});


try {
	const result = await transaction;
	console.log("Transaction successful");
	console.log(result);
} catch (e) {
	console.error("Transaction failed");
	console.error(e);
}

exit(0);