const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    registrationDate: {type: Date, required: true},
    lastLogin: {type: Date, required: false},
    isBanned: {type: Boolean, required: true},
    role: {type: Array, required: true},
})

userSchema.pre('save', async function (next)  {
    const user = this
    this.password = await bcrypt.hash(user.password, 10)
    next()
})

userSchema.methods.isValidPassword = async function (password) {
    const user = this
    return await bcrypt.compare(password, user.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
