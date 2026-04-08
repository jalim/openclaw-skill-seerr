import { seerr } from "./lib.mjs";

const args = process.argv.slice(2);

const query = args[0];

const typeIdx = args.indexOf("--type");
const type = typeIdx >= 0 ? args[typeIdx + 1] : null;

const seasonIdx = args.indexOf("--seasons");
const seasons = seasonIdx >= 0 ? args[seasonIdx + 1] : null;

if (!query) {
  console.error("Usage: request.mjs \"title\"");
  process.exit(1);
}

const search = await seerr(`/search?query=${encodeURIComponent(query)}`);

const result = search.results?.[0];

if (!result) {
  console.error("No results");
  process.exit(1);
}

const body = {
  mediaId: result.id,
  mediaType: type || result.mediaType
};

if (seasons && body.mediaType === "tv") {
  if (seasons === "all") {
    body.seasons = "all";
  } else {
    body.seasons = seasons.split(",").map(Number);
  }
}

const response = await seerr("/request", {
  method: "POST",
  body: JSON.stringify(body)
});

console.log(JSON.stringify(response, null, 2));