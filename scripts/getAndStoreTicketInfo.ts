import "dotenv";
import { getSkanetrafikenToken } from "../src/getSkanetrafikenToken.js";
import { TicketsResponseSchema } from "../src/types.js";
import { getActiveTickets } from "../src/getActiveTickets.js";

const username = process.env["USERNAME"];
const password = process.env["PASSWORD"];
const executablePath = process.env["EXECUTABLE_PATH"];

if (!username || !password || !executablePath)
  throw new Error("Both `USERNAME` and `PASSWORD` need to be defined in env`");

const jwtToken = await getSkanetrafikenToken({
  username,
  password,
  executablePath,
});

const result = await fetch(
  "https://www.skanetrafiken.se/gw-bns/registered-app",
  {
    headers: { Authorization: `Bearer ${jwtToken}` },
  },
)
  .then((x) =>
    !x.ok
      ? Promise.reject(
          JSON.stringify({ status: x.status, statusText: x.statusText }),
        )
      : x.json(),
  )
  .then((x) => TicketsResponseSchema.parse(x));

console.log(
  JSON.stringify({
    activeTickets: getActiveTickets(result.tickets, new Date()).map(
      (x) => x.activeTo,
    ),
  }),
);

// await page.screenshot({ path: "example.png" });
