const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const sessionController = require('../controllers/sessionController');

// Session routes
router.post('/create', authenticateToken, sessionController.createSession);
router.post('/join', authenticateToken, sessionController.joinSession);
router.get('/:sessionId', authenticateToken, sessionController.getSessionDetails);
router.delete('/:sessionId/participants/:participantId', authenticateToken, sessionController.removeParticipant);

module.exports = router; 