import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import quizService from '../../services/quizService';

const ModeSelection = () => {
  const navigate = useNavigate();
  const { quizID } = useParams();

  const handleModeSelect = async (mode) => {
    try {
      console.log('Selected mode:', mode);
      
      try {
        await quizService.updateQuizMode(quizID, mode);
        await quizService.validateQuizStep(quizID, 'mode_selected');
        toast.success('Mode selected successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (apiError) {
        console.warn('API endpoints not ready:', apiError);
        toast.warning('Proceeding without backend confirmation', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      // Navigate based on mode selection
      if (mode === 'manual') {
        navigate(`/quizzes/${quizID}/create-question`);
      } else if (mode === 'ai') {
        navigate(`/quizzes/${quizID}/ai-generation`);
      }
    } catch (error) {
      console.error('Error in handleModeSelect:', error);
      // Navigate anyway for now, until backend is ready
      if (mode === 'manual') {
        navigate(`/quizzes/${quizID}/create-question`);
      } else if (mode === 'ai') {
        navigate(`/quizzes/${quizID}/ai-generation`);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15 }}>
      <Typography variant="h4" gutterBottom align="center">
        Select Question Creation Mode
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            console.log('Manual button clicked');
            handleModeSelect('manual');
          }}
          sx={{ 
            py: 3, 
            backgroundColor: '#7556f0', 
            '&:hover': { backgroundColor: '#6d40e7' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Manual Question Creation
        </Button>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => handleModeSelect('ai')}
          sx={{ 
            py: 3, 
            backgroundColor: '#7556f0', 
            '&:hover': { backgroundColor: '#6d40e7' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          AI-Generated Questions
        </Button>
      </Box>
    </Container>
  );
};

export default ModeSelection;