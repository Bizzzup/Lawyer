import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, keyframes } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import api from '../api/apiUrl';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const wave = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('api/real-time-search', {
        message: inputMessage,
        chat_history: messages,
      });

      const botMessage = { text: response.data.result, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        minHeight: '90vh !important',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                }}
              >
                {message.sender === 'user' ? (
                  <Typography variant="body1">{message.text}</Typography>
                ) : (
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <Typography variant="h4" {...props} />,
                      h2: ({ node, ...props }) => <Typography variant="h5" {...props} />,
                      h3: ({ node, ...props }) => <Typography variant="h6" {...props} />,
                      p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
                      ul: ({ node, ...props }) => <Typography component="ul" sx={{ pl: 2 }} {...props} />,
                      ol: ({ node, ...props }) => <Typography component="ol" sx={{ pl: 2 }} {...props} />,
                      li: ({ node, ...props }) => <Typography component="li" {...props} />,
                      table: ({ node, ...props }) => (
                        <Box sx={{ overflowX: 'auto' }}>
                          <table {...props} style={{ borderCollapse: 'collapse', width: '100%' }} />
                        </Box>
                      ),
                      th: ({ node, ...props }) => (
                        <th {...props} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }} />
                      ),
                      td: ({ node, ...props }) => (
                        <td {...props} style={{ border: '1px solid #ddd', padding: '8px' }} />
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                )}
              </Paper>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ alignSelf: 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 2 }} className="bg-secondary-subtle">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      animation: `${wave} 1s infinite linear`,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      animation: `${wave} 1s infinite linear`,
                      animationDelay: '0.2s',
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      animation: `${wave} 1s infinite linear`,
                      animationDelay: '0.4s',
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your question here..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !inputMessage.trim()}
          sx={{
            minWidth: 'auto',
            px: 2,
            borderRadius: 2,
          }}
        >
          <SendIcon />
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatBot;
