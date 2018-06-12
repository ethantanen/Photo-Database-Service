const aws = require("aws-sdk")
const express = require("express")
const fs = require("fs")

// Create express instance
var app = express()

// Create S3 client, set credentials in 'credentials' file
var s3 = new aws.S3({
  apiVersion: '2006-03-01', // specifying version keeps api consistent accross platforms
})

// Suffix appended to bucket name to make bucket names unique
const BUCKET_SUFFIX = "-ventera-summer-2018"


/*
 * All functions are of a similar form. Each function
 * returns a promise. Each function defines a parameters object
 * that's passed to the s3 api. The paramter list insantiation
 * is followed by a single call to the s3 api. Success and failure
 * print outs are left to the calling function, so as to generalize
 * this files usagpe capabilities.
 */

// Create new bucket with the given name
function add_bucket(bucket_name) {
  return new Promise((resolve, reject) => {

    var params = {
      Bucket: bucket_name + BUCKET_SUFFIX
    }

    s3.createBucket(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })

  })
}

// Add new image to the specified bucket
function add_object(bucket_name, object_name, object) {
  return new Promise((resolve, reject) => {

    var params = {
      Body: object,
      Bucket: bucket_name + BUCKET_SUFFIX,
      Key: object_name,
    };

    // Upload object
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })

  })
}

// Get list of all buckets
function list_buckets() {
  return new Promise((resolve, reject) => {

    s3.listBuckets({}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })

  })
}

// Get list of buckets objects
function list_objects(bucket_name, max_objects) {
  return new Promise((resolve, reject) => {

    var params = {
      Bucket: bucket_name + BUCKET_SUFFIX,
      MaxKeys: max_objects,
    }

    s3.listObjects(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })

  })
}

// Get a document from the database
function get_object(bucket_name, object_name) {
  return new Promise((resolve, reject) => {

    var params = {
      Bucket: bucket_name + BUCKET_SUFFIX,
      Key: object_name
    }

    s3.getObject(params)
      .createReadStream()
      .pipe(fs.createWriteStream("./" + object_name))

  })
}

// Delete a users
function delete_bucket(bucket_name) {
  return new Promise((resolve, reject) => {

    var params = {
      Bucket: bucket_name + BUCKET_SUFFIX,
    }

    s3.deleteBucket(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete a photo with the photo's key as identification
function delete_object(bucket_name, object_key) {
  return new Promise((resolve, reject) => {

    var params = {
      Bucket: bucket_name + BUCKET_SUFFIX,
      Key: object_key,
    }

    s3.deleteObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })

  })
}

// Allows other js files to require this file
module.exports = {
  "add_bucket": add_bucket,
  "add_object": add_object,
  "list_buckets": list_buckets,
  "list_objects": list_objects,
  "delete_bucket": delete_bucket,
  "delete_object": delete_object,
  "get_object": get_object
}
