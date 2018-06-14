express = require('express')
fs = require('fs')
db = require("./db_logic.js")
formidable = require("formidable")


// Custom error messages
const USERNAME_ERR = "Include username in request's body."
const PHOTO_ERR = "Include photo in request's body."

app = express()

// Begin server
server = app.listen(3000,(err) => {
  if(err) return console.log(err)
  var port = server.address().port
  return console.log("Server started on localhost:%s",port)
})

// Add user
app.post("/user", (req,res) => {

  // Instantiate formidable object to parse request
  var form = new formidable.IncomingForm()

  // Parse request
  form.parse(req,(err,forms,files) => {

    // Check form validity
    if(!forms.username) return res.status(300).send(USERNAME_ERR)

    // Make call to S3 and send response with status
    db.add_bucket(forms.username)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})

// Delete user
app.delete("/user", (req,res) => {

  // Instantiate formidable object to parse request
  var form = new formidable.IncomingForm()

  // Parse request
  form.parse(req,(err,forms,files) => {

    if(!forms.username) return res.status(300).send(USERNAME_ERR)

    // Make call to S3 and send response with status
    db.delete_bucket(forms.username)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})

// Get users list
app.get("/user/list", (req,res) => {

  // Make call to S3 and send response with status
  db.list_buckets()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})


// Add photo
app.post("/photo", (req,res) => {
  form = new formidable.IncomingForm()

  form.parse(req,(err,forms,files) => {

    // Form validation
    if(!forms.username) return res.status(300).send(USERNAME_ERR)
    if(!files) return res.status(300).send(PHOTO_ERR)

    path = files.file.path
    fs.readFile(path,(err,data) => {
      db.add_object(forms.username,files.file.name,data)
        .then((data)=>{
          res.status(200).send(data)
        })
        .catch((err) => {
          res.status(500).send(err)
        })
    })
  })
})

// Get photo
app.get("/photo", (req,res) => {

})

// Get photo list
app.get("/photo/list", (req,res) => {

})

// Delete photos
app.delete("/photo", (req,res) => {

})
