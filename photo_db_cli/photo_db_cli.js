#!/usr/bin/env node

//TODO: add photos async wack, download photos async wack

const program = require('commander')
const db = require('./db_logic')
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

program
  .version('0.0.1')
  .description('Query and modify an S3 database!')

// Print pretty green success message!
function success(val) {
  console.log("%s --> \x1b[32m%s\x1b[0m", val.padEnd(8, " "), "success")
}

// Print pretty red failure message!
function failure(val) {
  console.log("%s --> \x1b[31m%s\x1b[0m", val.padEnd(8, " "), "failure")
}

// Add users to database
program
  .command('addusers <usernames...>')
  .alias('au').description('add multiple users to the database')
  .action((usernames) => {

    console.log("\nadding users to database...\n")

    promises = []

    for (i in usernames) {
      promises.push(db.add_bucket(usernames[i]).then((data) => {
        success(data.bucket_name)
      }).catch((data) => {
        failure(data.bucket_name)
      }))
    }

    Promise.all(promises).then((data) => {
      console.log("\n" + data.length + " users processed.\n")
    })
  })

// Add photos to users collection
program
  .command('addphotos <username> <filepaths...>')
  .alias('ap').description('add multiple photos to a users collection')
  .action((username, filepaths) => {

    console.log("\nadding photos to " + username + "\'s collection...")

    promises = []

    for(i in filepaths) {
      promises.push(
        upload_file(filepaths[i]).then((data) => {
          return db.add_object(username,data.object_name,data.data).then((data)=> {return success(data.object_name)})
        }).catch((err) => {
          return failure(err.object_name)
        })
      )
    }

    Promise.all(promises).then((data) => {
      console.log("\n" + data.length + " photos processed.")
    })
  })

// List all users
program
  .command('listusers')
  .alias('lu')
  .description('print list of users in database')
  .action(() => {
    db.list_buckets().then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log("could not get users.")
      console.log(err)
    })
  })

// List all photos in a users collection
program
  .command('listphotos <username> [numphotos]')
  .alias('lp')
  .description('print list of users photos')
  .action((username, numphotos) => {
    numphotos = numphotos || 1000
    db.list_objects(username, numphotos).then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  })

// Delete a user
program
  .command('deleteusers <username...>')
  .alias('du')
  .description('delete users from the database')
  .action((usernames) => {

    console.log("deleting users from database...")

    promises = []

    for( i in usernames){
      promises.push(
        db.delete_bucket(usernames[i]).then((data) => {
          success(data.bucket_name)
        }).catch((data) => {
          failure(data.bucket_name)
        })
      )
    }

    Promise.all(promises).then((data) => {
      console.log("\n" + "users processed.")
    })
  })



// Delete photos from a users account
program
  .command('deletephotos <username> <photokeys...>')
  .alias('dp')
  .description('delete photos from a users collection')
  .action((username, photokeys) => {

    console.log("deleting photos from " + username + "\'s collection...")

    promises = []

    for(i in photokeys) {
      promises.push(
        db.delete_object(username, photokeys[i]).then((data) => {
          success(data.bucket_name)
        }).catch((data) => {
          failure(data.bucket_name)
        })
      )
    }

    Promise.all(promises).then((data) => {
      console.log(data.length + " photos deleted from " + username + "\'s collection.")
    })

  })

// Get photos by name from a users collection
program
  .command('getphoto <username> <photokeys...>')
  .alias('gp')
  .description('download file to current directory')
  .action((username, photokeys) => {

    console.log("\ndownloading files from " + username + "\'s collection...\n")

    promises = []

    for( i in photokeys) {
      promises.push(
        db.get_object(username, photokeys[i]).then((data) => {
          return download_file(data.data,data.object_name)
        }).catch((data) => {
          failure(data.object_name)
        })
      )
    }

    Promise.all(promises).then((data) => {
      console.log("\n" + data.length + " photos processed.")

    })
  })

function upload_file(file_path){
  return new Promise((resolve,reject) => {
    fs.readFile(file_path, (err,data) => {
      if(err) return reject({error:err,object_name:file_path})
       return resolve({data:data,object_name:file_path})
    })
  })
}

function download_file(file,file_name){
  return new Promise((resolve,reject) => {
    fs.writeFile("./"+file_name,file.Body,(err) => {
      if(err) return reject({error:err,object_name:file_name})
      success(file_name)
      return resolve({object_name:file_name})
    })
  })
}

program.parse(process.argv)
