import type { BoolField, DateField, DateRangeField, Field, NumberField, SelectField, StringField } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import {
  UNDERLYING_COLUMN_CREATED_AT_NAME,
  UNDERLYING_COLUMN_ID_NAME,
  UNDERLYING_COLUMN_UPDATED_AT_NAME,
} from '../../constants'
import type { IUnderlyingColumn } from '../../types/underlying-column'

export abstract class UnderlyingColumn implements IUnderlyingColumn {
  abstract get name(): string
  abstract build(tb: Knex.TableBuilder, knex: Knex, tableName: string): Knex.ColumnBuilder
}

export class UnderlyingIdColumn extends UnderlyingColumn {
  get name(): string {
    return UNDERLYING_COLUMN_ID_NAME
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.string(this.name).notNullable().primary()
  }
}

export class UnderlyingCreatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return UNDERLYING_COLUMN_CREATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): Knex.ColumnBuilder {
    return tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingUpdatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return UNDERLYING_COLUMN_UPDATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex, tableName: string): Knex.ColumnBuilder {
    const cb = tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())

    knex.raw(`
    CREATE TRIGGER update_at_update AFTER UPDATE ON ${tableName}
    BEGIN
      update ${tableName} SET updated_at = datetime('now') WHERE ${UNDERLYING_COLUMN_ID_NAME} = NEW.${UNDERLYING_COLUMN_ID_NAME};
    END;
    `)

    return cb
  }
}

abstract class UnderlyingFieldColumn<F extends Field> implements IUnderlyingColumn {
  constructor(protected readonly field: F) {}
  get name(): string {
    return this.field.id.value
  }
  abstract build(tb: Knex.TableBuilder, knex: Knex, tableName: string): Knex.ColumnBuilder
}

export class UnderlyingStringColumn extends UnderlyingFieldColumn<StringField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.string(this.name)
  }
}

export class UnderlyingNumberColumn extends UnderlyingFieldColumn<NumberField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.float(this.name)
  }
}

export class UnderlyingBoolColumn extends UnderlyingFieldColumn<BoolField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.boolean(this.name)
  }
}

export class UnderlyingDateColumn extends UnderlyingFieldColumn<DateField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.dateTime(this.name)
  }
}

export class UnderlyingDateRangeFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): string {
    return super.name + '_from'
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.dateTime(this.name)
  }
}

export class UnderlyingDateRangeToFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): string {
    return super.name + '_to'
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.dateTime(this.name)
  }
}

export class UnderlyingSelectFromColumn extends UnderlyingFieldColumn<SelectField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.string(this.name)
  }
}
