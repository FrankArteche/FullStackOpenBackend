const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')


const dummy = (blogs) => {
  return 1;
};

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const totalLikes  = (blogs) => {

    let totalLikes = 0

    blogs.forEach(element => {
        totalLikes += element.likes
    });

    return totalLikes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let blogWithMostLikes = blogs[0]  // Inicializa con el primer blog

  blogs.forEach((item) => {
    if (item.likes > blogWithMostLikes.likes) {
      blogWithMostLikes = item
    }
  })

  return blogWithMostLikes
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogsCount = _.countBy(blogs, 'author')

  const blogsArray = _.toPairs(blogsCount)

  const topAuthor = _.maxBy(blogsArray, ([, count]) => count)

  return {
    author: topAuthor[0],
    blogs: topAuthor[1]
  }
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const groupedByAuthor = _.groupBy(blogs, 'author');

  const likesByAuthor = _.map(groupedByAuthor, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, 'likes')
  }));

  const topLikedAuthor = _.maxBy(likesByAuthor, 'likes');

  return topLikedAuthor
} 

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb
};
