import { seerr } from "./lib.mjs";

const pageIdx = process.argv.indexOf("--page");
const page = pageIdx >= 0 ? Number(process.argv[pageIdx + 1]) : 1;

if (!Number.isInteger(page) || page < 1) {
  console.error("--page must be a positive integer");
  process.exit(1);
}

const data = await seerr(`/request?take=20&skip=${(page - 1) * 20}`);

console.log(JSON.stringify(data, null, 2));