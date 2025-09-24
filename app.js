require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT;
const cookieSession = require('cookie-session');

//Routes
const customerRoutes = require('./routers/customers.routes.js');
const authRoutes = require('./routers/auth.routes.js');
const bankAccountRoutes = require('./routers/bankAccount.routes.js');
const productRoutes = require('./routers/product.routes.js');
const invoiceRoutes = require('./routers/invoices.routes.js');
const attachmentRoutes = require('./routers/Attachment.routes.js');
const helpRoutes = require('./routers/util.routes.js');

//Db Connection
const dbConnection = require('./db/db.connection.js');

app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SECRET_KEY],
  maxAge: process.env.COOKIE_LIVE_TIME
}));

dbConnection.inicializar(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
  }
);

//Routes
app.use('/customer', customerRoutes);
app.use('/auth', authRoutes);
app.use('/bank-account', bankAccountRoutes)
app.use('/product', productRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/attachment', attachmentRoutes);
app.use('/help', helpRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
