const { test , describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/users/EWD/ewd06xx/EWD687.json',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b801b54a676234d17f7',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDrivenDevelopment.html',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17f8',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17f9',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]


test('dummy returns one', () => {
    const result = listHelper.dummy()
    
    assert.strictEqual(result , 1)
})



describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7)
  })

  test('of a bigger list is calculated correctly', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })
})



describe('favourite blog', () => {

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favouriteBlog( [] ), null)
  })

  test('returns the blog with most likes', () => {
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    assert.deepStrictEqual(listHelper.favouriteBlog(blogs), expected)
  })

})



describe('most blogs' , () => {     //describe used to group tests

    test('of empty list is null', () => {
        assert.strictEqual(listHelper.mostBlogs( [] ), null)
    })

    test('returns the author with most blogs', () => {
        const expected = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        assert.deepStrictEqual( listHelper.mostBlogs(blogs) , expected)
    })

})



describe('most likes' , () => {

    test('of empty list is null', () => {
        assert.deepStrictEqual( listHelper.mostLikes( [] ), null )
    })

    test('returns the author with the total most likes', () => {
        const expected ={
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        assert.deepStrictEqual( listHelper.mostLikes(blogs), expected)
    })

})