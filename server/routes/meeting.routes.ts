import express from 'express'
import {  getMeeting, getOneMeeting , deleteMeeting, scheduleMeeting, getNextMeeting, scheduleRecallBot, transcribeMeeting } from "../controllers/meeting.controller.js";
import upload from '../middleware/upload.js';
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router()

// router.post('/analyze', analyzeMeetingController)
router.get('/get', authenticateToken,getMeeting)
router.get('/get/:id', authenticateToken,getOneMeeting)
router.delete('/get/:id', authenticateToken,deleteMeeting)
router.post('/transcribe',authenticateToken,transcribeMeeting )
router.post('/schedule',authenticateToken, scheduleMeeting )
router.get('/bot',authenticateToken, getNextMeeting )
router.post('/bot-join',authenticateToken, scheduleRecallBot )

export default router

