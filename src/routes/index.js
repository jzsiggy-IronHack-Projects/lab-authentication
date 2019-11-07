const bcrypt = require('bcrypt');
const { User } = require('../models/user')


const home = (request, response) => {
  console.log(request.session)
  response.render("home", { request });
};


const getSignup = (request, response) => {
  response.render("auth/signup", { request });
};

const postSignup = (request, response) => {
  const { username , password } = request.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync( password, salt );

  if ( username === "" || password === "" ) {
    response.render("auth/signup", {
      errorMessage : "Absence of userName or passWord",
      request,
    });
    return ;
  };

  User.findOne({ username })
  .then(user => {
    if (user) {
      response.render("auth/signup", {
        errorMessage : "USER already exists",
        request,
      });
    } else {
      User.create({
        username,
        password : hashPass,
      })
      .then(feedBack => {
        console.log(feedBack);
        response.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
    }
  });
};

const getLogin = (request, response) => {
  response.render("auth/login", { request });
};

const postLogin = (request, response) => {
  const { username , password } = request.body;

  if (!username || !password) {
    response.render("auth/login", {
      errorMessage : "Didn't enter username or passwd",
      request,
    });
    return ;
  };

  User.findOne({ username })
  .then(user => {
    if (!user) {
      response.render("auth/login", {
        errorMessage : "User dose not exist",
      });
    } else if (bcrypt.compareSync(password , user.password)) {
      request.session.currentUser = user;
      response.redirect("/");
    } else {
      response.render("auth/login", {
        errorMessage : "passwd incorrect",
        request,
      });
    };
  })
};

const logout = (request, response) => {
  request.session.destroy(err => {
    console.log(err);
    response.redirect("/");
  });
};

const secret = (request, response) => {
  response.render("secret", { request })
}

module.exports = {
  home,
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  secret,
  logout,
};