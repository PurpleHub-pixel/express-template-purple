

const AuthenticatedRequestOnly = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Not Authenticated'
        })
    }
    next()
}

module.exports = { AuthenticatedRequestOnly }