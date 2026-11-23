export { cn } from "cn";

export const isValidDate = (date: unknown): date is Date =>
  date instanceof Date && !isNaN(date.getTime());

export const writeCursor = (data: unknown) => {
  const jsonData = JSON.stringify(data);
  return Buffer.from(jsonData).toString("base64url");
};

export const normalizeData = (data: unknown) => {
  if (isValidDate(data)) return data.toISOString();

  return data;
};

export const wrapCode = (code: string, language?: string | null) =>
  `${"```"}${language ? language : ""}${"\n"}${code}${"\n```"}`;
