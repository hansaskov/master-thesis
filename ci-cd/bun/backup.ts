import { $ } from "bun";

const ls = $`docker container ls`.text()

console.log(await ls)