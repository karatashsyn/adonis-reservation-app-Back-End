import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Employee from './Employee'
import Reservation from './Reservation'
import Service from './Service'

export default class User extends BaseModel {
  @hasMany(() => Employee)
  public employees: HasMany<typeof Employee>

  @hasMany(() => Reservation)
  public reservations: HasMany<typeof Reservation>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public fullName: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
