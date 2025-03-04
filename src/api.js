import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateBlog = async (data) => {
  try {
    const response = await api.post('/api/generate-blog', data);
    
    if (!response.data?.blog) {
      throw new Error('Server returned empty blog content');
    }

    return {
      blog: response.data.blog,
      keywords: data.keywords.split(',').map(k => k.trim()),
      urls: data.urls.split(',').map(u => u.trim())
    };
    
  } catch (error) {
    let message = error.response?.data?.error || error.message;
    
    if (message.includes('Unexpected response format')) {
        message = 'Temporary issue with AI service. Please try again.';
      }
      
      console.error('API Error:', message);
      throw new Error(message);
  }
};