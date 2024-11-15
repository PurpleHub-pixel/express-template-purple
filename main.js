const express = require('express');
const { authRouter } = require('./controller/auth');
require('dotenv').config()
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser')
var session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { prismaClient } = require('./services/prisma.service');
const { localPassport } = require('./services/passport.service');
const { AuthenticatedRequestOnly } = require('./middlewares/protectedRoute');

// Middlewares
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prismaClient, {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    })
}))
app.use(localPassport.authenticate('session'));

// Auth Router
app.use('/auth/', authRouter);

app.get('/', AuthenticatedRequestOnly, (req, res) => {
    return res.json({
        data: []
    })
})

// Handling Not Found Routes
app.all('*', (req, res) => {
    return res.status(404).json({
        message: 'No Route Found!'
    })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        error: {
            message: err.message,
        }
    })
})

app.listen(PORT, () => {
    console.log(`App Running on PORT: ${PORT}`)
})