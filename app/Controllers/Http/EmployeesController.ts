import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Employee from 'App/Models/Employee'
import { validators } from 'App/utils/validationSchemas'

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
    try {
      const payload = await request.validate({ schema: validators.newEmployeeSchema })
      const employee = new Employee()
      const result = Object.assign({}, employee, {
        fullName: payload.fullName,
        age: payload.age,
        userId: auth.user!.id,
      })
      await result.save()
      return employee
    } catch (error) {
      console.log(error)
      return error
    }
  }

  public async updateEmployee({ request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: validators.newEmployeeSchema })
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
