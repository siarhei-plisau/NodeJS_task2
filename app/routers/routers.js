import UserService from '../services/crud.js'
import User from '../models/sequelize'
import userIdSchema from './middleware/userIdSchema.js'
import userSchema from './middleware/userSchema.js'
import { createValidator } from 'express-joi-validation'

export default function routers (app) {
  const validator = createValidator()
  const userServiceInstance = new UserService(User)
  // app.use(express.json());
  app.route('/')
    .get((request, response) => {
      response.send(`<ol>
      <li>/     - index page,</li>
      <li>/users - GET without body and params (get all the users),</li>
      <li>/users - POST with body (creat user),</li>
      <li>/users/id  - GET (search user by id),</li>
      <li>/users/id - PUT with body (update user),</li>
      <li>/users/id - DELETE without body (remove user),</li>
      <li>/autosuggest?login=...&limit=... - GET (get auto-suggest soted list from limit users)</li>
    </ol>`)
    })

  app.route('/users')
    .get(userServiceInstance.showAllUsers)
    .post(validator.body(userSchema), userServiceInstance.createUser)

  app.route('/users/:id', validator.query(userIdSchema))
    .get(userServiceInstance.searchById)
    .put(validator.body(userSchema), userServiceInstance.updateUser)
    .delete(userServiceInstance.removeUser)

  app.route('/autosuggest')
    .get((req, res) => {
      const login = req.query.login
      const limit = req.query.limit
      userServiceInstance.getAutoSuggestUsers(login, limit, res)
    })
}
