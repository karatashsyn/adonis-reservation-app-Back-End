import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Reservation from './Reservation'
import User from './User'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public serviceName: string

  @column()
  public price: number

  @column()
  public estimatedTime: number

  @column()
  public userId: number

  @column()
  public reservationId: number

  @manyToMany(() => Reservation)
  public reservations: ManyToMany<typeof Reservation>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
