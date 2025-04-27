import { Ticket } from "./types.ts";

export const getActiveTickets = (
  tickets: Array<Ticket>,
  currentDate: Date,
): Array<Ticket> =>
  tickets.filter(
    (x) => x.activated !== null && x.activeTo && new Date(x.activeTo) > currentDate && x.ticketLoanInfo === null,
  );
