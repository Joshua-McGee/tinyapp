const express = require("express");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3', 'key4']
}))
////////////////////////////////////////////////////Functions////////////////////////////////////////////////////

// functions that dont need direct access to the database are required in helpers.js
const { generateRandomString, checkIfLogin, emailLookup } = require('./helpers');

// used to compare the cookie ID to the databases id then updates and returns a new obj
const urlsForUser = function (id) {
  let newObj = {};
  for (let shorturl in urlDatabase) {
    if (urlDatabase[shorturl].user_id === id) {
      newObj[shorturl] = urlDatabase[shorturl];
      console.log('the user is equal to the id');
      //define a new object then add
    }
  }
  return newObj;
}

/////////////////////////////////////////////////Databases///////////////////////////////////////////////////

// our urls database
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: 'aJ48lW' },
  "9sm5xK": { longURL: "http://www.google.com", user_id: 'aJ48lW' }

};
// our users database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
///////////////////////////////////////////////POST && GETS/////////////////////////////////////////////////////////////

// post register
app.post('/register', (req, res) => {

  // if the email sent is an empty string
  if (req.body.email === '') {
    res.status(400);
    res.send('400 error, you cant enter nothing...');
    return;
  }

  // checks to see if the email is already in the database
  if (emailLookup(users, req.body.email)) {
    res.status(400);
    res.send('400 error, this email already exists use another one');
    return;
  }

  // adds our register info to our users object
  let randomId = generateRandomString();
  let newEmail = req.body.email;
  const password = req.body.password; // found in req body (aka body is what i enter into txt button)
  //console.log('this is my pasword:', password);
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[randomId] = { id: randomId, email: newEmail, password: hashedPassword };
  console.log(users[randomId]);

  // set my cookies
  req.session.user_id = randomId;
  req.session.email = newEmail

  res.redirect('/urls');
});

// clears our cookie (name) when pressed and redirects to our homepage
app.post('/logout', (request, response) => {

  request.session = null;
  //request.session.sig = null;
  response.redirect('/urls');
});

// changes our homepage to include a user that typed in after hitting login button then redirect to homepage
app.post('/login', (request, response) => {
  // if the email sent is an empty string
  if (request.body.email === '') {
    response.status(400);
    response.send('400 error, the email is empty');
    return;
  }

  for (let user in users) {
    if (request.body.email === users[user].email) {
      if (bcrypt.compareSync(request.body.password, users[user].password)) {
        request.session.user_id = users[user].id;
        request.session.email = users[user].email;
        return response.redirect('/urls');
      }
    }
  }
  response.status(403);
  response.send('403, login failed try again');
});

// edits our long url and gives it a new shorturl?
const edit = (request, response) => {
  let userObj = request.session.user_id;

  if (userObj !== urlDatabase[request.params.shortURL].user_id) {
    return response.redirect("/urls_login");
  }
  // tells us our current url is the short key in the objec
  const currentUrl = request.params.shortURL;

  // update the objects current long url to be the new bodys longurl
  urlDatabase[currentUrl].longURL = request.body.longURL;
  response.redirect(`/urls/${currentUrl}`);
};
// experiment above I made a function thats named and passed it to my post
app.post(`/urls/:shortURL`, edit);

// when the short url gets entered you will redirect to the longurl
app.get("/u/:shortURL", (req, res) => {

  if (urlDatabase[req.params.shortURL] === undefined){
    return res.send('500 error, this small url doesnt exist');
  }

  let longURL = urlDatabase[req.params.shortURL].longURL;

  // without the https:// it assumes your path is a local host path so you need to tell it to use http.
  // makes it so when you create links you dont have to include http:// (more user friendly)
  res.redirect('http://' + longURL);
});

// new urls page
app.get("/urls/new", (req, res) => {
  //console.log("this is my cookie", req.cookies.user_id);
  let emailLogin = req.session.email;
  let userObj = req.session.user_id;

  checkIfLogin(userObj, res);

  let templateVars = {
    user: userObj,
    email: emailLogin,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// URLS homepage static
app.get("/urls", (req, res) => {
  let userObj = req.session.user_id;
  let emailLogin = req.session.email;

  checkIfLogin(userObj, res);

  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: userObj,
    email: emailLogin
  };
  //console.log(urlDatabase);

  res.render("urls_index", templateVars); // it will look in our views folder for urls_index, then run our variable above
});

// the short urls page
app.get("/urls/:shortURL", (req, res) => {
  //console.log("this is my cookie", req.cookies.user_id);

  let userObj = req.session.user_id;
  let emailLogin = req.session.email;

  checkIfLogin(userObj, res);

  if (urlDatabase[req.params.shortURL] === undefined){
     return res.send('500 error, this shorturl does not exist')
  }

  // req.params is all the parameters in the url "address search bar thing"
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: userObj,
    email: emailLogin,
    urls: urlDatabase
  };
  res.render("urls_show", templateVars);
});

// login page
app.get("/urls_login", (req, res) => {

  let userObj = req.session.user_id;
  let emailLogin = req.session.email;

  let templateVars = {
    user: userObj,
    email: emailLogin
  };

  res.render("urls_login", templateVars);
});

// my registration page
app.get("/register", (req, res) => {

  let userObj = req.session.user_id;
  let emailLogin = req.session.email;

  let templateVars = {
    user: userObj,
    email: emailLogin
  };
  res.render("registration", templateVars);
});

// delete url
app.post('/urls/:shortURL/delete', (request, response) => {
  //let emailLogin = request.session.email;
  let userObj = request.session.user_id;

  // this makes it so in order to delete a shorturl you need to be logged in and have a matching id
  if (userObj === urlDatabase[request.params.shortURL].user_id) {
    delete urlDatabase[request.params.shortURL];
  }
  response.redirect('/urls');
});

// homepage updates are processed here
app.post("/urls", (req, res) => {
  // add to the object our short and long url
  let newShortUrl = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[newShortUrl] = { longURL: longUrl, user_id: req.session.user_id }; // key + value saves to our url database
  res.redirect(`/urls/${newShortUrl}`);
});

////////////////////////////////////////////////START THE SERVER///////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});