const express = require('express')
const router = express.Router()

const checkJwt = require('../plugins/checkJWT')

const Collection = require('../models/collectionSchema')
const User = require("../models/userSchema")
const Comment = require("../models/commentSchema")
const Like = require('../models/likeSchema')

const jwt = require("jsonwebtoken")

const checkUserAccessCollection = async (req, res, next) => {
    try {
        const jwtToken = req.header(process.env.JWT_HEADER)
        const { userId } = await jwt.verify(jwtToken, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: userId })

        const { collectionId } = req.body
        const userCollection = await Collection.findOne({ _id: collectionId })

        if (userCollection.userId !== userId && !user.role.includes('admin')) {
            return res.status(403).json({ message: 'Access denied' })
        }
        return next()
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const checkUserAccessComment = async (req, res, next) => {
    try {
        const jwtToken = req.header(process.env.JWT_HEADER)
        const { userId } = await jwt.verify(jwtToken, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: userId })

        const { commentId } = req.body
        const userComment = await Comment.findOne({ _id: commentId })

        if (userComment.userId !== userId && !user.role.includes('admin')) {
            return res.status(403).json({ message: 'Access denied' })
        }
        return next()
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

router.post('/createCollection', checkJwt, async (req, res) => {
    try {
        const jwtToken = req.header(process.env.JWT_HEADER)
        const decoded = await jwt.verify(jwtToken, process.env.SECRET_KEY)
        const { fields, name, description, items } = req.body

        const currUser = await User.findOne({ _id: decoded.userId })

        const newCollection = new Collection({
            userId: decoded.userId,
            username: currUser.username,
            createdDate: new Date(),
            likes: 0,
            name,
            description,
            fields,
            items,
        })
        await newCollection.save()

        return res.status(200).json({ collection: newCollection })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/editCollection', checkJwt, checkUserAccessCollection, async (req, res) => {
    try {
        const { fields, name, description, items, collectionId } = req.body
        await Collection.updateOne({ _id: collectionId}, {
            $set: {
                name,
                fields,
                description,
                items,
            }
        })
        return res.status(200).json({ message: 'Update success' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getCollectionById', async (req, res) => {
    try {
        const { collectionId } = req.body
        const collection = await Collection.findOne({ _id: collectionId })

        res.status(200).json(collection)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.get('/getCollections', async (req, res) => {
    try {
        const collections = await Collection.find()

        return res.status(200).json({ collections })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getCollectionByUserId', async (req, res) => {
    try {
        const { userId } = req.body
        const collections = await Collection.find({ userId })
        return res.status(200).json({ collections })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/deleteCollection', checkJwt, checkUserAccessCollection, async (req, res) => {
    try {
        const { collectionId } = req.body

        await Collection.deleteOne({ _id: collectionId })
        await Like.deleteMany({ collectionId: { $in: collectionId } })
        await Comment.deleteMany({ collectionId: { $in: collectionId } })

        const collections = await Collection.find()
        res.status(200).json({ collections })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/postComment', checkJwt, async (req, res) => {
    try {
        const { collectionId, comment } = req.body
        const jwtToken = req.header(process.env.JWT_HEADER)

        const { userId } = await jwt.verify(jwtToken, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: userId})
        const newComment = new Comment({
            userId,
            username: user.username,
            collectionId,
            createdDate: new Date(),
            comment,
        })
        await newComment.save()

        const commentsList = await Comment.find({ collectionId })

        return res.status(200).json({ comments: commentsList })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/editComment', checkJwt, checkUserAccessComment, async (req, res) => {
    try {
        const { comment, commentId, collectionId } = req.body
        await Comment.updateOne({ _id: commentId }, {
            $set: {
                comment
            }
        })
        const commentsList = await Comment.find({ collectionId })
        return res.json({ comments: commentsList })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/deleteComment', checkJwt, checkUserAccessComment, async (req, res) => {
    try {
        const { commentId, collectionId } = req.body
        await Comment.deleteOne({ _id: commentId })

        const commentsList = await Comment.find({ collectionId })
        return res.json({ comments: commentsList })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getCommentsByCollectionId', async (req, res) => {
    try {
        const { collectionId } = req.body
        const commentsList = await Comment.find({ collectionId })
        return res.json({ comments: commentsList })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getLikeCollectionById', checkJwt, async (req, res) => {
    try {
        const { collectionId } = req.body
        const jwtToken = req.header(process.env.JWT_HEADER)
        const { userId } = await jwt.verify(jwtToken, process.env.SECRET_KEY)

        const newLike = new Like ({
            userId,
            collectionId
        })
        await newLike.save()

        const collectionLikesLength = await Like.find({ collectionId }).count()
        const updatedCollection = await Collection.findOneAndUpdate({ _id: collectionId }, {
            $set: {
                likes: collectionLikesLength
            }
        }, { returnDocument: 'after' })
        const userLikes = await Like.find({ userId })

        return res.status(200).json({ collection: updatedCollection, likedCollection: userLikes })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getUnlikeCollectionById', checkJwt, async (req, res) => {
    try {
        const { collectionId } = req.body
        const jwtToken = req.header(process.env.JWT_HEADER)
        const { userId } = await jwt.verify(jwtToken, process.env.SECRET_KEY)

        await Like.deleteOne({ collectionId, userId })

        const collectionLikesLength = await Like.find({ collectionId }).count()
        const updatedCollection = await Collection.findOneAndUpdate({ _id: collectionId }, {
            $set: {
                likes: collectionLikesLength
            }
        }, { returnDocument: 'after' })
        const userLikes = await Like.find({ userId })

        return res.status(200).json({ collection: updatedCollection, likedCollection: userLikes })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getManyCollectionsByIds', async (req, res) => {
    try {
        const { collectionIdsArr } = req.body
        const collections = await Collection.find({ _id: { $in: collectionIdsArr} })
        return res.status(200).json({ collections })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.post('/getGlobalSearch', async (req, res) => {
    try {
        const { searchValue } = req.body
        const collections = await Collection.find({ name: { $regex: new RegExp(searchValue, 'i') } }).limit(3)
        const comments = await Comment.find({ comment: { $regex: new RegExp(searchValue, 'i') } }).limit(3)
        return res.status(200).json({ collections, comments})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router