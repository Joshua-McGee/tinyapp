const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"]; // every character the url can have

const generateRandomString = () => {
  return [...Array(6)].map(i=>chars[Math.random()*chars.length|0]).join``; // returns 6 character array based on the varable chars.
};

//console.log(generateRandomString());
//shortURL = generateRandomString();

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};
// edits our long url and gives it a new shorturl?
const edit = (request, response) => {
  let longUrl = request.body.longURL; // grabs the same long URL rathar then the new one
  console.log(longUrl);
  const currentUrl = request.params.shortURL; // tells us our current url is the short key in the object
  console.log(currentUrl);
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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars); // it will look in our views folder for urls_index, then run our variable above
  //res.send('/urls page');
});

app.get("/urls/:shortURL", (req, res) => {
  // req.params is all the parameters in the url "address search bar thing"
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});



// delete url
app.post('/urls/:shortURL/delete', (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect('/urls');
});

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

