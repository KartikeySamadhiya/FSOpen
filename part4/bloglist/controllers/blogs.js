//Handles network requests & HTTP responses

const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user' , {username : 1 , name : 1})

  response.json(blogs)
})



const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if( authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', async(request, response, next) => {
    const body = request.body
    
  try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token , process.env.SECRET)

    if( !decodedToken.id ){
      return response.status(401).json({ error : 'token invalid'})
    }


    const user = await User.findById(decodedToken.id)

    if( !user ){
      return response.status(404).json({ error : 'user not found' })
    }


    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception) // Forwards ValidationError (400) to utils/middleware.js
  }
})



blogsRouter.delete('/:id', async(request , response, next) => {
    try{
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch(exception){
      next(exception)
    }
})



blogsRouter.put('/:id' , async(request , response , next) => {
    const body = response.body

    const blog = {
        title : body.title ,
        author : body.author ,
        url : body.url ,
        likes : body.likes || 0
    }

    try{
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id ,
            blog ,
            { new : true , runValidators : true , context : 'query'}
        )
        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(404).end()
        }
    }catch (exception) {
        console.log('PUT ERROR:', exception)
        next(exception)
    }
})

module.exports = blogsRouter