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


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
