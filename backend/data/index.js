const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MHOST}:${process.env.MPORT}/${process.env.MDATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
  } catch (e) {
    console.trace(e);
  }
})();

const Course = require('./models/Course.js');

module.exports = {
  Course
}