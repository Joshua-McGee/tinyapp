
const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"]; // every character the url can have

const generateRandomString = () => {
  return [...Array(6)].map(i => chars[Math.random() * chars.length | 0]).join``; // returns 6 character array based on the varable chars.
};

// used to check if someone has logged in
const checkIfLogin = function(cookie, res) {
  if (!cookie) {
    return res.redirect("/urls_login");
  }
}

const emailLookup = function (users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}

module.exports = {
  generateRandomString,
  checkIfLogin,
  emailLookup
}