/* eslint-disable @typescript-eslint/no-empty-function */
import type { UrlField } from '@undb/core'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingDateColumn,
  UnderlyingEmailColumn,
  UnderlyingJsonColumn,
  UnderlyingMultiSelectColumn,
  UnderlyingNumberColumn,
  UnderlyingRatingColumn,
  UnderlyingSelectColumn,
} from '../underlying-column.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class UrlColumnTypeModifier extends BaseColumnTypeModifier<UrlField> {
  private readonly column = new UnderlyingEmailColumn(this.field.id.value, this.tableId)
  string(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.castTo('text', newColumn, this.column)
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  color(): void {
    const newColumn = new UnderlyingColorColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  email(): void {
    const newColumn = new UnderlyingEmailColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  url(): void {
    throw new Error('method not implemented.')
  }
  json(): void {
    const newColumn = new UnderlyingJsonColumn(this.field.id.value, this.tableId)
    this.castTo('text', newColumn, this.column)
  }
  date(): void {
    this.alterColumn(new UnderlyingDateColumn(this.field.id.value, this.tableId), this.column)
  }
  select(): void {
    this.alterColumn(new UnderlyingSelectColumn(this.field.id.value, this.tableId), this.column)
  }
  bool(): void {
    const newColumn = new UnderlyingBoolColumn(this.field.id.value, this.tableId)
    this.castTo('bool', newColumn, this.column)
  }
  reference(): void {
    this.dropColumn(this.column)
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  currency(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  attachment(): void {
    this.dropColumn(this.column)
  }
  collaborator(): void {
    this.castToCollaborator(this.column, 'email')
  }
  count(): void {
    this.dropColumn(this.column)
  }
  sum(): void {
    this.dropColumn(this.column)
  }
  average(): void {
    this.dropColumn(this.column)
  }
  lookup(): void {
    this.dropColumn(this.column)
  }

  ['multi-select'](): void {
    const newColumn = new UnderlyingMultiSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
