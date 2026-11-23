import { KeysOfType } from "@/lib/types";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  like,
  lt,
  or,
  SQL,
  sql,
} from "drizzle-orm";
import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "./db";
import { SnippetSelectData } from "./schema";
import { GetTableName, TableIdColumn, TableProperty } from "./types";

export const indexSnippet = (s: SnippetSelectData) => {
  db.run(
    sql`DELETE FROM snippets_fts WHERE rowid = (SELECT rowid FROM snippets WHERE id = ${s.id})`,
  );
  db.run(sql`INSERT INTO snippets_fts(rowid, name, use_case, body, tags)
    SELECT rowid, name, use_case, body, tags FROM snippets WHERE id = ${s.id}`);
};

export const createSearchFilter = <
  T extends SQLiteTable,
  P extends KeysOfType<T, TableProperty>,
>(
  table: T,
  search: string,
  properties: P[],
) => {
  const trimmedSearch = search.trim();
  const searchTerm = `%${trimmedSearch}%`;
  return trimmedSearch
    ? or(
        ...properties.map((property) =>
          like(table[property] as TableProperty, searchTerm),
        ),
      )
    : undefined;
};

export const createInArrayFilter = <
  T extends SQLiteTable,
  P extends KeysOfType<T, TableProperty>,
  K,
>(
  table: T,
  array: readonly K[],
  property: P,
) =>
  array.length ? inArray(table[property] as TableProperty, array) : undefined;

export const createSortByMap = <
  T extends SQLiteTable & {
    id: TableIdColumn<GetTableName<T>>;
    pinned: SQLiteColumn;
  },
  P extends KeysOfType<T, TableProperty>,
  SortOptions extends {
    readonly option: string;
    order: "asc" | "desc";
    property: P;
  }[],
  K extends SortOptions[number]["option"],
  S,
>(
  table: T,
  nextCursor: { id: string; marker: S; pinned: 0 | 1 } | null,
  sortByOptions: SortOptions,
) =>
  Object.fromEntries(
    sortByOptions.map((option) => {
      const tableProperty = table[option.property] as TableProperty;

      const keys = [
        {
          column: table.pinned,
          order: "desc" as const,
          value: nextCursor?.pinned,
        },
        {
          column: tableProperty,
          order: option.order,
          value: nextCursor?.marker,
        },
        {
          column: table.id,
          order: option.order,
          value: nextCursor?.id,
        },
      ];

      const sortBy = keys.map((k) =>
        k.order === "asc" ? asc(k.column) : desc(k.column),
      );

      const cursorFilter =
        nextCursor != null
          ? or(
              ...keys.map((k, i) =>
                and(
                  ...keys
                    .slice(0, i)
                    .map((prev) => eq(prev.column, prev.value as S)),
                  k.order === "asc"
                    ? gt(k.column, k.value as S)
                    : lt(k.column, k.value as S),
                ),
              ),
            )
          : undefined;

      return [
        option.option,
        {
          sortBy,
          cursorFilter,
          nextCursorField: option.property,
        },
      ];
    }),
  ) as Record<
    K,
    {
      cursorFilter: SQL<unknown> | undefined;
      sortBy: SQL<unknown>[];
      nextCursorField: SortOptions[number]["property"];
    }
  >;
