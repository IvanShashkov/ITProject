const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")

const checkJwt = async (req, res, next) => {
    try {
        const jwtToken = req.header(process.env.JWT_HEADER)
        const decoded = await jwt.verify(jwtToken, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: decoded.userId })
        if (user) {
            return next()
        } else {
            return res.status(500).json({ message: 'JWT Verify error' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'JWT Verify error' })
    }
}

module.exports = checkJwt