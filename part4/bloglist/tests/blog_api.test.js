//to perform integration testing on the Blog List backend endpoints (/api/blogs), ensuring the server and database work together correctly over HTTP.

const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})



test('blogs are returned as json and correct amount is returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})



test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogToTest = response.body[0]

  // Verify that 'id' is defined
  assert.notStrictEqual(blogToTest.id, undefined)
  // Verify that '_id' has been removed
  assert.strictEqual(blogToTest._id, undefined)
})



test('a valid block can be added', async () => {
    const newBlog = {
      title : 'Canonical string reduction',
      author : 'Edsger W. Dijkstra',
      url : 'http://www.cs.utexas.edu/users/EWD/ewd06xx/EWD687.json',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Canonical string reduction'))
})



test('blog without likes property defaults to 0 likes', async () => {
  const newBlog = {
    title : 'First class tests',
    author : 'Robert C. Martin',
    url : 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDrivenDevelopment.html'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type' , /application\/json/)

  assert.strictEqual(response.body.likes , 0)
})



test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDrivenDevelopment.html',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})



test('blog without url is not added', async () =>{
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length , helper.initialBlogs.length)
})



describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length , helper.initialBlogs.length -1)

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
    })
})



describe('updating a blog', () => {
    test('succeeds in updating likes for a blog post', async() => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlogData = {
            title : blogToUpdate.title ,
            author : blogToUpdate.author ,
            url : blogToUpdate.url ,
            likes : blogToUpdate.likes + 1 
        }

        const response = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedBlogData)
          .expect(200)
          .expect('Content-Type' , '/application\/json')

        assert.strictEqual(response.body.likes , blogToUpdate.likes + 1)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
    })
})

after(async () => {
  await mongoose.connection.close()
})