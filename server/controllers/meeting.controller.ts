import type { Request, Response } from "express";
import { analyzeText } from "../services/gemini.service.js";
import Meeting from "../models/Meeting.js";
import { transcribeSpeech } from "../services/gemini.service.js";
import { createGoogleDoc, refreshAccessToken } from "../services/google.service.js";
import Client from "../models/Client.js";
import User from "../models/User.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { createRecallBot } from "../services/recall.service.js";    


export const getMeeting = async (req: Request, res: Response) => {
    const userId = res.locals.userId
    const meetings = await Meeting.find({userId}).sort({createdAt: -1}).populate("clientId")
    return res.status(200).json({success: true, data: meetings})

}

export const getOneMeeting = async (req: Request, res: Response) => {
    const {id} = req.params;
    const meeting = await Meeting.findById(id).populate("clientId")

    return res.status(200).json({success: true, data: meeting})
}

export const deleteMeeting = async (req: Request, res: Response) => {
    const {id} = req.params;
    const deleted = await Meeting.findByIdAndDelete(id)
    return res.status(200).json({
        success: true,
        message: "Deleted"
    })
}


export const scheduleMeeting = async (req: Request, res: Response) => {
    const {title, meetLink} = req.body;
    if(!title || !meetLink){
        return res.status(400).json({
            success: false,
            message: "Title and meet link are required"
        })
    }

    const meeting = await Meeting.create({
        title, meetLink, status: "queued"
    })

    return res.status(201).json({
        message: "Meeting scheduled successfully",
        data: meeting
    })



}




export const getNextMeeting = async (req: Request, res: Response) => {
    const meeting = await Meeting.findOneAndUpdate(
        {status: "queued"},
        {status: "pending"},
        {new: true}
    )

    return res.status(200).json({data : {
        id: meeting?._id,
        title: meeting?.title,
        meetLink: meeting?.meetLink
    }})
}


export const scheduleRecallBot = async (req: Request, res: Response) => {
   const{ meetingUrl, meetingId, joinAt} = req.body;

       if (!meetingUrl) {
      return res.status(400).json({
        success: false,
        message: "meetingUrl is required",
      });
    }

    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "meetingId is required",
      });
    }

    const bot = await createRecallBot(meetingUrl, meetingId, joinAt)
    await Meeting.findByIdAndUpdate(meetingId, {
        recallBotId: bot.id,
        recallStatus: "scheduled"
    })
    return res.status(201).json({
        success: true, 
        message: "Recall bot Scheduled successfully",
        data: bot
    })
}


export const processRecallTranscript = async (meetingId: string, transcriptText: string) => {
    const meeting = await Meeting.findById(meetingId)
    if(!meeting) return null

    const user = await User.findById(meeting.userId)
    if(!user?.googleRefreshToken) {
        await Meeting.findByIdAndUpdate(meetingId, { transcriptStatus: "failed" })
        return null
    }
    const accessToken = await refreshAccessToken(user.googleRefreshToken)

    const prevMeet = await Meeting.findOne({clientId: meeting.clientId, _id: {$ne: meeting._id}}).sort({_id: -1})
    const prevMeetingNotes = prevMeet ? JSON.stringify({transcript: prevMeet.transcript}) : "No previous meeting notes found"

    const analysizedText = await analyzeText(transcriptText, prevMeetingNotes)
    const documentId = await createGoogleDoc(accessToken, `Mom-ai-notes ${meeting?.clientId?.email}`, JSON.stringify(analysizedText, null, 2))

    const updatedMeet = await Meeting.findByIdAndUpdate(meetingId, {
        googleDocId: documentId,
        transcript: transcriptText,
        analysis: analysizedText,
        transcriptStatus: "done"
    }, {new: true})

    return updatedMeet
}


export const transcribeMeeting = async (req: Request, res: Response) => {
    const { meetingId, transcriptText } = req.body;
    if(!meetingId || !transcriptText){
        return res.status(400).json({
            success: false,
            message: "meetingId and transcriptText are required"
        })
    }

    const updatedMeet = await processRecallTranscript(meetingId, transcriptText)
    if(!updatedMeet){
        return res.status(404).json({
            success: false,
            message: "Meeting not found or transcript processing failed"
        })
    }

    return res.status(200).json({
        success: true,
        data: updatedMeet
    })
}


export const joinMeet = async (req: Request, res: Response) => {
    const {meetId} = req.body;
    if(!meetId){
        return res.status(400).json({
            success: false,
            message: "meetId is required"
        })
    }

    const code = meetId.trim().replace(/^(https?:\/\/)?meet\.google\.com\//, '').replace(/\/$/, '')
    const meetingUrl = `https://meet.google.com/${code}`

 

    return res.status(200).json({
        success: true,
        message: "Bot is joining the meeting"
    })
}

