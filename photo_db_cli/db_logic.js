AWS = require("aws-sdk")
express = require("express")
fs = require("fs")

// Create express instance
var app = express()

// Create S3 client, set credentials in 'credentials' file
//apiVersion option keeps api version consistent accross platforms
var s3 = new AWS.S3({
  apiVersion: '2006-03-01'
})

// Suffix to make bucket names unique
const BUCKET_SUFFIX = "-ventera-summer-2018"

// Create new bucket with users name
function add_bucket(name) {
  // Return promise with data on location of bucket
  return new Promise((resolve, reject) => {
    s3.createBucket({
      Bucket: name + BUCKET_SUFFIX
    }, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Add a single image ot the specified users bucket
function add_object(name, filename, file) {
  return new Promise((resolve, reject) => {

    // Information on object to be uploaded
    var params = {
      Body: file,
      Bucket: name + BUCKET_SUFFIX,
      Key: filename,
    };

    // Upload object
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Get list of all users, which is list of all buckets
function get_buckets() {
  return new Promise((resolve, reject) => {
    s3.listBuckets({}, (err,data) => {
      if(err) return reject(err)
      return resolve(data)
    })
  })
}

// Get list of users photos
function get_objects(name, num) {
  return new Promise((resolve, reject) => {

    //Bucket to retrieve from and max number of photos to return
    var params = {
      Bucket: name + BUCKET_SUFFIX,
      MaxKeys: num,
    }

    s3.listObjects(params, (err,data) => {
      if(err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete a users
function delete_bucket(name) {
  return new Promise((resolve,reject) => {

    var params = {
      Bucket: name + BUCKET_SUFFIX,
    }

    s3.deleteBucket(params, (err, data) => {
      if(err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete a photo with the photo's key as identification
function delete_object(name, photo_key) {
  return new Promise((resolve, reject) => {

    var params = {
      Bucket: name + BUCKET_SUFFIX,
      Key: photo_key,
    }

    s3.deleteObject(params, (err,data) => {
      if(err) return reject(err)
      return resolve(data)
    })
  })
}


module.exports = {
  "add_bucket":add_bucket,
  "add_object":add_object,
  "get_buckets":get_buckets,
  "get_objects":get_objects,
  "delete_bucket":delete_bucket,
  "delete_object":delete_object,
}
