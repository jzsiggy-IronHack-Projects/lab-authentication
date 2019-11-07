const mongoose = require('mongoose');

const mongooseConnect = () => { 
 mongoose.connect('mongodb://localhost/simpleAuth', { useNewUrlParser: true })
    .then(() => {
      console.log('Connected to Mongo!');
    }).catch(err => {
      console.error('Error connecting to mongo', err);
    });
};

const authenticate = (request , response , next) => {
  if (request.session.currentUser) {
    next()
  } else {
    response.redirect("/login");
  };
};

module.exports = {
  mongooseConnect,
  authenticate,
};