const express = require('express')
const fs = require('fs')
const db = require('./db_logic.js')
const formidable = require('formidable')

// Custom error messages
const USERNAME_ERR = "Include username in request's body."
const PHOTO_FILE_ERR = "Include photo in request's body."
const PHOTO_NAME_ERR = "Include photo's name in request's body."

app = express()

// Begin server
server = app.listen(3000, (err) => {
  if (err) return console.log(err)
  var port = server.address().port
  return console.log('Server started on localhost:%s', port)
})

// Add user
app.post('/user', (req, res) => {
  // Instantiate formidable object to parse request
  var form = new formidable.IncomingForm()

  // Parse request
  form.parse(req, (err, forms, files) => {
    // Check form validity
    if (!forms.username) return res.status(300).send(USERNAME_ERR)

    // Make call to S3 and send response with status
    db.addBucket(forms.username)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})

// Delete user
app.delete('/user', (req, res) => {
  // Instantiate formidable object to parse request
  var form = new formidable.IncomingForm()

  // Parse request
  form.parse(req, (err, forms, files) => {
    if (!forms.username) return res.status(300).send(USERNAME_ERR)

    // Make call to S3 and send response with status
    db.deleteBucket(forms.username)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})

// Get users list
app.get('/user/list', (req, res) => {
  // Make call to S3 and send response with status
  db.listBuckets()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

// Add photo
app.post('/photo', (req, res) => {
  form = new formidable.IncomingForm()

  form.parse(req, (err, fields, files) => {
    // Form validation
    if (!fields.username) return res.status(300).send(USERNAME_ERR)
    if (!files) return res.status(300).send(PHOTO_FILE_ERR)

    path = files.file.path
    fs.readFile(path, (err, data) => {
      db.addObject(fields.username, files.file.name, data)
        .then((data) => {
          res.status(200).send(data)
        })
        .catch((err) => {
          res.status(500).send(err)
        })
    })
  })
})

// Get photo
app.get('/photo', (req, res) => {
  form = new formidable.IncomingForm()
  form.parse(req, (err, fields) => {
    if (!fields.username) return res.status(300).send(USERNAME_ERR)
    if (!fields.photoname) return res.status(300).send(PHOTO_NAME_ERR)
    console.log(fields.username, fields.photoname)
    db.getObject(fields.username, fields.photoname)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})

// Get photo list
app.get('/photo/list', (req, res) => {
  form = new formidable.IncomingForm()

  form.parse(req, (err, fields) => {
    if (!fields.username) return res.status(300).send(USERNAME_ERR)
    // Make call to S3 and send response with status
    db.listObjects(fields.username)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})

// Delete photos
app.delete('/photo', (req, res) => {
  form = new formidable.IncomingForm()

  form.parse(req, (err, fields) => {
    if (!fields.username) return res.status(300).send(USERNAME_ERR)
    if (!fields.photoname) return res.status(300).send(PHOTO_NAME_ERR)
    // Make call to S3 and send response with status
    db.deleteObject(fields.username, fields.photoname)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  })
})
