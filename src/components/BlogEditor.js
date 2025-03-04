import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

const BlogEditor = () => {
  const { state } = useLocation();
  const [editedBlog, setEditedBlog] = useState(state?.generatedBlog || '');
  const navigate = useNavigate();

  const formatBlogContent = (content) => {
    return content
      // Remove --- lines
      .replace(/^-{3,}/gm, '')
      // Convert markdown bold to HTML
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert headers
      .replace(/#{1,6}\s+(.*)/g, (match, p1, offset) => {
        const level = match.split(' ')[0].length;
        return `<h${level}>${p1}</h${level}>`;
      })
      // Format references section
      .replace(/For more information([\s\S]*?)(?=\n|$)/g, (match) => {
        return `<div class="references-section">${match.replace('---', '')}</div>`;
      })
      // Convert line breaks to paragraphs
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '')
      .join('');
      
    // return content
    //   .replace(/#{1,6}\s+/g, match => {
    //     const level = match.trim().length;
    //     return `<h${level}>`;
    //   })
    //   .replace(/^-{3,}/gm, '')
    //   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    //   .replace(/\n/g, '</p><p>')
    //   .replace(/<\/h\d>/g, '</$&>')
    //   .replace(/(<h\d>)/g, '$1')
    //   .replace(/<\/p><p>/g, '</p>\n<p>');
  };

  const handlePublish = () => {
    try {
      const keywords = state?.keywords || [];
      const urls = state?.urls || [];
      
      let processedBlog = editedBlog;
      keywords.forEach((keyword, index) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if(urls[index]) {
          processedBlog = processedBlog.replace(regex, `<a href="${urls[index]}" target="_blank" rel="noopener noreferrer">${keyword}</a>`);
        }
      });

      const formattedBlog = `
      <div class="blog-content">
        ${formatBlogContent(processedBlog)
          .replace(/\n/g, '</p>\n<p>')
          .replace(/<p><\/p>/g, '')
        }
      </div>
    `;

      navigate('/published', { state: { publishedBlog: formattedBlog } });
    } catch (error) {
      console.error('Publishing Error:', error);
    }
  };

  if (!state?.generatedBlog) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">No blog content found</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>Edit Blog</Typography>
      <TextField
        fullWidth
        multiline
        minRows={15}
        value={editedBlog}
        onChange={(e) => setEditedBlog(e.target.value)}
        sx={{ mb: 2 }}
        placeholder="Start editing your generated blog here..."
      />
      <Button 
        variant="contained" 
        onClick={handlePublish}
        size="large"
      >
        Publish Blog
      </Button>
    </Box>
  );
};

export default BlogEditor;