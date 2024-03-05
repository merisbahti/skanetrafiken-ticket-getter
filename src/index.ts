import "dotenv";
import { getSkanetrafikenToken } from "./get-skanetrafiken-token";
import { ResponseSchema } from "./types";

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
  .then((x) => x.json())
  .then((x) => ResponseSchema.parse(x));

console.log(JSON.stringify(result, null, 2));

// await page.screenshot({ path: "example.png" });
