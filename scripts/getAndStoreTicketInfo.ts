import "dotenv";
import { getSkanetrafikenToken } from "../src/getSkanetrafikenToken.js";
import { TicketsResponseSchema } from "../src/types.js";
import { getActiveTickets } from "../src/getActiveTickets.js";
import fs from "fs";

const username = process.env["USERNAME"];
const password = process.env["PASSWORD"];
const executablePath = process.env["EXECUTABLE_PATH"];
const cachedTokenPath = "/tmp/skanetrafiken-token";

if (!username || !password || !executablePath)
  throw new Error("Both `USERNAME` and `PASSWORD` need to be defined in env`");

const cachedToken = (() => {
  try {
    return fs.readFileSync(cachedTokenPath, "utf-8");
  } catch (e) {
    return null;
  }
})();

const generateAndCacheToken = async () => {
  console.log("Generating and caching token");
  const jwtToken = await getSkanetrafikenToken({
    username,
    password,
    executablePath,
  });
  fs.writeFileSync(cachedTokenPath, jwtToken);
  return jwtToken;
};

const initialToken = cachedToken ?? (await generateAndCacheToken());

const fetchTicketsResponse = (token: string) =>
  fetch("https://www.skanetrafiken.se/gw-bns/registered-app", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((x) =>
      !x.ok
        ? Promise.reject(
            JSON.stringify({ status: x.status, statusText: x.statusText }),
          )
        : x.json(),
    )
    .then((x) => TicketsResponseSchema.parse(x));

const result = await fetchTicketsResponse(initialToken).catch(async (e) => {
  console.error(e);
  console.error("Cache-busting token and attempting again");
  const newToken = await generateAndCacheToken();
  return fetchTicketsResponse(newToken);
});

console.log(
  JSON.stringify({
    activeTickets: getActiveTickets(result.tickets, new Date()).map(
      (x) => x.activeTo,
    ),
  }),
);

// await page.screenshot({ path: "example.png" });
