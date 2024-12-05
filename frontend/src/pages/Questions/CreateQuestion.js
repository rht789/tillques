// src/pages/Questions/CreateQuestion.js

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import { toast } from 'react-toastify';
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Box,
  Switch,
  IconButton,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  BarChart as DifficultyIcon,
  Add as PlusIcon,
  Remove as MinusIcon,
} from '@mui/icons-material';
import './CreateQuestion.css';

const CreateQuestion = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'MCQ',
    options: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false }
    ],
    timeLimit: 30,
    difficulty: 'medium',
  });
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [errors, setErrors] = useState({});

  // Handle question type change
  const handleTypeChange = (event) => {
    const type = event.target.value;
    let newOptions = [];

    switch (type) {
      case 'MCQ':
        newOptions = [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: false }
        ];
        break;
      case 'TRUE_FALSE':
        newOptions = [
          { id: '1', text: 'True', isCorrect: false },
          { id: '2', text: 'False', isCorrect: false }
        ];
        break;
      default:
        newOptions = [];
    }

    setFormData({
      ...formData,
      questionType: type,
      options: newOptions,
    });
  };

  // Handle question text change
  const handleQuestionTextChange = (event) => {
    setFormData({
      ...formData,
      questionText: event.target.value,
    });
    // Clear error when user starts typing
    if (errors.questionText) {
      setErrors({ ...errors, questionText: null });
    }
  };

  // Handle option text change
  const handleOptionChange = (id, value) => {
    setFormData({
      ...formData,
      options: formData.options.map(option =>
        option.id === id ? { ...option, text: value } : option
      ),
    });
  };

  // Handle correct answer toggle
  const handleCorrectToggle = (id) => {
    setFormData({
      ...formData,
      options: formData.options.map(option =>
        option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
      ),
    });
  };

  // Add new option
  const addOption = () => {
    const newId = String(formData.options.length + 1);
    setFormData({
      ...formData,
      options: [...formData.options, { id: newId, text: '', isCorrect: false }],
    });
  };

  // Remove option
  const removeOption = (id) => {
    setFormData({
      ...formData,
      options: formData.options.filter(option => option.id !== id),
    });
  };

  // Handle time limit change
  const handleTimeChange = (event, newValue) => {
    setFormData({
      ...formData,
      timeLimit: newValue,
    });
  };

  // Handle difficulty change
  const handleDifficultyChange = (event) => {
    setFormData({
      ...formData,
      difficulty: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.questionText) {
        setErrors({ ...errors, questionText: 'Question text is required' });
        return;
      }

      // For MCQ, ensure at least one option is marked as correct
      if (formData.questionType === 'MCQ') {
        if (!formData.options.some(opt => opt.isCorrect)) {
          toast.error('Please select at least one correct answer');
          return;
        }
      }

      const questionData = {
        questionText: formData.questionText,
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit,
        options: formData.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect
        }))
      };

      console.log('Submitting question data:', questionData);
      
      await questionService.createQuestion(quizID, questionData);
      toast.success('Question created successfully!');
      navigate(`/quizzes/${quizID}`);
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question. Please try again.');
    }
  };

  return (
    <div className="create-question-container">
      <div className="question-card">
        <Typography variant="h5" className="card-title">
          Create a New Question
        </Typography>

        <form>
          {/* Question Type Selection */}
          <div className="form-field">
            <InputLabel className="field-label">
              Question Type
            </InputLabel>
            <FormControl fullWidth>
              <Select
                value={formData.questionType}
                onChange={handleTypeChange}
                className="custom-input"
              >
                <MenuItem value="MCQ">Multiple Choice</MenuItem>
                <MenuItem value="TRUE_FALSE">True/False</MenuItem>
                <MenuItem value="FILL_IN_THE_BLANKS">Fill in the Blanks</MenuItem>
                <MenuItem value="SHORT_ANSWER">Short Answer</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Question Text Input */}
          <div className="form-field">
            <InputLabel className="field-label">
              Question Text
            </InputLabel>
            <TextField
              multiline
              rows={3}
              value={formData.questionText}
              onChange={handleQuestionTextChange}
              placeholder="Enter your question here"
              className="custom-input"
              error={!!errors.questionText}
              helperText={errors.questionText}
              fullWidth
            />
          </div>

          {/* Options Section */}
          {(formData.questionType === 'MCQ' || formData.questionType === 'TRUE_FALSE') && (
            <div className="form-field">
              <InputLabel className="field-label">
                Answer Options
              </InputLabel>
              
              <div className="options-container">
                {formData.options.map((option) => (
                  <div key={option.id} className="option-row">
                    {formData.questionType === 'MCQ' ? (
                      // MCQ Option
                      <>
                        <TextField
                          value={option.text}
                          onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          placeholder={`Option ${option.id}`}
                          className="custom-input"
                          fullWidth
                        />
                        <div className="correct-switch">
                          <Switch
                            checked={option.isCorrect}
                            onChange={() => handleCorrectToggle(option.id)}
                            color="primary"
                          />
                          <span className="switch-label">Correct</span>
                        </div>
                        {formData.options.length > 2 && (
                          <IconButton 
                            onClick={() => removeOption(option.id)}
                            size="small"
                            className="remove-option-btn"
                          >
                            <MinusIcon />
                          </IconButton>
                        )}
                      </>
                    ) : (
                      // True/False Option
                      <div className="true-false-option">
                        <TextField
                          value={option.text}
                          disabled
                          className="custom-input"
                          fullWidth
                        />
                        <div className="correct-switch">
                          <Switch
                            checked={option.isCorrect}
                            onChange={() => handleCorrectToggle(option.id)}
                            color="primary"
                          />
                          <span className="switch-label">Correct</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Option Button (only for MCQ) */}
                {formData.questionType === 'MCQ' && (
                  <Button
                    onClick={addOption}
                    startIcon={<PlusIcon />}
                    className="add-option-btn"
                    fullWidth
                  >
                    Add Option
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Time Limit Section */}
          <div className="form-field">
            <div className="field-label">
              <ClockIcon fontSize="small" sx={{ color: '#412191' }} />
              <InputLabel>Time Limit (seconds)</InputLabel>
            </div>
            <div className="slider-container">
              <Slider
                value={formData.timeLimit}
                onChange={handleTimeChange}
                min={5}
                max={120}
                step={5}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#7556f0',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#7556f0',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#ebeafd',
                  },
                }}
              />
              <Typography className="time-display">
                {formData.timeLimit}s
              </Typography>
            </div>
          </div>

          {/* Difficulty Level Section */}
          <div className="form-field">
            <div className="field-label">
              <DifficultyIcon fontSize="small" sx={{ color: '#412191' }} />
              <InputLabel>Difficulty Level</InputLabel>
            </div>
            <RadioGroup
              row
              value={formData.difficulty}
              onChange={handleDifficultyChange}
              className="radio-group"
            >
              <FormControlLabel
                value="easy"
                control={
                  <Radio 
                    sx={{
                      '&.Mui-checked': {
                        color: '#7556f0',
                      },
                    }}
                  />
                }
                label="Easy"
                className="radio-label"
              />
              <FormControlLabel
                value="medium"
                control={
                  <Radio 
                    sx={{
                      '&.Mui-checked': {
                        color: '#7556f0',
                      },
                    }}
                  />
                }
                label="Medium"
                className="radio-label"
              />
              <FormControlLabel
                value="hard"
                control={
                  <Radio 
                    sx={{
                      '&.Mui-checked': {
                        color: '#7556f0',
                      },
                    }}
                  />
                }
                label="Hard"
                className="radio-label"
              />
            </RadioGroup>
          </div>

          {/* Save Button */}
          <Button
            variant="contained"
            fullWidth
            className="save-question-btn"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#7556f0',
              '&:hover': {
                backgroundColor: '#6d40e7',
              },
            }}
          >
            Save Question
          </Button>
        </form>
      </div>

      {/* Saved Questions Section */}
      {savedQuestions.length > 0 && (
        <div className="question-card saved-questions">
          <Typography variant="h6" className="card-title">
            Saved Questions ({savedQuestions.length})
          </Typography>
          
          {savedQuestions.map((question, index) => (
            <Card 
              key={question.id} 
              className="saved-question-card"
              sx={{ mb: 2, border: '1px solid #e3e3e3' }}
            >
              <CardContent>
                <div className="question-header">
                  <div>
                    <Typography 
                      variant="body2" 
                      sx={{ color: '#412191', mb: 1 }}
                    >
                      Question {index + 1}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ color: '#271362', fontWeight: 500 }}
                    >
                      {question.questionText}
                    </Typography>
                  </div>
                  <div className="question-badges">
                    <Chip 
                      label={question.questionType}
                      sx={{
                        backgroundColor: '#ebeafd',
                        color: '#412191',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip 
                      label={`${question.timeLimit}s`}
                      sx={{
                        backgroundColor: '#ebeafd',
                        color: '#412191',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip 
                      label={question.difficulty}
                      sx={{
                        backgroundColor: '#ebeafd',
                        color: '#412191',
                        fontSize: '0.75rem'
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateQuestion;
