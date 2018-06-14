const aws = require('aws-sdk')
const express = require('express')
const fs = require('fs')

// Create express instance
var app = express()

// Create S3 client, set credentials in 'credentials' file
var s3 = new aws.S3({
  apiVersion: '2006-03-01' // specifying version keeps api consistent accross platforms
})

function response (error,bucketName,objectName,data){
  return {error:error, bucketName: bucketName, objectName: objectName, data:data}
}

// Suffix appended to bucket name to make bucket names unique
const BUCKET_SUFFIX = '-ventera-summer-2018'

/*
 * All functions are of a similar form. Each function
 * returns a promise. Each function defines a parameters object
 * that's passed to the s3 api. The paramter list insantiation
 * is followed by a single call to the s3 api. Success and failure
 * printouts are left to the calling function, so as to generalize
 * this files usage.
 */

// Create new bucket with the given name
function addBucket (bucketName) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: bucketName + BUCKET_SUFFIX
    }

    s3.createBucket(params, (err, data) => {
      if (err) return reject(response(err,bucketName,null,null))
      return resolve(response(null,bucketName,null,null))
    })
  })
}

// Add new image to the specified bucket
function addObject (bucketName, objectName, object) {
  return new Promise((resolve, reject) => {
    var params = {
      Body: object,
      Bucket: bucketName + BUCKET_SUFFIX,
      Key: objectName
    }

    // Upload object
    s3.putObject(params, (err, data) => {
      if (err) return reject(response(err,bucketName,objectName,null))
      return resolve(response(null,bucketName,objectName,data))
    })
  })
}

// Get list of all buckets
function listBuckets () {
  return new Promise((resolve, reject) => {
    s3.listBuckets({}, (err, data) => {
      if (err) return reject(response(err,null,null,null))
      return resolve(response(null,null,null,data))
    })
  })
}

// Get list of buckets objects
function listObjects (bucketName, maxObjects) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: bucketName + BUCKET_SUFFIX,
      MaxKeys: maxObjects
    }

    s3.listObjects(params, (err, data) => {
      if (err) return reject(response(err,bucketName,null,null))
      return resolve(response(null,bucketName,null,data))
    })
  })
}

// Get a document from the database
function getObject (bucketName, objectName) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: bucketName + BUCKET_SUFFIX,
      Key: objectName
    }

    var stream = s3.getObject(params)
      .createReadStream()
      .pipe(fs.createWriteStream('./' + objectName))

    stream.on('close', () => {
      return resolve(response(null,bucketName,objectName,"Object saved to current directory"))
    })
  })
}

// Delete a users
function deleteBucket (bucketName) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: bucketName + BUCKET_SUFFIX
    }

    s3.deleteBucket(params, (err, data) => {
      if (err) return reject(response(err,bucketName,null,null))
      return resolve(response(null,bucketName,null,null))
    })
  })
}

// Delete a photo with the photo's key as identification
function deleteObject (bucketName, objectName) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: bucketName + BUCKET_SUFFIX,
      Key: objectName
    }

    s3.deleteObject(params, (err, data) => {
      if (err) return reject(response(err,bucketName,objectName,null))
      return resolve(response(null,bucketName,objectName,data))
    })
  })
}

// Allows other js files to require this file
module.exports = {
  'addBucket': addBucket,
  'addObject': addObject,
  'listBuckets': listBuckets,
  'listObjects': listObjects,
  'deleteBucket': deleteBucket,
  'deleteObject': deleteObject,
  'getObject': getObject
}
