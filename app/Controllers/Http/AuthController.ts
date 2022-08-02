import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
export default class AuthController {
  public async register({ request }: HttpContextContract) {
    const newRegisterSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      fullName: schema.string({ trim: true }, [rules.minLength(4)]),
      password: schema.string({}, [rules.minLength(4)]),
    })
    try {
      const payload = await request.validate({ schema: newRegisterSchema })
      const user = new User()
      user.email = payload.email
      user.fullName = payload.fullName
      user.password = payload.password
      await user.save()
    } catch (error) {
      console.log(error)
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const newLoginSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string({}, [rules.minLength(4)]),
    })
    try {
      const payload = await request.validate({ schema: newLoginSchema })
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
