const dummy = (blogs) => {
  return 1;
};

const totalLikes  = (blogs) => {

    let totalLikes = 0

    blogs.forEach(element => {
        totalLikes =+ element.likes
    });

    return totalLikes
}

module.exports = {
  dummy,
  totalLikes 
};
