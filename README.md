# Photo-Database-Service
This repository contains implementations of a command line interface, graphical user interface and an application program interface for CALVIN's photo storage.

The various interfaces use the file db_logic.js to communicate with the S3 database. The file wraps the AWS-SDK api functions with promises to handle some of the issues associated as asynchronous programming. The constant BUCKET_SUFFIX in the db_logic file provides a string to append to each bucket/usersnameto circumvent aws's unique bucket name requirements. Update this accordingly. 

The aws-sdk api requires the users to setup an aws account and update the users credentials on their personal computer. AWS provides a series of methods to incorporate these credentials. 

After cloning the repository and navigating to the photo_db_cli, run the command "npm install" to install the dependencies and the command "npm link" to create a symlik in the global folder. Run "calvin --help" to view calvin's functionality. 
