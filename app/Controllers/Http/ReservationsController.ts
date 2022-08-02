import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Reservation from 'App/Models/Reservation'
import ReservationService from 'App/Models/ReservationService'
import Service from 'App/Models/Service'

export default class ReservationsController {
  public async getAllReservations({ auth }: HttpContextContract) {
    try {
      await auth.user?.load('reservations', (res) => {
        res.preload('employee')
      })
      //   return auth.user?.reservations.length
      let allReservations: any = []

      for (let i = 0; i < auth.user!.reservations.length; i++) {
        let currentReservationId: number
        currentReservationId = auth.user!.reservations[i].id
        const allResSerPairs = await ReservationService.query().where(
          'reservation_id',
          currentReservationId
        )
        const servicesArray: Service[] = []
        for (let j = 0; j < allResSerPairs.length; j++) {
          servicesArray.push((await Service.find(allResSerPairs[j].serviceId))!)
        }
        console.log(servicesArray)
        let initial = 0
        for (let i = 0; i < servicesArray.length; i++) {
          initial += servicesArray[i].estimatedTime
        }
        allReservations.push({
          ...auth.user!.reservations[i].$attributes,
          employee: auth.user?.reservations[i].$preloaded,
          services: servicesArray,
          estimatedServiceTime: initial,
        })
      }
      console.log(allReservations)
      return allReservations
    } catch (err) {
      return err
    }
  }

  public async createReservation({ auth, request }: HttpContextContract) {
    const newReservationSchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2)]),
      employeeId: schema.number([rules.required()]),
      serviceIds: schema.array([rules.minLength(1)]).members(schema.number()),
    })

    try {
      const control = await request.validate({ schema: newReservationSchema })
      const reservation = new Reservation()
      reservation.name = control.name
      reservation.userId = auth.user!.id
      reservation.employeeId = control.employeeId
      //Constructing many to many relationship between services and reservations
      await reservation.save().then((savedReservation) => {
        for (let i = 0; i < control.serviceIds.length; i++) {
          const newRelationShip = new ReservationService()
          newRelationShip.reservationId = savedReservation.id
          newRelationShip.serviceId = control.serviceIds[i]
          newRelationShip.save()
        }
      })
    } catch (error) {}
  }

  public async updateReservation({ request }: HttpContextContract) {
    const newReservationSchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2), rules.requiredIfExists('name')]),
      employeeId: schema.number([rules.requiredIfExists('employeeId')]),
      serviceIds: schema.array([rules.requiredIfExists('serviceIds')]).members(schema.number()),
    })
    const payload = await request.validate({ schema: newReservationSchema })
    try {
      const currentReservationId = request.param('reservationId')
      const oldPairsObjects = await ReservationService.query().where(
        'reservationId',
        currentReservationId
      )

      let oldPairs: any[] = []
      for (let i = 0; i < oldPairsObjects.length; i++) {
        oldPairs.push({
          reservationId: currentReservationId,
          serviceId: oldPairsObjects[i].serviceId,
        })
      }

      for (let i = 0; i < payload.serviceIds.length; i++) {
        const currentPair = {
          reservationId: currentReservationId,
          serviceId: payload.serviceIds[i],
        }

        if (!oldPairs.includes(currentPair)) {
          const newPair = new ReservationService()
          console.log(currentReservationId)
          newPair.reservationId = currentReservationId
          newPair.serviceId = payload.serviceIds[i]
          await newPair.save()
        }
        for (let i = 0; i < oldPairs.length; i++) {
          if (!payload.serviceIds.includes(oldPairs[i].serviceId)) {
            const serviceToBeDeleted = await ReservationService.findBy(
              'serviceId',
              oldPairs[i].serviceId
            )
            serviceToBeDeleted?.delete()
          }
        }
      }
      const updatedPart = { name: payload.name, employeeId: payload.employeeId }
      const reservationId = currentReservationId
      const reservationToBeUpdated = await Reservation.findOrFail(reservationId)
      await reservationToBeUpdated.merge({ ...updatedPart }).save()
    } catch (err) {
      console.log(err)
      return err
    }
  }

  public async deleteReservation({ request }: HttpContextContract) {
    try {
      const reservationToBeDeleted = await Reservation.find(request.param('reservationId'))
      await reservationToBeDeleted?.delete()
    } catch (err) {
      return err
    }
  }
}
