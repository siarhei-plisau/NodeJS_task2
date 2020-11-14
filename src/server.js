import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import * as Joi from 'joi'

import { createValidator } from 'express-joi-validation'

const app = express()
const port = 3000
const validator = createValidator()

const users = [
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    login: 'CSamha',
    password: 'cat_12345',
    age: 25,
    isDeleted: false
  },
  {
    id: '5765412b-24cd-48b6-ade0-4bd23f8b1d24',
    login: 'Ted',
    password: 'lion_54321',
    age: 30,
    isDeleted: false
  },
  {
    id: '3bce0eba-53bf-498d-9a69-119130c07a55',
    login: 'BSamha',
    password: '1cat_12345',
    age: 34,
    isDeleted: false
  },
  {
    id: '1b9d6bcd-bbfe-4b2d-9b5d-ab8dfbbd4bed',
    login: 'ASamha',
    password: '2cat_12345',
    age: 15,
    isDeleted: false
  }
]
const queryUserSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    .required()
})

const userSchema = Joi.object({
  login: Joi.string()
    .alphanum()
    .min(5)
    .max(10)
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{5,15}$/)
    .required(),
  age: Joi.number()
    .integer()
    .min(4)
    .max(130)
    .required()
})

const searchById = (req, res) => {
  const user = users.find(item => (item.id === req.params.id && item.isDeleted === false))
  if (user === undefined) res.status(404).send(`User with ID: ${req.params.id} was not found`)
  else res.send(user)
}

const creatObjUser = (responsBody, isDeleted = false, id = uuidv4()) => {
  return { id, ...responsBody, isDeleted }
}

const createUser = (req, res) => {
  if (!req.body) res.status(400).send({ message: 'Body request is empty' })
  const body = req.body
  users.push(creatObjUser(body))
  res.send('user was created!')
}

const removeUser = (req, res) => {
  const id = req.params.id
  const index = users.findIndex(item => (item.id === id && item.isDeleted === false))
  if (index === -1) res.status(404).send(`User with ID: ${req.params.id} was not found`)
  else users[index].isDeleted = true
  res.send('user was removed')
}

const updateUser = (req, res) => {
  const id = req.params.id
  const body = req.body
  const index = users.findIndex(item => (item.id === id && item.isDeleted === false))
  if (index === -1) res.status(400).send({ message: 'User was not found in the list' })
  else {
    Object.assign(users[index], body)
    res.send('user was updated')
  }
}

const getAutoSuggestUsers = (loginSubstring, limit) => {
  const arrayResult = users.filter(item => item.login.includes(loginSubstring))
    .sort((prev, next) => {
      if (prev.login < next.login) return -1
      if (prev.login > next.login) return 1
      return 0
    })
    .slice(0, limit)
  return arrayResult
}

const showAllUsers = (req, res) => {
  const resultUsers = users.filter(item => item.isDeleted === false)
  res.json(resultUsers)
}

app.use(express.json())
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
  .get(showAllUsers)
  .post(validator.body(userSchema), createUser)

app.route('/users/:id', validator.query(queryUserSchema))
  .get(searchById)
  .put(validator.body(userSchema), updateUser)
  .delete(removeUser)

app.route('/autosuggest')
  .get((req, res) => {
    const login = req.query.login
    const limit = req.query.limit
    const resultUsers = getAutoSuggestUsers(login, limit)
    res.send(resultUsers)
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
