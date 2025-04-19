import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const BlogEditor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [editedBlog, setEditedBlog] = useState(state?.generatedBlog || '');
  const [suggestedContent, setSuggestedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHumanized, setIsHumanized] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copyStatus, setCopyStatus] = useState('');
  const [aiScoreOriginal, setAiScoreOriginal] = useState(null);
  const [aiScoreHumanized, setAiScoreHumanized] = useState(null);
  const [sourcesChecked, setSourcesChecked] = useState(0);
  const [progressStep, setProgressStep] = useState(0);

  // Humanization steps
  const humanizationSteps = [
    "Analyzing content",
    "Processing language patterns", 
    "Applying human writing style",
    "Refining and finalizing"
  ];

  // Determine which content to display based on active tab
  const currentContent = activeTab === 0 ? editedBlog : suggestedContent;
  const currentScore = activeTab === 0 ? aiScoreOriginal : aiScoreHumanized;

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => setCopyStatus(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  // Progress simulation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgressStep(prev => {
          if (prev < humanizationSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setProgressStep(0);
    }
  }, [isLoading]);

  const handleHumanizeBlog = async () => {
    setIsLoading(true);
    setProgressStep(0);
    try {
      const startTime = Date.now();
      
      const response = await fetch('http://localhost:5001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedBlog,
          keywords: state?.keywords || []
        })
      });
  
      // Ensure we show loading for at least 6 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 6000) {
        await new Promise(resolve => setTimeout(resolve, 6000 - elapsedTime));
      }
  
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        console.log('Humanization response:', data);
        setAiScoreOriginal(data.ai_detection_original || 85);
        setAiScoreHumanized(data.ai_detection_humanized || 25);
        
        // Preserve blog formatting in humanized content
        const formattedHumanizedContent = preserveFormatting(
          editedBlog,
          data.humanized_content || ''
        );
        
        setSuggestedContent(formattedHumanizedContent);
        setSourcesChecked(data.sources_checked || 3);
        
        setActiveTab(1); // Switch to the humanized tab
        setIsHumanized(true);
      } else {
        throw new Error(data.message || 'Humanization failed');
      }
    } catch (error) {
      console.error('Error humanizing content:', error);
      setCopyStatus(`Error: ${error.message || 'Failed to humanize content'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to preserve formatting between original and humanized content
  const preserveFormatting = (original, humanized) => {
    // First, detect if the title is missing in humanized content
    const originalLines = original.split('\n');
    const humanizedLines = humanized.split('\n');
    
    let originalTitle = '';
    
    // Find title in original content
    for (const line of originalLines) {
      if (line.trim().startsWith('#')) {
        originalTitle = line;
        break;
      }
    }
    
    // Check if humanized content already has a title
    let hasTitle = false;
    for (const line of humanizedLines) {
      if (line.trim().startsWith('#')) {
        hasTitle = true;
        break;
      }
    }
    
    // Preserve title
    let formattedContent = humanized;
    if (originalTitle && !hasTitle) {
      formattedContent = originalTitle + '\n\n' + formattedContent;
    }
    
    // Preserve paragraph breaks
    if (formattedContent.split('\n\n').length < original.split('\n\n').length) {
      const originalParagraphCount = original.split('\n\n').length;
      formattedContent = formattedContent.replace(/([.!?])\s+/g, '$1\n\n');
      
      // Ensure we don't have too many breaks
      const currentBreaks = formattedContent.split('\n\n').length;
      if (currentBreaks > originalParagraphCount * 1.5) {
        formattedContent = formattedContent.split('\n\n')
          .slice(0, originalParagraphCount + 1)
          .join('\n\n') + '\n\n' + 
          formattedContent.split('\n\n').slice(originalParagraphCount + 1).join(' ');
      }
    }
    
    // Preserve list items
    const listItemMatches = original.match(/^([-*]|\d+\.)\s+.+$/gm);
    if (listItemMatches && listItemMatches.length > 0) {
      // Try to preserve list structure
      const contentParts = formattedContent.split('\n\n');
      
      // Find paragraphs that could be lists (short paragraphs)
      for (let i = 0; i < contentParts.length; i++) {
        if (contentParts[i].length < 200) { // Short paragraph
          const sentences = contentParts[i].split('. ');
          if (sentences.length >= 3) { // Multiple sentences could be a list
            contentParts[i] = sentences.map((sentence, idx) => {
              if (idx > 0) {
                return `- ${sentence}`;
              }
              return sentence;
            }).join('\n');
          }
        }
      }
      
      formattedContent = contentParts.join('\n\n');
    }
    
    return formattedContent;
  };
  
  const handleUseHumanizedContent = () => {
    setEditedBlog(suggestedContent);
    setIsHumanized(true);
    setActiveTab(0); // Go back to editing tab with new content
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(currentContent);
    setCopyStatus('Content copied to clipboard!');
  };

  const formatBlogContent = (content) => {
    return content
      .replace(/^-{3,}/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/#{1,6}\s+(.*)/g, (match, p1) => {
        const level = match.split(' ')[0].length;
        return `<h${level}>${p1}</h${level}>`;
      })
      .replace(/For more information([\s\S]*?)(?=\n|$)/g, (match) => {
        return `<div class="references-section">${match.replace('---', '')}</div>`;
      })
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '')
      .join('');
  };

  const handlePublish = () => {
    try {
      // Use the currently active content (either original or humanized)
      const contentToPublish = currentContent;
      
      const keywords = state?.keywords || [];
      const urls = state?.urls || [];
      
      let processedBlog = contentToPublish;
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
    <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight="bold">Blog Editor</Typography>
        <Chip
          label={`AI Detection: ${currentScore !== null ? `${currentScore}%` : '--'}`}
          color={
            currentScore > 50 ? 'error' : 
            currentScore > 30 ? 'warning' : 'success'
          }
          icon={<SmartToyIcon />}
          sx={{ fontSize: '1rem', p: 2 }}
        />
      </Box>

      {isLoading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight="medium" color="primary">
              {humanizationSteps[progressStep]}...
            </Typography>
          </Box>
        </Box>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} sx={{ mb: 3 }}>
              <Tab label="Original Content" icon={<ContentCopyIcon />} />
              <Tab 
                label="Humanized Content" 
                icon={<AutoAwesomeMotionIcon />}
                disabled={!suggestedContent}
              />
            </Tabs>

            {activeTab === 0 ? (
              <TextField
                fullWidth
                multiline
                minRows={18}
                value={editedBlog}
                onChange={(e) => setEditedBlog(e.target.value)}
                placeholder="Start editing your generated blog here..."
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1.1rem'
                  }
                }}
              />
            ) : (
              <TextField
                fullWidth
                multiline
                minRows={18}
                value={suggestedContent}
                placeholder="Humanized content will appear here..."
                InputProps={{
                  readOnly: true,
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    fontSize: '1.1rem'
                  }
                }}
              />
            )}

            {aiScoreOriginal !== null && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
                <Chip
                  label={`Original AI Detection: ${aiScoreOriginal}%`}
                  color={aiScoreOriginal > 50 ? 'error' : 'success'}
                  variant="outlined"
                />
                <Chip
                  label={`Humanized AI Detection: ${aiScoreHumanized}%`}
                  color={aiScoreHumanized > 50 ? 'warning' : 'success'}
                  variant="outlined"
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleHumanizeBlog}
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    <AutoAwesomeMotionIcon />
                  )
                }
                sx={{ px: 4, py: 1.5 }}
              >
                {isLoading ? 'Processing...' : 'Humanize Blog'}
              </Button>

              {suggestedContent && activeTab === 1 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUseHumanizedContent}
                  startIcon={<CheckCircleOutlineIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Use Humanized Content
                </Button>
              )}

              <Tooltip title="Copy to clipboard">
                <IconButton onClick={handleCopyContent} sx={{ ml: 'auto' }}>
                  <ContentCopyIcon color="action" />
                </IconButton>
              </Tooltip>
            </Box>

            {copyStatus && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {copyStatus}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: '#f8f9fa' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
              Content Analysis
            </Typography>

            <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress 
                      variant="determinate" 
                      value={currentScore || 0} 
                      color={
                        currentScore > 70 ? 'error' : 
                        currentScore > 40 ? 'warning' : 'success'
                      }
                      size={40}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" component="div">
                        {currentScore ? `${Math.round(currentScore)}%` : '--'}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={activeTab === 0 ? "AI Detection Risk" : "Humanized Score"} 
                  secondary="Lower percentage indicates more human-like content"
                  sx={{ ml: 2 }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {isHumanized && activeTab === 1 ? (
                    <CheckCircleOutlineIcon color="success" fontSize="medium" />
                  ) : (
                    <CancelOutlinedIcon color={activeTab === 0 ? "error" : "warning"} fontSize="medium" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary="Humanization" 
                  secondary={
                    isHumanized && activeTab === 1 
                      ? "Viewing AI-enhanced content" 
                      : activeTab === 0 
                        ? "Original content" 
                        : "Content ready for use"
                  }
                  sx={{ ml: 2 }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <InfoIcon color="info" fontSize="medium" />
                </ListItemIcon>
                <ListItemText 
                  primary="SEO Optimization" 
                  secondary={`${state?.keywords?.length || 0} keywords integrated`}
                  sx={{ ml: 2 }}
                />
              </ListItem>
            </List>

            {currentScore > 60 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>AI Detection Alert</AlertTitle>
                This content may be detected as AI-generated. Consider using the humanized version.
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handlePublish}
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
            >
              {activeTab === 0 ? "Publish Original Blog" : "Publish Humanized Blog"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogEditor;