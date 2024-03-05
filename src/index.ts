import "dotenv";
import { getSkanetrafikenToken } from "./getSkanetrafikenToken";
import { TicketsResponseSchema } from "./types";

const username = process.env["USERNAME"];
const password = process.env["PASSWORD"];
const executablePath = process.env["EXECUTABLE_PATH"];

if (!username || !password || !executablePath)
  throw new Error("Both `USERNAME` and `PASSWORD` need to be defined in en`");

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

console.log(JSON.stringify(result, null, 2));

// await page.screenshot({ path: "example.png" });
