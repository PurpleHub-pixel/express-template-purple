const passport = require('passport');
const LocalStrategy = require('passport-local');
const { prismaClient } = require('./prisma.service');
const { compareHash } = require('./bcrypt.service');

const localPassport = passport;

localPassport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async function verify(username, password, cb) {
    const lookingUser = await prismaClient.user.findFirst({
        where: {
            email: username
        }
    })

    const isPasswordCorrect = await compareHash(password, lookingUser.password);
    if (!isPasswordCorrect) {
        return cb(null, false, {
            message: 'Invalid Credentials!'
        })
    }

    return cb(null, { id: lookingUser.id })
}))

localPassport.serializeUser(function (user, cb) {
    cb(null, { id: user.id });
});

localPassport.deserializeUser(async function (user, cb) {
    const fetchedUser = await prismaClient.user.findFirst({
        where: {
            id: user.id
        }
    })
    if (!fetchedUser) {
        return cb(null, false);
    }
    return cb(null, fetchedUser);
});

module.exports = { localPassport }