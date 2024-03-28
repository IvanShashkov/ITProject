const express = require('express')

const User = require('../models/userSchema')
const Like = require('../models/likeSchema')
const Comment = require('../models/commentSchema')
const Collection = require('../models/collectionSchema')

const router = express.Router()

const jwt = require('jsonwebtoken')
const checkJwt = require('../plugins/checkJWT')
const checkUserRole = require('../plugins/checkUserRole')

router.get('/jwtInit', async (req, res) => {
    try {
        const jwtToken = req.header(process.env.JWT_HEADER)
        const decoded = await jwt.verify(jwtToken, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: decoded.userId })
        const likedCollection =  await Like.find({ userId: decoded.userId })

        if (user) {
            res.status(200).json({ user, likedCollection })
        } else {
            res.status(200).json({ user: null })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/registration', async (req, res) => {
    try {
        const { username, password } = req.body
        const userAlreadyExist = Boolean(await User.findOne({ username }))

        if (userAlreadyExist) {
            return res.status(403).json({ message: 'User already exist' })
        }

        const newUser = new User({
            username: username,
            password: password,
            registrationDate: new Date(),
            isBanned: false,
            role: ['user'],
            likes: [],
        })
        await newUser.save()

        return res.status(200).json({
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(403).json({ message: 'User not found' })
        }

        const validatePassword = await user.isValidPassword(password)
        if (!validatePassword) {
            return res.status(403).json({ message: 'Wrong password' })
        }

        if (user.isBanned) {
            return res.status(403).json({ message: 'User is banned' })
        }

        await User.updateOne(
            {username: { $in: user.username}},
            { $set: { lastLogin: new Date()}}
        )
        const likedCollection = await Like.find({ userId: user._id })

        const jwtToken = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY)
        return res.status(200).json({
            user,
            likedCollection,
            jwt: jwtToken,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.get('/users', checkJwt, checkUserRole('admin'), async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/ban', checkJwt, checkUserRole('admin'), async (req, res) => {
    try {
        const { idCollection } = req.body

        await User.updateMany(
            {_id: { $in: idCollection}},
            { $set: { isBanned: true}}
        )
        const updatedUsers = await User.find()

        return res.status(200).json({ users: updatedUsers })
    } catch (error) {
        return res.status(500).json({ message: 'Request failed' })
    }
})

router.post('/unban', checkJwt, checkUserRole('admin'), async (req, res) => {
    try {
        const { idCollection } = req.body

        await User.updateMany(
            {_id: { $in: idCollection}},
            { $set: { isBanned: false}}
        )
        const updatedUsers = await User.find()

        return res.status(200).json({ users: updatedUsers })
    } catch (error) {
        return res.status(500).json({ message: 'Request failed' })
    }
})

router.post('/getUserById', async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findOne({ _id: userId })
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/delete', checkJwt, checkUserRole('admin'), async (req, res) => {
    try {
        const { idCollection } = req.body

        await User.deleteMany({_id: { $in: idCollection}},)
        await Comment.deleteMany({userId: { $in: idCollection }})
        await Like.deleteMany({userId: { $in: idCollection }})
        await Collection.deleteMany({userId: { $in: idCollection }})

        const updatedUsers = await User.find()

        return res.status(200).json({ users: updatedUsers })
    } catch (error) {
        return res.status(500).json({ message: 'Request failed' })
    }
})

router.post('/setRoles', checkJwt, checkUserRole('admin'), async (req, res) => {
    try {
        const { idCollection, rolesArr } = req.body

        await User.updateMany(
            {_id: { $in: idCollection}},
            { $set: { role: rolesArr}}
        )
        const updatedUsers = await User.find()

        return res.status(200).json({ users: updatedUsers })
    } catch (error) {
        return res.status(500).json({ message: 'Request failed' })
    }
})

module.exports = router
