import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Container,
  Fade
} from '@mui/material';
import { generateBlog } from '../api';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
  
  const isFormValid = () => {
    return formData.topic && 
           formData.country && 
           formData.audience && 
           formData.keywords && 
           formData.urls;
  };

  return (
    <Container maxWidth="md">
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={4}
          sx={{
            mt: 6,
            mb: 6,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(to right bottom, #ffffff, #f9fcff)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
              py: 4,
              px: 3,
              color: 'white',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h4" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon /> Blog Generator
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Fill in the details below to create your custom blog post
            </Typography>
          </Box>
          
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditNoteIcon /> Content Details
                      </Typography>
                      <TextField
                        fullWidth
                        label="Topic Details"
                        placeholder="Enter a detailed description of your blog topic"
                        margin="normal"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        required
                        variant="outlined"
                        sx={{ mt: 2 }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PublicIcon /> Region
                      </Typography>
                      <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                        <InputLabel>Target Country</InputLabel>
                        <Select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                          sx={{ borderRadius: 2 }}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country} value={country}>{country}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon /> Audience
                      </Typography>
                      <TextField
                        fullWidth
                        label="Target Audience"
                        placeholder="Describe who will read your blog"
                        margin="normal"
                        value={formData.audience}
                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        required
                        variant="outlined"
                        sx={{ mt: 2 }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <KeyIcon /> SEO Elements
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Keywords"
                        placeholder="Enter keywords separated by commas"
                        margin="normal"
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        required
                        variant="outlined"
                        helperText="These keywords will be highlighted in your blog"
                        sx={{ mt: 2 }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="URLs"
                        placeholder="Enter URLs separated by commas"
                        margin="normal"
                        value={formData.urls}
                        onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
                        required
                        variant="outlined"
                        helperText="These URLs will be linked to your keywords"
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {error && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#fdeded', borderRadius: 2, border: '1px solid #f5c2c7' }}>
                  <Typography color="error">
                    {error}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading || !isFormValid()}
                  sx={{ 
                    px: 6, 
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(33,150,243,0.4)',
                    '&:hover': {
                      boxShadow: '0 8px 25px 0 rgba(0,0,0,0.2), 0 9px 12px -6px rgba(33,150,243,0.5)',
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                      Generating...
                    </Box>
                  ) : (
                    <>Generate Blog <AutoAwesomeIcon sx={{ ml: 1 }} /></>
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default FormPage;