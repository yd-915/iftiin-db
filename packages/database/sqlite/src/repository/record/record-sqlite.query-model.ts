import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ReferenceFieldTypes,
  Table,
  ViewId,
} from '@egodb/core'
import { WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { INTERNAL_COLUMN_NAME_TOTAL } from './record.constants.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(
    table: Table,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<IQueryRecords> {
    const tableId = table.id.value
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em.fork(), table, spec, viewId?.value)
    builder = await builder.select().from().where().reference().sort().expand(referenceField).build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    return RecordSqliteMapper.toQueries(tableId, schema, data)
  }

  async findAndCount(
    table: Table,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<{ records: IQueryRecords; total: number }> {
    const tableId = table.id.value
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em.fork(), table, spec, viewId?.value)
    builder = await builder.select().from().where().reference().sort().expand(referenceField).build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    const tb = await builder.clone().from().where().count().build()
    const td = await this.em.execute<{ total: number }[]>(tb.qb.first())

    const records = RecordSqliteMapper.toQueries(tableId, schema, data)
    const total = td[0]?.[INTERNAL_COLUMN_NAME_TOTAL]

    return { records, total: total }
  }

  async findOne(table: Table, spec: IRecordSpec): Promise<Option<IQueryRecordSchema>> {
    const tableId = table.id.value
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em.fork(), table, spec)
    builder = await builder.select().from().where().reference().build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(table: Table, id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(table, WithRecordId.fromString(id))
  }
}
