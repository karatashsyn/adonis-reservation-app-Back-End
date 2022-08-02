/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//Register/login/logout
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout')

//EMPLOYEE ROUTES
Route.get('/employees', 'EmployeesController.getAllEmployees').middleware('auth')
Route.post('/employees/add', 'EmployeesController.createEmployee').middleware('auth')
Route.patch('/employees/:employeeId/update', 'EmployeesController.updateEmployee').middleware(
  'auth'
)
Route.delete('/employees/:employeeId/delete', 'EmployeesController.deleteEmployee').middleware(
  'auth'
)

//SERVICE ROUTES
Route.get('/services', 'ServicesController.getAllServices').middleware('auth')
Route.post('/services/add', 'ServicesController.createService').middleware('auth')
Route.patch('/services/:serviceId/update', 'ServicesController.updateService').middleware('auth')
Route.delete('/services/:serviceId/delete', 'ServicesController.deleteService').middleware('auth')
//RESERVATION ROUTES
Route.get('/reservations', 'ReservationsController.getAllReservations').middleware('auth')
Route.post('/reservations/add', 'ReservationsController.createReservation').middleware('auth')

Route.patch(
  '/reservations/:reservationId/update',
  'ReservationsController.updateReservation'
).middleware('auth')

Route.delete(
  '/reservations/:reservationId/delete',
  'ReservationsController.deleteReservation'
).middleware('auth')
