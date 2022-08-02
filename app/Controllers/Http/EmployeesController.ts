import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Employee from 'App/Models/Employee'

export default class EmployeesController {
  public async getAllEmployees({ auth }: HttpContextContract) {
    try {
      await auth.user?.load('employees')
      console.log(auth.user?.employees)
      return auth.user!.employees
    } catch (err) {
      return err
    }
  }

  public async createEmployee({ auth, request }: HttpContextContract) {
    const newEmployeeSchema = schema.create({
      fullName: schema.string({ trim: true }, [rules.minLength(2)]),
      age: schema.number(),
    })

    try {
      const payload = await request.validate({ schema: newEmployeeSchema })
      console.log(payload)
      const employee = new Employee()
      employee.fullName = payload.fullName
      employee.age = payload.age
      employee.userId = auth.user!.id
      await employee.save()
      return employee
    } catch (error) {
      console.log(error)
      return error
    }
  }

  public async updateEmployee({ request }: HttpContextContract) {
    const newEmployeeSchema = schema.create({
      fullName: schema.string({ trim: true }, [rules.requiredIfExists('fullName')]),
      age: schema.number([rules.requiredIfExists('age')]),
    })
    try {
      const payload = await request.validate({ schema: newEmployeeSchema })

      const employeeId = request.param('employeeId')
      const employeeToBeUpdated = await Employee.findOrFail(employeeId)
      await employeeToBeUpdated.merge({ ...payload }).save()
    } catch (err) {
      return err
    }
  }

  public async deleteEmployee({ request }: HttpContextContract) {
    try {
      const employeeToBeDeleted = await Employee.find(request.param('employeeId'))
      await employeeToBeDeleted?.delete()
    } catch (err) {
      return err
    }
  }
}
