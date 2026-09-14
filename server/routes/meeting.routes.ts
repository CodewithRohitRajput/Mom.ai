import express from 'express'
import {  getMeeting, getOneMeeting , deleteMeeting, scheduleMeeting, getNextMeeting, meetBotLogin, joinMeet} from "../controllers/meeting.controller.js";    
import upload from '../middleware/upload.js';
import { transcribeMeeting } from '../controllers/meeting.controller.js';
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router()

// router.post('/analyze', analyzeMeetingController)
router.get('/get', authenticateToken,getMeeting)
router.get('/get/:id', authenticateToken,getOneMeeting)
router.delete('/get/:id', authenticateToken,deleteMeeting)
router.post('/transcribe',authenticateToken, upload.single("audio"),transcribeMeeting )
router.post('/schedule',authenticateToken, scheduleMeeting )
router.get('/bot',authenticateToken, getNextMeeting )
router.post('/bot-login',authenticateToken, meetBotLogin )
router.post('/bot-join',authenticateToken, joinMeet )

export default router

