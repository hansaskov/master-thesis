import { GenericContainer } from "testcontainers";

const SETTINGS = {
	POSTGRES_DB: "database",
	POSTGRES_USER: "username",
	POSTGRES_PASSWORD: "password",
	PORT: "5432"
}

console.log("Testcontainers start")
const container = await new GenericContainer("redis")
.withExposedPorts(5432)
.withEnvironment(SETTINGS)
.start();
console.log("Testcontainers has started")


console.log("Testcontainers stop")
await container.stop()
console.log("Testcontainers has stopped")
