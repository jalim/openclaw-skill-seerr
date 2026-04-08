import { seerr } from "./lib.mjs";

const args = process.argv.slice(2);

const query = args[0];

const typeIdx = args.indexOf("--type");
const type = typeIdx >= 0 ? args[typeIdx + 1] : null;

if (!query) {
  console.error("Usage: search.mjs \"title\"");
  process.exit(1);
}

const data = await seerr(`/search?query=${encodeURIComponent(query)}`);

let results = data.results || [];

if (type) {
  results = results.filter(r => r.mediaType === type);
}

console.log(JSON.stringify(results.slice(0, 8), null, 2));