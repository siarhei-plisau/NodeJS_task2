import { Op } from 'sequelize'

export default class UserService {
  constructor (User) {
    this.User = User
    this.showAllUsers = this.showAllUsers.bind(this)
    this.createUser = this.createUser.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.searchById = this.searchById.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.getAutoSuggestUsers = this.getAutoSuggestUsers.bind(this)
  }

  showAllUsers (req, res) {
    this.User.findAll().then(allUsers => res.send(allUsers))
  }

  createUser (req, res) {
    this.User.create({
      login: req.body.login,
      password: req.body.password,
      age: req.body.age
    })
      .then(user => res.json(user))
      .catch(err => res.status(400).send(err))
  }

  removeUser (req, res) {
    this.User.findOne({ where: { id: req.params.id, isDeleted: false } })
      .then(user => user.update({ isDeleted: true }))
      .then(user => res.sendStatus(200).send(`User with ID: ${req.params.id} was removed`))
      .catch(() => res.status(404).send(`User with ID: ${req.params.id} was not found`))
  }

  searchById (req, res) {
    this.User.findOne({ where: { id: req.params.id, isDeleted: false } })
      .then(user => res.json(user))
      .catch(() => { res.status(400).send(`User with ID: ${req.params.id} was not found`) })
  }

  updateUser (req, res) {
    this.User.update({ ...req.body }, { where: { id: req.params.id, isDeleted: false } })
      .then(user => {
        if (user[0] !== 0) res.sendStatus(200).send(`User with ID: ${req.params.id} was updated`)
        else res.status(404).send(`User with ID: ${req.params.id} was not found`)
      })
      .catch(err => console.log(err))
  }

  getAutoSuggestUsers (loginSubstring, limit, res) {
    this.User.findAll({
      limit: limit,
      where: {
        login: { [Op.substring]: `${loginSubstring}` }
      },
      raw: true
    })
      .then(user => res.json(user))
      .catch(err => console.log(err))
  }
}
