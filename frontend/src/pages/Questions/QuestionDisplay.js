import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup,
  FormControlLabel,
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import questionService from '../../services/questionService';
import { toast } from 'react-hot-toast';

const QuestionDisplay = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await questionService.getQuizQuestions(quizId);
        setQuestions(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch questions');
        toast.error('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const handleDelete = async (questionId) => {
    try {
      await questionService.deleteQuestion(quizId, questionId);
      setQuestions(questions.filter(q => q.questionID !== questionId));
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error(error.response?.data?.message || 'Error deleting question');
    }
  };

  const handleEdit = (questionId) => {
    navigate(`/quizzes/${quizId}/questions/${questionId}/edit`);
  };

  const handleAddQuestion = () => {
    navigate(`/quizzes/${quizId}/create-question`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "MCQ":
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {question.questionText}
            </Typography>
            <RadioGroup name={question.id}>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio disabled />}
                  label={option}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: '#271362'
                    },
                    bgcolor: '#f4f3ff',
                    mb: 1,
                    borderRadius: 1,
                    px: 2,
                    '&:hover': {
                      bgcolor: '#ebeafd'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </Box>
        );

      case "TRUE_FALSE":
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {question.questionText}
            </Typography>
            <RadioGroup row name={question.id}>
              <FormControlLabel
                value="true"
                control={<Radio disabled />}
                label="True"
                sx={{ mr: 4 }}
              />
              <FormControlLabel
                value="false"
                control={<Radio disabled />}
                label="False"
              />
            </RadioGroup>
          </Box>
        );

      case "FILL_IN_THE_BLANKS":
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {question.questionText.split("_____").map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <TextField
                      disabled
                      variant="standard"
                      sx={{
                        mx: 1,
                        width: '100px',
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#6d40e7'
                        }
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        );

      case "SHORT_ANSWER":
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {question.questionText}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              disabled
              placeholder="Enter your answer here..."
              sx={{
                bgcolor: '#f4f3ff',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e3e3e3',
                  },
                }
              }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const questionTypes = ["MCQ", "TRUE_FALSE", "FILL_IN_THE_BLANKS", "SHORT_ANSWER"];

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ 
            color: '#6d40e7',
            '&:hover': {
              backgroundColor: 'rgba(109, 64, 231, 0.04)'
            }
          }}
        >
          Back to Quizzes
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ my: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {!loading && !error && questions.length === 0 && (
        <Box sx={{ my: 4 }}>
          <Typography>No questions found. Click "Add Question" to create one.</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            sx={{ mt: 2 }}
          >
            Add Question
          </Button>
        </Box>
      )}

      {!loading && !error && questions.length > 0 && (
        questionTypes.map(type => {
          const typeQuestions = questions.filter(q => q.questionType === type);
          if (typeQuestions.length === 0) return null;

          return (
            <Box key={type} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ color: '#271362', fontWeight: 'bold', mb: 2 }}>
                {type.split('_').join(' ')} Questions
              </Typography>
              {typeQuestions.map(question => (
                <Card key={question.questionID} sx={{ mb: 2, border: '1px solid #e3e3e3' }}>
                  <CardContent>
                    {renderQuestion(question)}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid #e3e3e3'
                    }}>
                      <Box>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(question.questionID)}
                          sx={{ 
                            mr: 1,
                            color: '#6d40e7',
                            borderColor: '#6d40e7',
                            '&:hover': {
                              borderColor: '#4e26b1',
                              color: '#4e26b1'
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(question.questionID)}
                          sx={{ 
                            color: 'error.main',
                            borderColor: 'error.main'
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddQuestion}
                        sx={{ 
                          color: '#6d40e7',
                          borderColor: '#6d40e7',
                          '&:hover': {
                            borderColor: '#4e26b1',
                            color: '#4e26b1'
                          }
                        }}
                      >
                        Add Question
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          );
        })
      )}

      <Button
        onClick={() => navigate(`/quizzes/${quizId}/create-question`)}
        sx={{ mt: 2 }}
      >
        Create Question
      </Button>
    </Box>
  );
};

export default QuestionDisplay; 