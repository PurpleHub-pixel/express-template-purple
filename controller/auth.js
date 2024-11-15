const { Router } = require("express");
const { prismaClient } = require("../services/prisma.service");
const { generateHash } = require("../services/bcrypt.service");
const { localPassport } = require("../services/passport.service");

const router = Router()

// Auth Middleware

router.post('/login', localPassport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
})
)

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.json({
            message: 'Invalid Data'
        })
    }

    const lookingUser = await prismaClient.user.findFirst({
        where: {
            email
        }
    })
    if (lookingUser) {
        return res.json({
            message: 'User already Exists with this Email!'
        })
    }
    const hashPassword = await generateHash(password);
    const newUser = await prismaClient.user.create({
        data: {
            email,
            name,
            password: hashPassword
        }
    })

    return res.json({
        data: newUser,
        message: 'Account Created!'
    })
})

router.post('/refresh-token', (req, res) => {
    return res.json({
        data: {},
        message: 'Refresh Token'
    })
})

module.exports = { authRouter: router };