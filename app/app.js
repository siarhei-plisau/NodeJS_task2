import express from 'express'
import routers from './routers/routers.js'

const app = express()
const port = 3000
app.use(express.json())
routers(app)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
