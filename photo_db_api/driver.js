request = require("request-promise")
fs = require("fs")

// Send JSON
var options1 = {
  method: 'get',
  uri: "http://localhost:3000/photo",
  body: {
    username: "gleesh",
    photoname: "favicon.jpg"
  },
  json: true,
  resolveWithFullResponse: true
}

// Send file
// var options2 = {
//   method: 'POST',
//   uri: "http://localhost:3000/photo/list",
//   formData: {
//     username: "gleesh",
//     file: {
//       value: fs.createReadStream("unnamed.jpg"),
//       options: {
//         filename: "unnamed.jpg",
//         contentType:'image/jpg',
//       }
//     }
//   }
// }

request(options1)
  .then((data) => {
    console.log(data)
    console.log(data.body)
    console.log(data.statusCode)
  })
  .catch((err) => {
    console.log(err.message)
  })
