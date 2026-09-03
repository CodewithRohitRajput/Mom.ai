import type { Request, Response } from "express";
import { analyzeText } from "../services/gemini.service.js";
import Meeting from "../models/Meeting.js";
import { transcribeSpeech } from "../services/gemini.service.js";

export const getMeeting = async (req: Request, res: Response) => {
    const meetings = await Meeting.find().sort({createdAt: -1})
    return res.status(200).json({success: true, data: meetings})

}

export const getOneMeeting = async (req: Request, res: Response) => {
    const {id} = req.params;
    const meeting = await Meeting.findById(id)

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

// export const analyzeMeetingController = async (req: Request, res: Response) => {
//     const {transcript} = req.body;

//     if(!transcript){
//         return res.status(404).json({
//             success: false,
//             messsage: "Transcript is required"
//         })
//         }

//         const newMeet = await Meeting.create({transcript})
//     const result = await analyzeText(transcript)
    
//     // result.pipeTextStreamToResponse(res)

//     // const text = await result.text

//    const updatedMeeting =  await Meeting.findByIdAndUpdate( newMeet._id,{ analysis: result}, {new: true})

//     // console.log({id: newMeet._id}, updatedMeeting)
//     return res.status(200).json({
//         success: true,
//         data: result
//     })
// }

 export const transcribeMeeting = async (req : Request, res: Response) => {
    const audio = req.file

    if(!audio) return res.status(400).json({
        success: false,
        message: "Audio file is required"
    })

     const text = await transcribeSpeech(audio.path)
    // console.log(text)
    const newMeet = await Meeting.create({transcript: text})
    const analysizedText = await analyzeText(text)
    const updatedMeet = await Meeting.findByIdAndUpdate(newMeet._id, {analysis : analysizedText}, {new : true})

    return res.status(200).json({
        success: true,
        message: "Audio transcribed and analyzed successfully",
        data: updatedMeet
    })
}