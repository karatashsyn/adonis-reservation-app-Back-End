import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { validators } from 'App/utils/validationSchemas'
export default class AuthController {
  public async register({ request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: validators.newRegisterSchema })
      const user = new User()
      const result = Object.assign({}, user, {
        email: payload.email,
        fullName: payload.fullName,
        password: payload.password,
      })
      await result.save()
    } catch (error) {
      console.log(error)
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: validators.newLoginSchema })
      const userInDB = await User.findByOrFail('email', payload.email)
      if (!(await Hash.verify(userInDB.password, payload.password))) {
        console.log('Invalid credentials')
        return response.unauthorized('Invalid credentials')
      }
      const token = await auth.use('api').generate(userInDB, { expiresIn: '4days' })
      console.log(token)
      return token.toJSON()
    } catch (err) {
      return err
    }
  }
  public async logout({ auth }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return {
        message: 'Logged out',
        revoked: true,
      }
    } catch (err) {
      return err
    }
  }
}
