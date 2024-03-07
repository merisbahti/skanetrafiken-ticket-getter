import { Ticket } from "./types.js";

export const getActiveTickets = (
  tickets: Array<Ticket>,
  currentDate: Date,
): Array<Ticket> => tickets.filter((x) => new Date(x.activeTo) > currentDate);
