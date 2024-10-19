// this example uses axios
const axios = require('axios');

axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': 'https://i.imgur.com/KeQ2htz.jpeg',
    'models': 'genai',
    'api_user': '1788141062',
    'api_secret': 'V67k7qzUze2fmw5eXCK8VuDAyYQKAkj9',
  }
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