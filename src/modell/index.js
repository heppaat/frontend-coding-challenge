import { z } from "zod";

export const PeopleSchema = z
  .object({
    name: z.string(),
  })
  .array();
