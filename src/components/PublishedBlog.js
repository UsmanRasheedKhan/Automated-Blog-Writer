import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const PublishedBlog = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.publishedBlog) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">No published blog found</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Generate New Blog
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>Published Blog</Typography>
      <Box 
        dangerouslySetInnerHTML={{ __html: state.publishedBlog }}
        sx={{ 
          '& h1': { fontSize: '2.5rem', fontWeight: 700, mt: 4, mb: 2 },
          '& h2': { fontSize: '2rem', fontWeight: 600, mt: 3, mb: 1.5 },
          '& h3': { fontSize: '1.75rem', fontWeight: 500, mt: 2.5, mb: 1 },
          '& p': { fontSize: '1.1rem', lineHeight: 1.6, mb: 2 },
          '& .keyword-link': {
            color: '#1976d2',
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none' }
          },
          '& a': { wordBreak: 'break-word' },
          '& ul, & ol': { pl: 4, mb: 2 },
          '& li': { mb: 1 },
          '& strong': { fontWeight: 600 },
          '& em': { fontStyle: 'italic' },
          '& .references-section': {
          mt: 4,
          pt: 2,
          borderTop: '1px solid #eee',
          fontSize: '0.9rem',
          color: '#666',
          '& a': {
            color: '#1976d2',
            textDecoration: 'underline'
          }
        },
        }}
      />
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
        size="large"
      >
        Generate New Blog
      </Button>
    </Box>
  );
};

export default PublishedBlog;