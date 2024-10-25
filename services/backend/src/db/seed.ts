import { db } from "./postgres";
import { systemModels } from "./schemas/system_models";

await db
	.insert(systemModels)
	.values([{ name: "VisioPointer" }, { name: "VisioCompact" }, { name: "VisioLine" }, { name: "SmartInspector" }])
	.then(({ count }) => `Inserted ${count} into system models`);

throw "Ended Succesfully";
