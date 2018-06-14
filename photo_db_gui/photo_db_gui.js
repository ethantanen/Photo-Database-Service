const aws = require('aws-sdk')
const express = require('express')
const fs = require('fs')

const app = express()

// Set the view engine in order to render UI
app.set('view engine', 'ejs');

// Set location of static files
app.use(express.static('/views'));

// Begin server
app.listen(3000, (err) => {
  if (err) return console.log(err)
  return console.log("server listening on localhost:3000")
})

// Home page
app.get("/", (req, res) => {
  res.render("index.ejs")
})

//