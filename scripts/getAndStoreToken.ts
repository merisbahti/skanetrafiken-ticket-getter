import "dotenv";
import { getSkanetrafikenToken } from "../src/getSkanetrafikenToken.ts";
import { kv } from "@vercel/kv";

const username = process.env["USERNAME"];
const password = process.env["PASSWORD"];
const executablePath = process.env["EXECUTABLE_PATH"];

if (!username || !password || !executablePath)
  throw new Error("Both `USERNAME` and `PASSWORD` need to be defined in env`");

console.log("Generating and caching token");
const jwtToken = await getSkanetrafikenToken({
  username,
  password,
  executablePath,
});

kv.set("skanetrafiken-token", jwtToken);
