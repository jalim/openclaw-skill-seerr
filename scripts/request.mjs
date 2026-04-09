import { seerr } from "./lib.mjs";

const args = process.argv.slice(2);

const query = args[0] && !args[0].startsWith("--") ? args[0] : null;

const idIdx = args.indexOf("--id");
const id = idIdx >= 0 ? Number(args[idIdx + 1]) : null;

const typeIdx = args.indexOf("--type");
const type = typeIdx >= 0 ? args[typeIdx + 1] : null;

const seasonIdx = args.indexOf("--seasons");
const seasons = seasonIdx >= 0 ? args[seasonIdx + 1] : null;

const userIdx = args.indexOf("--user");
const userName = userIdx >= 0 ? args[userIdx + 1] : null;

if (!query && !id) {
  console.error("Usage: request.mjs \"title\" [--type movie|tv] [--seasons all|1,2,3] [--user <name>]");
  console.error("       request.mjs --id <tmdb-id> --type movie|tv [--seasons all|1,2,3] [--user <name>]");
  process.exit(1);
}

let userId = null;
if (userName) {
  const usersEnv = process.env.SEERR_USERS || "";
  const userMap = Object.fromEntries(
    usersEnv.split(",")
      .filter(Boolean)
      .map(entry => {
        const colonIdx = entry.lastIndexOf(":");
        const name = entry.slice(0, colonIdx).trim().toLowerCase();
        const id = Number(entry.slice(colonIdx + 1).trim());
        return [name, id];
      })
      .filter(([name, id]) => name && Number.isInteger(id) && id > 0)
  );
  userId = userMap[userName.toLowerCase()];
  if (!userId) {
    console.error(`Unknown user: "${userName}". Set SEERR_USERS=name:id,name:id to configure users.`);
    process.exit(1);
  }
}

if (id && !type) {
  console.error("--type is required when using --id");
  process.exit(1);
}

if (id && isNaN(id)) {
  console.error("--id must be a number");
  process.exit(1);
}

if (type && type !== "movie" && type !== "tv") {
  console.error("--type must be \"movie\" or \"tv\"");
  process.exit(1);
}

let body;

if (id) {
  body = { mediaId: id, mediaType: type };
} else {
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

  body = {
    mediaId: result.id,
    mediaType: type || result.mediaType
  };
}

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

if (userId) body.userId = userId;

const response = await seerr("/request", {
  method: "POST",
  body: JSON.stringify(body)
});

console.log(JSON.stringify(response, null, 2));