import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  ManyToMany,
  column,
  hasMany,
  manyToMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Reservation from './Reservation'
import Service from './Service'

export default class ReservationService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reservationId: number

  @column()
  public serviceId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Service)
  public services: BelongsTo<typeof Service>
}
