import "dotenv";
import { getSkanetrafikenToken } from "./getSkanetrafikenToken.js";
import { TicketsResponseSchema } from "./types.js";
import { getActiveTickets } from "./getActiveTickets.js";
import express from "express";

const app = express();

const port = process.env.PORT || 3000;
const username = process.env["USERNAME"];
const password = process.env["PASSWORD"];
const executablePath = process.env["EXECUTABLE_PATH"];

if (!username || !password || !executablePath)
  throw new Error("Both `USERNAME` and `PASSWORD` need to be defined in en`");

app.get("/", async (req, res) => {
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

  res.send(
    JSON.stringify({
      activeTickets: getActiveTickets(result.tickets, new Date()).map(
        (x) => x.activeTo,
      ),
    }),
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// await page.screenshot({ path: "example.png" });
