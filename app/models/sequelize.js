import UserModel from './user.js'
import { Sequelize, DataTypes } from 'sequelize'
import usersCollection from '../init-bd/userCollection.js'

const sequelize = new Sequelize('sxwyolpj', 'sxwyolpj', 'fM1XISrckqK8wu2vuK6cqEwUG-aGLxTd', {
  dialect: 'postgres',
  host: 'kandula.db.elephantsql.com',
  define: {
    timestamps: false
  }
})

const User = UserModel(sequelize, DataTypes)

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!')
    User.bulkCreate(usersCollection)
      .then(() => User.findAll())
      .then((user) => console.log(user))
      .catch(err => console.log(err))
  })

export default User
