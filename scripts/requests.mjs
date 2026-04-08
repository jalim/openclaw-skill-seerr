import { seerr } from "./lib.mjs";

const data = await seerr("/request");

console.log(JSON.stringify(data, null, 2));