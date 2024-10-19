const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json({ limit: '50mb' }));  

const API_USER = '1788141062';
const API_SECRET = 'V67k7qzUze2fmw5eXCK8VuDAyYQKAkj9';

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

//for selectArea / CaptureEntirescree / uploadFile
app.post('/detect', async (req, res) => {
  try {
    const { image, description, userId } = req.body;

    // check image
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // check base64
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');

    //base64 to jpg
    const tempFilePath = path.join(uploadsDir, `${Date.now()}.jpg`);
    fs.writeFileSync(tempFilePath, imageBuffer);


    const formData = new FormData();
    formData.append('media', fs.createReadStream(tempFilePath));
    formData.append('models', 'genai'); // change model
    formData.append('api_user', API_USER);
    formData.append('api_secret', API_SECRET);

    const response = await axios({
      method: 'post',
      url: 'https://api.sightengine.com/1.0/check.json',
      data: formData,
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(tempFilePath);
    const type = (response.data.type.ai_generated > 0.5) ? "Fake!" : "Real!";

    res.json({
        status: response.data.status,
        ai_score: response.data.type.ai_generated,
        prediction: type
    });
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
      res.status(500).json({ error: error.response.data });
    } else {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

//for imageDetect
app.post('/detectUrl', async (req, res) => {
    try {
      const { imageUrl } = req.body;
  
      if (!imageUrl) {
        return res.status(400).json({ error: 'No image URL provided' });
      }
  
      const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
        params: {
          'url': imageUrl,
          'models': 'genai', 
          'api_user': API_USER,
          'api_secret': API_SECRET,
        }
      });
  
      const type = (response.data.type.ai_generated > 0.5) ? "Fake!" : "Real";
  
      res.json({
          status: response.data.status,
          ai_score: response.data.type.ai_generated,
          prediction: type
      });
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        res.status(500).json({ error: error.response.data });
      } else {
        console.error(error.message);
        res.status(500).json({ error: error.message });
      }
    }
  });

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
