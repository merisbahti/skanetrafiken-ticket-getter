import { z } from "zod";

export const TicketSchema = z.object({
  addons: z.array(z.unknown()),
  travellers: z.array(z.unknown()),
  bearerCategory: z.string(),
  ticketLoanStatus: z.union([z.literal(1), z.literal(0)]),
  ticketLoanInfo: z.union([
    z.object({
      returnDate: z.string(),
      name: z.string(),
      transferred: z.boolean(),
      returned: z.boolean(),
    }),
    z.null(),
  ]),
  isConnectedToAccount: z.boolean(),
  status: z.number(),
  isLenaTicket: z.boolean(),
  activated: z.string(),
  created: z.string(),
  offerId: z.string(),
  priceId: z.string(),
  priceModelId: z.string(),
  ticketType: z.string(),
  namePartsOnSv: z.string(),
  namePartsOnEn: z.string(),
  namePartsPnSv: z.string(),
  namePartsPnEn: z.string(),
  stopPoints: z.array(z.object({})),
  zones: z.array(z.object({})),
  ticketId: z.string(),
  blocked: z.unknown(),
  activeTo: z.string(),
  activationIntervalTo: z.union([z.string(), z.null()]),
  amount: z.number(),
  currency: z.string(),
  firstClassAddons: z.unknown(),
  isActiveOrActivated: z.boolean(),
  isSeasonTicket: z.boolean(),
});

export type Ticket = z.TypeOf<typeof TicketSchema>;

export const TicketsResponseSchema = z.object({
  tickets: z.array(TicketSchema),
});

export type TicketResponse = z.TypeOf<typeof TicketsResponseSchema>;
