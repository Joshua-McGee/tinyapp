# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["A quick peek at the bare bones Login"](https://github.com/Joshua-McGee/tinyapp/blob/master/docs/Login.png?raw=true)
!["My short Url's"](https://github.com/Joshua-McGee/tinyapp/blob/master/docs/urls_page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## DevDependencies

- chai
- mocha
- nodemon

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- It will run on PORT 8080 so make sure this is clear or feel free to change the PORT.
- Open browser and type http://localhost:8080/register to make an account and enjoy the app (once the server is running).
- The homepage is /urls however you will be redirected to the login page if you are not logged in and trying to use other pages.