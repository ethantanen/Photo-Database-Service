request = require("request-promise")
fs = require("fs")

// Send JSON
var options1 = {
  method: 'POST',
  uri: "http://localhost:3000/photo",
  body: {
    file: fs.createReadStream("favicon.jpg"),
    username: "gleesh"
  },
  json: true,
  resolveWithFullResponse: true
}

// Send file
var options2 = {
  method: 'POST',
  uri: "http://localhost:3000/photos",
  formData: {
    file: {
      value: fs.createReadStream("./favicon.jpg"),
      options: {
        filename: "favicon.jpg",
        contentType:'image/jpg',

      }
    }
  }
}

request(options2)
  .then((data) => {
    console.log(data)
    console.log(data.body)
    console.log(data.statusCode)
  })
  .catch((err) => {
    console.log(err.message)
  })
