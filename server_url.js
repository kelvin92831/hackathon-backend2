const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const API_USER = '1788141062';
const API_SECRET = 'V67k7qzUze2fmw5eXCK8VuDAyYQKAkj9';

app.post('/detect', async (req, res) => {
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

// 啟動伺服器
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
