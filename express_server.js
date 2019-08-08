const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"]; // every character the url can have

const generateRandomString = () => {
  return [...Array(6)].map(i=>chars[Math.random()*chars.length|0]).join``; // returns 6 character array based on the varable chars.
};
// not supposed to use this
// function that returns true or false for if an email has already been used
const emailLookup = function(email) {
  for (let user in users) {
    //console.log(user);
    if (users[user].email === email) {
      //console.log("user found");
      return true;
    }
  }
  return false;
}

// our urls object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};
// our users object
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
// post register
app.post('/register', (req, res) => {

  // if the email sent is an empty string
  if (req.body.email === '') {
    res.status(400);
    res.redirect('https://http.cat/400');
    return;
  }

    if (emailLookup(req.body.email)) {
      res.status(400);
      res.redirect('https://http.cat/400');
      return;
    }

    // adds our register info to our users object
    let randomId = generateRandomString();
    let newEmail = req.body.email;
    let newPassword = req.body.password;
    users[randomId] = { id: randomId, email: newEmail, password: newPassword };

    res.cookie('user_id', randomId);
    res.cookie('email', newEmail);
    console.log(users);
  
  res.redirect('/urls');
});

// clears our cookie (name) when pressed and redirects to our homepage
app.post('/logout', (request, response) => {
  response.clearCookie('user_id');
  response.redirect('/urls');
});
// changes our homepage to include a user that typed in after hitting login button then redirect to homepage
app.post('/login', (request, response) => {
  // if the email sent is an empty string
  if (request.body.email === '') {
    response.status(400);
    response.redirect('https://http.cat/400');
    return;
  }

  console.log('this is my request body in the login', request.body);

  for (let user in users) {
    if (request.body.email === users[user].email) {
      if (request.body.password === users[user].password) {
        response.cookie('user_id', users[user].id)
        response.cookie('email', users[user].email)
        return response.redirect('/urls');
      }
    }
  }
  response.status(400);
  response.redirect('https://http.cat/400');
});

// edits our long url and gives it a new shorturl?
const edit = (request, response) => {
  let longUrl = request.body.longURL; // grabs the same long URL rathar then the new one
  //console.log(longUrl);
  const currentUrl = request.params.shortURL; // tells us our current url is the short key in the object
  //console.log(currentUrl);
  urlDatabase[currentUrl] = request.body.longURL; // update the object to be our key and a new url?
  response.redirect(`/urls/${currentUrl}`);
};
app.post(`/urls/:shortURL`, edit);

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  //console.log(urlDatabase);
  // without the https:// it assumes your path is a local host path so you need to tell it to use http.
  res.redirect('http://' + longURL);
});

// new urls page
app.get("/urls/new", (req, res) => {
  //console.log("this is my cookie", req.cookies.user_id);

  let userObj = req.cookies.user_id;

  let templateVars = {
    user: userObj
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});

// homepage static
app.get("/urls", (req, res) => {
  console.log("this is my cookie !!!!!!!", req.cookies.user_id); // no cookie id on login after logout has been passed
  let userObj = req.cookies.user_id;
  let emailLogin = req.cookies.email;

  if(!userObj) {
    return res.redirect("/register");
  }

  let templateVars = { 
    urls: urlDatabase, 
    user: userObj,
    email: emailLogin
  };
  console.log(templateVars);
  
  res.render("urls_index", templateVars); // it will look in our views folder for urls_index, then run our variable above
});

// the short urls page
app.get("/urls/:shortURL", (req, res) => {
  //console.log("this is my cookie", req.cookies.user_id);

  let userObj = req.cookies.user_id;
  
  // req.params is all the parameters in the url "address search bar thing"
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    user: userObj 
  };
  res.render("urls_show", templateVars);
});

// login page
app.get("/urls_login", (req, res) => {
  console.log("this is my cookie", req.cookies.user_id);

  let userObj = req.cookies.user_id;
  let templateVars = {
    user: userObj,
    email: undefined,
  };

  res.render("urls_login", templateVars);
});

// my registration page
app.get("/register", (req, res) => {
  console.log("this is my cookie", req.cookies.user_id);

  let userObj = req.cookies.user_id;

  let templateVars = {
    user: userObj,
    email: req.cookies['email'],
  };
  res.render("registration", templateVars);
});


// delete url
app.post('/urls/:shortURL/delete', (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect('/urls');
});

// homepage updates are processed here
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  // add to the object our short and long url
  let newShortUrl = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[newShortUrl] = longUrl; // key + value saves to our url database
  res.redirect(`/urls/${newShortUrl}`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

