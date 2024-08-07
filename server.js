/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accounts")
const messageRoute = require("./routes/messages")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/index")
const session = require("express-session")
const pool = require('./database/')
const cookieParser = require("cookie-parser")

// THERE IS NO FAVICON
app.get('/favicon.ico', (req, res) => {
  res.status(404).end();
});

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Middleware to Parse Cookies!
app.use(cookieParser())

// HERE ARE LOCALS! DO NOT LOSE THEM!!!
app.use((req, res, next) => {
  res.locals = res.locals || {};
  next();
});
/* ***********************
 * Routes
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Token check
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", utilities.handleErrors(baseController.buildHome))

// app.get("/", function (req, res) {
//   res.render("index", { title: "Home" })
// })

// Inventory routes
app.use("/inv", inventoryRoute)
// Account routes
app.use("/account", accountRoute)
// message routes
app.use("/messages", messageRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("./errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
