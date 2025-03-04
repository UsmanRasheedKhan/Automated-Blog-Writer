const express = require('express');
const cors = require('cors');
const axios = require('axios');
const axiosRetry = require('axios-retry');

const app = express();
const PORT = 5000;
const LANGFLOW_TIMEOUT = 90000;

app.use(cors());
app.use(express.json());

const LANGFLOW_API = 'https://api.langflow.astra.datastax.com';
const APPLICATION_TOKEN = 'AstraCS:WTnpprXjYzDPrdmozMYPmXFv:641bb9d635c515d1e4e33c3f05d67e95ee35b6d3c25b5cfc1ff0b37221ee0aea';

const langflowClient = axios.create({
  baseURL: LANGFLOW_API,
  timeout: LANGFLOW_TIMEOUT,
  headers: {
    'Authorization': `Bearer ${APPLICATION_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

app.post('/api/generate-blog', async (req, res) => {
  try {
    // console.log('Received request:', req.body);
    
    const { topic, country, audience, keywords, urls } = req.body;
    if (!topic || !country || !audience || !keywords || !urls) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const payload = {
      input_value: `Generate blog about ${topic} for ${audience} in ${country}`,
      input_type: 'chat',
      output_type: 'chat',
      tweaks: {
        "Prompt-D7UlR": {
          "template": "Write a blog in proper blog format on {topic}. The {topic} must cover {details}. It should also must include the following {keywords}. To support blog use the information from {references}.",
          "topic": topic,
          "details": audience,
          "keywords": keywords,
          "references": urls
        }
      }
    };

    // console.log('Sending to Langflow:', payload);
    
    const response = await langflowClient.post(
      '/lf/90f26dad-f91c-4f96-b632-9a7b2ccafa2f/api/v1/run/328c3738-c19d-411f-b9f0-d011450221f3',
      payload
    );

    console.log('Langflow response:', response.data);
    // console.log('Full Langflow response:', JSON.stringify(response.data, null, 2));

    const blogContent = response.data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message;

    if (!blogContent) {
        console.error('Blog content path:', JSON.stringify(response.data, null, 2));
        throw new Error('Blog content not found in response structure');
      }
  
      console.log('Parsed blog content:', blogContent.substring(0, 100) + '...');
    res.json({ blog: blogContent });

  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(500).json({
      error: error.message.includes('structure') ? 
             'Unexpected response format from AI service' : 
             'Blog generation failed'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});