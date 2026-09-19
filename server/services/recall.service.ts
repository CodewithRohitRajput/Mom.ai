const RECALL_API_KEY = process.env.RECALL_API_KEY
const RECALL_REGION = process.env.RECALL_REGION

if(!RECALL_API_KEY){
    throw new Error("Recall api is not connected")
}

const RECALL_BASE_URL = `https://${RECALL_REGION}.recall.ai/api/v1`

export const createRecallBot = async (
    meetingUrl: string,
    meetingId: string,
    joinAt: string
) => {
    const response = await fetch(`${RECALL_BASE_URL}/bot`, {
        method: "POST",
        headers: {
            Authorization: `Token ${RECALL_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            meetingUrl: meetingUrl,
            bot_name: "M-O-M.ai",
            ...(joinAt && {
                join_At : joinAt
            }),

            recording_config: {
                transcript: {
                    provider: {
                        recallai_streaming: {
                            mode: "prioritize_low_latency",
                            language_code: "en",
                        },
                    },
                    
                    diarization: {
                        use_separate_streams_when_available: true,
                    },
                },
          meeting_metadata: {},

          participant_events: {},
                 },

                 metadata: {meetingId}

            }),

    })

    if(!response.ok){
        const error = await response.text()

        throw new Error(
      `Recall API error ${response.status}: ${error}`
    );
    }

    return response.json()
}

export const createTranscript = async (recordingId: string) => {
    const response = await fetch(
        `${RECALL_BASE_URL}/recording/${recordingId}/create_transcript/`,
    {
        method: "POST",
        headers: {
            Authorization:  `Token ${RECALL_API_KEY}`,
            "Content-Type":"application/json",
            Accept: "application/json"
        },
        body  : JSON.stringify({
            provider: {
                recallai_async : {
                    language_code: "auto"
                }
            },
            diarization: {
                use_separate_streams_when_available : true
            }
        })
    })

    return response.json()
}

