import { KeysOfType } from "@/lib/types";
import {
  and,
  AnyColumn,
  asc,
  BinaryOperator,
  desc,
  eq,
  gt,
  inArray,
  like,
  lt,
  or,
  SQL,
  sql,
  SQLWrapper,
} from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
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
  T extends SQLiteTable & { id: TableIdColumn<GetTableName<T>> },
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
  nextCursor: { id: string; marker: S } | null,
  sortByOptions: SortOptions,
) =>
  Object.fromEntries(
    sortByOptions.map((option) => {
      const sqlWrapper =
        option.order === "asc"
          ? { sort: asc, cursor: gt }
          : { sort: desc, cursor: lt };
      const tableProperty = table[option.property] as TableProperty;

      const sortBy = [
        sqlWrapper.sort(tableProperty),
        sqlWrapper.sort(table.id),
      ];

      const cursorFilter =
        nextCursor?.marker && nextCursor?.id
          ? or(
              sqlWrapper.cursor(tableProperty, nextCursor.marker),
              and(
                eq(tableProperty, nextCursor.marker),
                sqlWrapper.cursor(table.id, nextCursor.id),
              ),
            )
          : undefined;

      return [
        option.option,
        {
          sortBy,
          cursorFilter,
          nextCursorField: option.property,
          wrapper: sqlWrapper,
        },
      ];
    }),
  ) as Record<
    K,
    {
      cursorFilter: SQL<unknown> | undefined;
      sortBy: SQL<unknown>[];
      nextCursorField: SortOptions[number]["property"];
      wrapper: {
        sort: (column: SQLWrapper | AnyColumn) => SQL;
        cursor: BinaryOperator;
      };
    }
  >;
