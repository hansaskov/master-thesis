import { $ } from "bun";

const ls = $`docker container ls`.then(v => v.text())

console.log(await ls)