import { getActiveTickets } from "../src/getActiveTickets.js";

import { kv } from "@vercel/kv";
import { TicketsResponseSchema } from "../src/types.js";

export async function GET(_request: Request) {
  const token = await kv.get("skanetrafiken-token");
  const result = await fetch(
    "https://www.skanetrafiken.se/gw-bns/registered-app",
    {
      headers: { Authorization: `Bearer ${token}` },
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

  const activeTickets = getActiveTickets(result.tickets, new Date());
  return new Response(JSON.stringify({ activeTickets }), {
    headers: { "content-type": "application/json" },
  });
}
