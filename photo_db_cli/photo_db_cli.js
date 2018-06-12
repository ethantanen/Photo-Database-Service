#!/usr/bin/env node

const program = require('commander')
const db = require('./db_logic')
const fs = require('fs')

program
  .version('0.0.1')
  .description('Query and modify an S3 database!')

program
  .command('adduser <username>')
  .alias('au')
  .description('add user to the database')
  .action((username) => {
    db.add_bucket(username)
      .then((data) => {
        console.log(username + " added to database.")
      })
      .catch((err) => {
        console.log(username + " could not be added to database.")
        console.log(err)
      })
  })

program
  .command('addphoto <username> <filepath> [filename]')
  .alias('ap')
  .description('add photo to a users collection')
  .action((username, filepath, filename) => {
    // Use file path as name if filename was not provided
    filename = String(filename) || String(filepath)
    fs.readFile(filepath, (err, data) => {
      db.add_object(username, filename, data)
        .then((data) => {
          console.log(filename + " added to " + username + "\'s collection.")
        })
        .catch((err) => {
          console.log(filename + " could not be added to " + username + "\s collection.")
          console.log(err)
        })
    })
  })

program
  .command('listusers')
  .alias('lu')
  .description('print list of users in database')
  .action(() => {
    db.list_buckets()
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log("could not get users.")
        console.log(err)
      })
  })

program
  .command('listphotos <username> [numphotos]')
  .alias('lp')
  .description('print list of users photos')
  .action((username, numphotos) => {
    numphotos = numphotos || 1000
    db.list_objects(username, numphotos)
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  })

program
  .command('deleteuser <username>')
  .alias('du')
  .description('delete user from the database')
  .action((username) => {
    db.delete_bucket(username)
      .then((data) => {
        console.log(username + " has been deleted from the database.")
      })
      .catch((err) => {
        console.log(username + " could not be deleted from the database.")
        console.log(err)
      })
  })


program
  .command('deletephoto <username> <photokey>')
  .alias('dp')
  .description('delete photo from a users collection')
  .action((username, photokey) => {
    db.delete_object(username, photokey)
      .then((data) => {
        console.log(photokey + " has been deleted from " + username + "\'s collection.")
      })
      .catch((err) => {
        console.log(photokey + " could not be deleted from " + username + "\'s collection.")
        console.log(err)
      })
  })

program
  .command('getphoto <username> <photokey>')
  .alias('gp')
  .description('download file to current directory')
  .action((username, photoname) => {
    db.get_object(username, photoname)
      .then((data) => {
        console.log(photoname + " from " + username + "\'s collection has been downloaded")
      })
      .catch((err) => {
        console.log(photoname + " from " + username + "\'s collection could not be downloaded")
        console.log(err)
      })
  })

program.parse(process.argv)
