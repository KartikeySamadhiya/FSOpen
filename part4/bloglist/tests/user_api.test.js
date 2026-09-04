const { test , describe , beforeEach , after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')


describe('when there is initially one user in db', () => {
    beforeEach(async () => {    //In database-driven applications, tests often create, update, or delete records. beforeEach resets the MongoDB database to a known baseline (e.g., clearing User or Blog collections with deleteMany({}) and re-inserting default initial documents) before each test executes.
        await User.deleteMany({})

        const bcrypt = require('bcrypt')
        const passwordHash = await bcrypt.hash('secret' , 10)
        const user = new User({ username : 'root' , name : 'Spruser', passwordHash })

        await user.save()
    })  



    test('creation fails with status code 400 if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username : 'validuser' ,
            name : 'Valid User' ,
            password : '12'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type' , /application\/json/)

        assert(result.body.error.includes('password must be at least 3 characters long'))


        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length , usersAtStart.length)
    })
})

after(async() => {
    await mongoose.connection.close()
})