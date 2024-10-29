import { Table } from "./model";
import { db } from "./postgres";

await db
	.insert(Table.organizations)
	.values([{ name: "VisioPointer" }, { name: "VisioCompact" }, { name: "VisioLine" }, { name: "SmartInspector" }])
	.then(({ count }) => `Inserted ${count} into system models`);

throw "Ended Succesfully";
