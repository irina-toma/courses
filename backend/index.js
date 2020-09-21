const express = require('express');
const users = require('./services/users/users.js');
const auth = require('./services/authentication/auth.js');
const courses = require('./services/courses/courses.js');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json()); //middleware for extracting the json body

app.use((err, req, res, next) => {
  console.trace(err);
  let status = 500;
  let message = 'Something Bad Happened';
  if (err.httpStatus) {
      status = err.httpStatus;
      message = err.message;
  }
  res.status(status).json({
      error: message,
  });
});

app.use('/users', users);
app.use('/auth', auth);
app.use('/courses', courses);

app.listen(4000, () => {
  // console.log('App listening on port 4000'); 
});