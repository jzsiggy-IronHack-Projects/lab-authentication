const { mongooseConnect , authenticate } = require('./resources');
const { home , getSignup , postSignup , getLogin , postLogin , secret , logout } = require('./routes')

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

mongooseConnect()

const app = express();

app.use(session({
  secret : "basic-auth-secret",
  cookie : { maxAge : 60000 },
  store : new MongoStore({
    mongooseConnection : mongoose.connection,
    ttl : 24 * 60 * 60,
  })
}));

hbs.registerPartials(`${__dirname}/views/partials`);
app.set("view engine", "hbs");
app.set(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended : true }));

app.get("/", home)
app.get("/signup", getSignup);
app.post("/signup", postSignup);
app.get("/login", getLogin);
app.post("/login", postLogin);
app.get("/secret", authenticate, secret);
app.get("/logout", logout);



app.listen(3000, () => {
  console.log("LetS AuthENticAte On Port 30o0")
});


