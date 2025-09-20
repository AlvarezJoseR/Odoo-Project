require('dotenv').config();
const express = require('express')
const customerRouters = require('./routers/customers.routes.js')
const authRouters = require('./routers/auth.routes.js')
const companyRouters = require('./routers/company.routes.js')
const bankAccountRouters = require('./routers/bankAccount.routes.js')
const apiRoutes = require('./routers/api.routes.js')
const app = express()
const port = process.env.PORT;
const cookieSession = require('cookie-session');

app.use(express.json());
app.use(cookieSession({
    name: 'session',                  
    keys: [process.env.COOKIE_SECRET_KEY],        
    maxAge: process.env.COOKIE_LIVE_TIME       
}));

//Routes
app.use('/customer', customerRouters);
app.use('/auth', authRouters)
app.use('/company', companyRouters)
app.use('/bankAccount', bankAccountRouters)
app.use('/api', apiRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
