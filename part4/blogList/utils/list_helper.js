const _ = require('lodash')

const dummy = (blogs) => {
  return 1;
};

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
