import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  manyToMany,
  HasMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'
import Employee from './Employee'
import User from './User'
import ReservationService from './ReservationService'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public employeeId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  // @manyToMany(() => Service, {
  //   localKey: 'id',
  //   pivotForeignKey: 'user_id',
  //   relatedKey: 'id',
  //   pivotRelatedForeignKey: 'service_id',
  // })
  public services: ManyToMany<typeof Service>

  @belongsTo(() => Employee)
  public employee: BelongsTo<typeof Employee>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => ReservationService)
  public reservationServices: HasMany<typeof ReservationService>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
