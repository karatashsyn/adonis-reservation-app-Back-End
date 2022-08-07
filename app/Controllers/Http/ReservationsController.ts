import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reservation from 'App/Models/Reservation'
import ReservationService from 'App/Models/ReservationService'
import { validators } from 'App/utils/validationSchemas'

export default class ReservationsController {
  public async getReservation({ request }: HttpContextContract) {
    try {
      const gettedRes = await Reservation.find(request.param('reservationId'))
      await gettedRes?.load('employee')
      await gettedRes?.load('reservationServices', (resser) => {
        resser.preload('services')
      })
      let totalEstimatedTime = 0
      for (let i = 0; i < gettedRes?.reservationServices.length!; i++) {
        totalEstimatedTime += gettedRes?.reservationServices[i].services.estimatedTime!
      }
      return { Reservation: gettedRes?.$preloaded, totalEstimatedTime: totalEstimatedTime }
    } catch (err) {
      return err
    }
  }

  public async getAllReservations({ auth }: HttpContextContract) {
    try {
      await auth.user?.load('reservations', (res) => {
        res.preload('reservationServices', (resser) => {
          resser.preload('services')
        })
      })

      return auth.user?.reservations
    } catch (err) {
      return err
    }
  }

  public async createReservation({ auth, request }: HttpContextContract) {
    try {
      const control = await request.validate({ schema: validators.newReservationSchema })
      const reservation = new Reservation()
      const newReservation = {
        ...reservation,
        name: control.name,
        userId: auth.user!.id,
        employeeId: control.employeeId,
      }
      //Constructing many to many relationship between services and reservations
      await newReservation.save().then((savedReservation) => {
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
    const payload = await request.validate({ schema: validators.newReservationSchema })
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
      const currentReservationId = request.param('reservationId')
      const reservationToBeDeleted = await Reservation.find(request.param('reservationId'))
      await reservationToBeDeleted?.delete()
      await ReservationService.query().where('reservationId', currentReservationId).delete()
    } catch (err) {
      return err
    }
  }
}
