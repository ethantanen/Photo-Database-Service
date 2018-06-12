#!/usr/bin/env node

const program = require('commander')
const db = require('./db_logic')

program
	.version('0.0.1')
	.description('Query and modify database!')

program
	.command('addUser <username>')
	.alias('au')
	.description('Add user to the database')
	.action((username) => {

		db.add_bucket(username)
		.then((data) => {
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
		})

	})

program
	.command('addPhoto <username> <filepath> [filename]')
	.alias('ap')
	.description('Add photo to a users collection')
	.action((username,filepath,filename) => {

		filename = String(filename)|| String(filepath)
		console.log(username,filepath,filename)

		fs.readFile(filepath, (err,data) => {

			db.add_object(username,filename,data)
			.then((data) => {
				console.log(data)
			})
			.catch((err) => {
				console.log(err)
			})
		})
	})

program
	.command('getUsers')
	.alias('gu')
	.description('Get list of users in database')
	.action(() => {

		db.get_buckets()
		.then((data) => {
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
		})

	})

program
.command('getPhotos <username> [numphotos]')
.alias('gps')
.description('Get list of users photos')
.action((username,numphotos) => {

	numphotos = numphotos || 1000

	db.get_objects(username, numphotos)
	.then((data) => {
		console.log(data)
	})
	.catch((err) => {
		console.log(err)
	})

})

program
	.command('deleteUser <username>')
	.alias('du')
	.description('Delete user from the database')
	.action((username) => {

		db.delete_bucket(username)
		.then((data) => {
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
		})

	})


program
	.command('deletePhoto <username> <photokey>')
	.alias('dp')
	.description('Delete photo from a users collection')
	.action((username, photokey) => {

		db.delete_object(username,photokey)
		.then((data) => {
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
		})

	})

program
	.command('getPhoto <username> <photokey>')
	.alias('gp')
	.description('Download file to current directory')
	.action((username, photoname) => {

		db.get_object(username,photoname)
		.then((data) => {
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
		})

	})

program.parse(process.argv)
