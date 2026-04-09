import { seerr } from "./lib.mjs";

const args = process.argv.slice(2);

const query = args[0];

const typeIdx = args.indexOf("--type");
const type = typeIdx >= 0 ? args[typeIdx + 1] : null;

const seasonIdx = args.indexOf("--seasons");
const seasons = seasonIdx >= 0 ? args[seasonIdx + 1] : null;

if (!query) {
  console.error("Usage: request.mjs \"title\" [--type movie|tv] [--seasons all|1,2,3]");
  process.exit(1);
}

if (type && type !== "movie" && type !== "tv") {
  console.error("--type must be \"movie\" or \"tv\"");
  process.exit(1);
}

const search = await seerr(`/search?query=${encodeURIComponent(query)}`);

let results = search.results || [];

if (type) {
  results = results.filter(r => r.mediaType === type);
}

results.sort((a, b) => {
  const dateA = a.releaseDate || a.firstAirDate || "";
  const dateB = b.releaseDate || b.firstAirDate || "";
  return dateB.localeCompare(dateA);
});

const result = results[0];

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
    // omit seasons key — Seerr requests all seasons by default
  } else {
    const parsed = seasons.split(",").map(Number);
    if (parsed.some(n => !Number.isInteger(n) || n < 1)) {
      console.error("--seasons must be \"all\" or a comma-separated list of positive integers");
      process.exit(1);
    }
    body.seasons = parsed;
  }
}

const response = await seerr("/request", {
  method: "POST",
  body: JSON.stringify(body)
});

console.log(JSON.stringify(response, null, 2));