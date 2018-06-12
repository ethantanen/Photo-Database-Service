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
	.command('addPhoto <username> <filename> <filepath>')
	.alias('ap')
	.description('Add photo to a users collection')
	.action((username,filename,filepath) => {

		db.add_object(username,filename,filepath)
		.then((data) => {
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
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
.alias('gp')
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





program.parse(process.argv)
