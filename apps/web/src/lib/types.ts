import { SearchParams } from "nuqs";

export type SearchParamsProps = { searchParams: Promise<SearchParams> };

export type KeysOfType<T, Condition> = {
  [K in keyof T]-?: T[K] extends Condition ? K : never;
}[keyof T];
