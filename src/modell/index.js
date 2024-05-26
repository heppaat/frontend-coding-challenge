import { z } from "zod";

const PersonSchema = z.object({
  name: z.string(),
});

export const PeopleSchema = PersonSchema.array();
