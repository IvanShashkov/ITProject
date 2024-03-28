const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")

const checkUserRole = (requiredRole) => async (req, res, next) => {
    const jwtToken = req.header(process.env.JWT_HEADER)
    const decoded = await jwt.verify(jwtToken, process.env.SECRET_KEY)
    const user = await User.findOne({ _id: decoded.userId })

    if (user.role.includes(requiredRole)) {
        return next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
}

module.exports = checkUserRole