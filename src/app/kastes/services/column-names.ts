export const TABLE_COLUMNS = ['kods', 'adrese', 'yellow', 'rose', 'white'] as const;

export type ColumnNames = (typeof TABLE_COLUMNS)[number];
