import type { Request, Response } from "express";
import { analyzeText } from "../services/gemini.service.js";
import Meeting from "../models/Meeting.js";
import { transcribeSpeech } from "../services/gemini.service.js";
import { createGoogleDoc } from "../services/google.service.js";
import Client from "../models/Client.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { loginIntoBrowser, startMeetBot } from "../services/meetBot.service.js";

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

 export const transcribeMeeting = async (req : Request, res: Response) => {



    const audio = req.file
    const {clientId} = req.body
    const userId = res.locals.userId
    const accessToken = res.locals.googleAccessToken

    
    if(!audio) return res.status(400).json({
        success: false,
        message: "Audio file is required"
    })

    const prevMeet = await Meeting.findOne({clientId}).sort({_id : -1})
    const prevMeetingNotes = prevMeet ? JSON.stringify({transcript: prevMeet.transcript}) : "No previous meeting notes found"
    const text = await transcribeSpeech(audio.path)
    // console.log(text)
    const newMeet = await Meeting.create({userId, clientId, transcript: text})

    const analysizedText = await analyzeText(text, prevMeetingNotes)
    const updatedMeet = await Meeting.findByIdAndUpdate(newMeet._id, {analysis : analysizedText}, {new : true})
    
    const documentId = await createGoogleDoc(accessToken, 'Mom-ai-notes', JSON.stringify(analysizedText, null, 2))

    await Meeting.findByIdAndUpdate(newMeet._id, {googleDocId: documentId}, {new: true})

    return res.status(200).json({
        success: true,
        message: "Audio transcribed and analyzed successfully",
        data: updatedMeet
    })
}


export const meetBotLogin = async (req: Request, res: Response) => {
    loginIntoBrowser().catch((error) => {
        console.error("Bot login failed:", error)
    })

    return res.status(200).json({
        success: true,
        message: "Bot login started"
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

    startMeetBot(meetingUrl).catch((error) => {
        console.error("Bot join failed:", error)
    })

    return res.status(200).json({
        success: true,
        message: "Bot is joining the meeting"
    })
}

