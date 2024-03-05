import { Ticket } from "./types";

export const hasActiveTicket = (
  tickets: Array<Ticket>,
  currentDate: Date,
): boolean =>
  tickets.find((x) => x.activeTo > currentDate.toISOString()) !== undefined;
