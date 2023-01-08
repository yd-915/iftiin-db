import type { IFieldType } from '@egodb/core'
import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Table } from './table'

export enum FieldType {
  STRING,
  NUMBER,
  DATE,
  DATE_RANGE,
  SELECT,
  BOOL,
}

export const fieldTypeMap: Record<IFieldType, FieldType> = {
  string: FieldType.STRING,
  number: FieldType.NUMBER,
  date: FieldType.DATE,
  select: FieldType.SELECT,
  bool: FieldType.BOOL,
  'date-range': FieldType.DATE_RANGE,
}

@Entity({ tableName: 'fields' })
export class Field {
  @PrimaryKey()
  id!: string

  @ManyToOne(() => Table, { primary: true })
  table!: Table;

  [PrimaryKeyType]?: [string, string]

  @Property()
  name!: string

  @Enum(() => FieldType)
  type!: FieldType
}
