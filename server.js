// this example uses axios and form-data
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

data = new FormData();
data.append('media', fs.createReadStream('others/460921336_3848802348764531_8675922250273515820_n.jpg'));
data.append('models', 'genai');
data.append('api_user', '1788141062');
data.append('api_secret', 'V67k7qzUze2fmw5eXCK8VuDAyYQKAkj9');

axios({
  method: 'post',
  url:'https://api.sightengine.com/1.0/check.json',
  data: data,
  headers: data.getHeaders()
})
.then(function (response) {
  // on success: handle response
  console.log(response.data);
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});