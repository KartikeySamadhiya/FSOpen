const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce( (sum,blog)  =>  sum + blog.likes, 0)
}


const favouriteBlog = (blogs) => {
    if(blogs.length == 0)   return null

    const favorite = blogs.reduce((prev , current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}


const mostBlogs = (blogs) => {
    if(blogs.length === 0)return null

    const authorCounts = blogs.reduce((counts , blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts 
    }, {})

    let maxAuthor = ''
    let maxBlogs = 0

    for (const [author, count] of Object.entries(authorCounts)) {
        if (count > maxBlogs) {
            maxBlogs = count
            maxAuthor = author
        }
    }

    return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((likesMap, blog) => {
    likesMap[blog.author] = (likesMap[blog.author] || 0) + blog.likes
    return likesMap
  }, {})

  let maxAuthor = ''
  let maxLikes = 0

  for (const [author, likes] of Object.entries(authorLikes)) {
    if (likes > maxLikes) {
      maxLikes = likes
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
    dummy ,
    totalLikes ,
    favouriteBlog ,
    mostBlogs ,
    mostLikes
}