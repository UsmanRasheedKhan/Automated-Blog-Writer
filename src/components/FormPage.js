import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress } from '@mui/material';
import { generateBlog } from '../api';

const FormPage = () => {
  const [formData, setFormData] = useState({
    topic: '',
    country: '',
    audience: '',
    keywords: '',
    urls: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'India', 'China', 'Japan', 'Pakistan'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await generateBlog(formData);
      console.log('Generation successful:', response.blog.substring(0, 100) + '...');

      navigate('/edit', { 
        state: { 
          generatedBlog: response.blog, 
          keywords: response.keywords,
          urls: response.urls
        }
      });
    } catch (err) {
        const errorMessage = err.message.includes('timeout') ? 
      'Generation is taking longer than expected. Please try again.' : 
      err.message;
      
        setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Generate Your Blog</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Topic Details"
          margin="normal"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          required
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Country</InputLabel>
          <Select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>{country}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Target Audience"
          margin="normal"
          value={formData.audience}
          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="Keywords (comma-separated)"
          margin="normal"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="URLs (comma-separated)"
          margin="normal"
          value={formData.urls}
          onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
          required
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }} 
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Generate Blog'
          )}
        </Button>
      </form>
    </Box>
  );
};

export default FormPage;