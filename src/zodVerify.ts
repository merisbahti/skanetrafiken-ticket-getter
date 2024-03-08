import { z } from "zod";

/*
  A zod safeParse which doesn't strip unused data.
*/
export const zodVerify = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  data: unknown,
): z.SafeParseReturnType<Schema["_type"], Schema["_type"]> => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data };
  }
  return result;
};
