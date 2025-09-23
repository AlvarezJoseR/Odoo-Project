require('dotenv').config();
const express = require('express')
const apiRoutes = require('./routers/api.routes.js')
const app = express()
const port = process.env.PORT;
const cookieSession = require('cookie-session');

//Routes
const customerRoutes = require('./routers/customers.routes.js');
const authRoutes = require('./routers/auth.routes.js');
const bankAccountRoutes = require('./routers/bankAccount.routes.js');
const productRoutes = require('./routers/product.routes.js');
const invoiceRoutes = require('./routers/invoices.routes.js');

app.use(express.json());
app.use(cookieSession({
    name: 'session',                  
    keys: [process.env.COOKIE_SECRET_KEY],        
    maxAge: process.env.COOKIE_LIVE_TIME       
}));

//Routes
//app.use('/api', apiRoutes)
app.use('/customer', customerRoutes);
app.use('/auth', authRoutes);
app.use('/bank-account', bankAccountRoutes)
app.use('/product', productRoutes);
app.use('/invoice', invoiceRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
