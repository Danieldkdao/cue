import { Column, ColumnBaseConfig, ColumnDataType } from "drizzle-orm";
import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

export type TableProperty = Column<
  ColumnBaseConfig<ColumnDataType, string>,
  object,
  object
>;

export type GetTableName<T> = T extends SQLiteTable ? T["_"]["name"] : never;

export type TableIdColumn<TableName extends string> = SQLiteColumn<{
  name: "id";
  tableName: TableName;
  dataType: "string";
  columnType: "SQLiteText";
  data: string;
  driverParam: string;
  notNull: boolean;
  hasDefault: boolean;
  isPrimaryKey: boolean;
  isAutoincrement: boolean;
  hasRuntimeDefault: boolean;
  enumValues: string[] | undefined;
  baseColumn: never;
  identity: undefined;
  generated: undefined;
}>;
