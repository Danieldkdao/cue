import z from "zod";

export const isValidId = (id: string | string[]) => {
  const idSchema = z.uuid();
  if (Array.isArray(id)) {
    return id.length > 0 && id.every((i) => idSchema.safeParse(i).success);
  }
  return idSchema.safeParse(id).success;
};
