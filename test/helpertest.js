const { assert } = require('chai');

const { emailLookup } = require('../helpers.js');

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
};

describe('getUserByEmail', function() {
  it('should return true if a user with valid email is pass in our server', function() {
    const user = emailLookup(users, "user@example.com")
    const expectedOutput = true;
    // Write your assert statement here
    assert.deepEqual(user, expectedOutput);
  });
  it('should return false if a user enters an email not in our database', function(){
    const user = emailLookup(users, "blabla@hotmail.com")
    const expectedOutput = false;
    assert.deepEqual(user, expectedOutput)
  })
});