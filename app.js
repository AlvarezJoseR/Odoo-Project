require('dotenv').config();
const express = require('express')
const customerRouters = require('./routers/customers.routes.js')
const authRouters = require('./routers/auth.routes.js')
const companyRouters = require('./routers/company.routes.js')
const cookieSession = require('cookie-session');
const app = express()
const port = 3000
app.use(express.json());
app.use(cookieSession({
    name: 'session',                  
    keys: ['claveSecreta123'],        
    maxAge: 60 * 60 * 1000       
}));

app.use('/customer', customerRouters);
app.use('/auth', authRouters)
app.use('/company', companyRouters)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
