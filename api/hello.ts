import { getActiveTickets } from "../src/getActiveTickets.js";
import { getSkanetrafikenToken } from "../src/getSkanetrafikenToken.js";
import { TicketsResponseSchema } from "../src/types.js";

export async function GET(_request: Request) {
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

  return new Response(
    JSON.stringify({
      activeTickets: getActiveTickets(result.tickets, new Date()),
    }),
  );
}
