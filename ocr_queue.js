const queue = [];

module.exports = {
  add(job) {
    queue.push(job);
  },
  next() {
    return queue.shift();
  }
};
