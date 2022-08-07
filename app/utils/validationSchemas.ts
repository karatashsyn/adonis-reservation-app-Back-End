/* eslint-disable */
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export namespace validators {
  export const newReservationSchema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(2)]),
    employeeId: schema.number([rules.required()]),
    serviceIds: schema.array([rules.minLength(1)]).members(schema.number()),
  })

  export const newRegisterSchema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    fullName: schema.string({ trim: true }, [rules.minLength(4)]),
    password: schema.string({}, [rules.minLength(4)]),
  })

  export const newLoginSchema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({}, [rules.minLength(4)]),
  })

  export const newEmployeeSchema = schema.create({
    fullName: schema.string({ trim: true }, [rules.minLength(2)]),
    age: schema.number(),
  })

  export const newServiceSchema = schema.create({
    serviceName: schema.string({ trim: true }, [rules.minLength(2)]),
    price: schema.number([rules.required()]),
    estimatedTime: schema.number([rules.required()]),
  })
}

module.exports('reservationSchema')
