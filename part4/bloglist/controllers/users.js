//controller to handle creating users with hashed passwords and retrieving user lists:
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/' , async(request , response) => {
    const users = await User
        .find({})
        .populate('blogs' , {url : 1 , title : 1 , author : 1})   //.populate() method in Mongoose replaces a referenced ObjectId in a document with the actual document data from another collection. It acts as Mongoose's equivalent to a SQL JOIN query.
    response.json(users)
})



usersRouter.post('/' , async(request , response, next) => {
    const {username , name, password} = request.body  

    if (!password){
        return response.status(400).json({error : 'password is required'})
    }

    if (password.length < 3){
        return response.status(400).json({
            error : 'password must be at least 3 characters long'
        })
    }

    if(!username || username.length <3){
        return response.status(400).json({
            error : 'username must be at least 3 characters long'
        })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error : 'expected `username` to be unique'
        })
    }

    try{
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password , saltRounds)

        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch(exception){
        next(exception)
    }
})

module.exports = usersRouter