import { seerr } from "./lib.mjs";

const id = process.argv[2];

if (!id) {
  console.error("Usage: request-by-id.mjs <id>");
  process.exit(1);
}

const numericId = Number(id);
if (!Number.isInteger(numericId) || numericId < 1) {
  console.error("id must be a positive integer");
  process.exit(1);
}

const data = await seerr(`/request/${id}`);

console.log(JSON.stringify(data, null, 2));