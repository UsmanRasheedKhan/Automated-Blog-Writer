import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Chip,
  IconButton,
  Avatar,
  Card,
  Fade,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import PrintIcon from '@mui/icons-material/Print';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const PublishedBlog = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  
  // Simulated blog metadata - could be passed through state in a real app
  const blogMetadata = {
    publishDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: '5 min read',
    author: 'AI Assistant',
    avatar: 'https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff'
  };

  useEffect(() => {
    setFadeIn(true);
  }, []);

  if (!state?.publishedBlog) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3, bgcolor: '#f9fcff' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 500, color: '#334155' }}>
            No published blog found
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 2, 
              py: 1.5, 
              px: 4,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
            }} 
            onClick={() => navigate('/')}
            startIcon={<AutoAwesomeIcon />}
          >
            Generate New Blog
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Fade in={fadeIn} timeout={800}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        {/* Blog Header */}
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Button
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{ 
              borderRadius: 6,
              px: 2,
              py: 0.75,
              color: '#555',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Home
          </Button>

          <ButtonGroup 
            variant="text" 
            aria-label="blog actions"
            size="small"
            sx={{ 
              '& .MuiButtonGroup-grouped': {
                borderRadius: '50%',
                minWidth: 'auto',
                width: 40,
                height: 40,
                p: 0
              }
            }}
          >
            <Tooltip title="Save">
              <IconButton>
                <BookmarkAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
        
        {/* Blog Content Card */}
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)'
            }
          }}
        >
          {/* Blog Author & Info */}
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: '#f9fafc',
              borderBottom: '1px solid #eaecef',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={blogMetadata.avatar} alt="Author" />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {blogMetadata.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {blogMetadata.publishDate}
                </Typography>
              </Box>
            </Box>
            
            <Chip 
              label={blogMetadata.readTime} 
              size="small" 
              sx={{ 
                borderRadius: 3,
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                color: '#1976d2',
                fontWeight: 500
              }} 
            />
          </Box>
          
          {/* Blog Content */}
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Box 
              dangerouslySetInnerHTML={{ __html: state.publishedBlog }}
              sx={{ 
                '& h1': { 
                  fontSize: { xs: '1.8rem', sm: '2.5rem' }, 
                  fontWeight: 700, 
                  mt: 4, 
                  mb: 2.5,
                  color: '#334155',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                },
                '& h2': { 
                  fontSize: { xs: '1.6rem', sm: '2rem' }, 
                  fontWeight: 600, 
                  mt: 4, 
                  mb: 2,
                  color: '#334155',
                  lineHeight: 1.3
                },
                '& h3': { 
                  fontSize: { xs: '1.4rem', sm: '1.75rem' }, 
                  fontWeight: 500, 
                  mt: 3.5, 
                  mb: 1.5,
                  color: '#334155'
                },
                '& p': { 
                  fontSize: '1.1rem', 
                  lineHeight: 1.8, 
                  mb: 2.5,
                  color: '#4b5563'
                },
                '& a': { 
                  color: '#2563eb',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(37, 99, 235, 0.3)',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                  wordBreak: 'break-word',
                  '&:hover': { 
                    color: '#1e40af',
                    borderBottomColor: '#1e40af'
                  }
                },
                '& ul, & ol': { 
                  pl: 4, 
                  mb: 3,
                  '& li': {
                    mb: 1.5,
                    position: 'relative',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: '#4b5563'
                  }
                },
                '& strong': { 
                  fontWeight: 600,
                  color: '#334155'
                },
                '& em': { fontStyle: 'italic' },
                '& .references-section': {
                  mt: 6,
                  pt: 3,
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '0.95rem',
                  color: '#64748b',
                  '& a': {
                    color: '#2563eb',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                      borderBottomColor: '#2563eb'
                    }
                  }
                },
                '& blockquote': {
                  borderLeft: '4px solid #e5e7eb',
                  pl: 3,
                  py: 1,
                  my: 3,
                  color: '#64748b',
                  fontStyle: 'italic'
                }
              }}
            />
          </Box>
          
          {/* Footer */}
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: '#f9fafc',
              borderTop: '1px solid #eaecef',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12), 0 7px 10px -5px rgba(33,150,243,0.4)',
                '&:hover': {
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.2), 0 9px 12px -6px rgba(33,150,243,0.5)',
                }
              }}
              startIcon={<AutoAwesomeIcon />}
            >
              Generate New Blog
            </Button>
          </Box>
        </Card>
      </Container>
    </Fade>
  );
};

export default PublishedBlog;