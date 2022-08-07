import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Service from 'App/Models/Service'
import { validators } from 'App/utils/validationSchemas'

export default class ServicesController {
  public async getAllServices({ auth }: HttpContextContract) {
    await auth.user?.load('services')
    return auth.user?.services
  }

  public async createService({ auth, request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: validators.newServiceSchema })
      console.log(payload)
      const service = new Service()
      service.serviceName = payload.serviceName
      service.price = payload.price
      service.estimatedTime = payload.estimatedTime
      service.userId = auth.user!.id
      await service.save()
      return service
    } catch (error) {
      console.log(error)
      return error
    }
  }

  public async updateService({ request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: validators.newServiceSchema })
      const serviceId = request.param('serviceId')
      const serviceToBeUpdated = await Service.findOrFail(serviceId)
      await serviceToBeUpdated.merge({ ...payload }).save()
    } catch (err) {
      return err
    }
  }

  public async deleteService({ request }: HttpContextContract) {
    try {
      const serviceToBeDeleted = await Service.find(request.param('serviceId'))
      await serviceToBeDeleted?.delete()
    } catch (err) {
      return err
    }
  }
}
