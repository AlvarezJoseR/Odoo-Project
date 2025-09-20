require('dotenv').config();
const express = require('express')
const apiRoutes = require('./routers/api.routes.js')
const app = express()
const port = process.env.PORT;
app.use(express.json());


//Routes
app.use('/api', apiRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
