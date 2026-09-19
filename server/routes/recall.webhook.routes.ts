import { Router } from "express";
import Meeting from "../models/Meeting.js";
const router = Router()

import { createTranscript } from "../services/recall.service.js";
import { transcribeMeeting } from "../controllers/meeting.controller.js";

router.post('/', async (req, res)=> {
    console.log("Webhook received")
    const event = req.body;
    if(event.event == "recording.done"){
    const botId = event.data?.bot_id;
    const recordingId = event.data?.recording?.id

    const meeting = await Meeting.findOne({
        recallBotId: botId
    })
    if(!meeting){
        return res.status(404).json({message : "Meeting not found"})
    }
    meeting?.recallStatus = "recording_done";
    meeting?.transcriptStatus = "pending";

    await meeting?.save()

    const transcript = await createTranscript(recordingId);

    await transcribeMeeting(
        { body: { meetingId: meeting._id.toString(), transcriptText: transcript.text } } as any,
        { status: () => ({ json: () => {} }) } as any
    )

    }
   
    return res.status(200).json({
        success: true,
        message: "Webhook received"
    })
})





export default router