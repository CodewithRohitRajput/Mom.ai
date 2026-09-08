import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({

    transcript: {
        type: String,
        required: true
    },

    analysis: {
        type: Object,
        default: null,
        summary: {
            type: String,
            default: null
        },

        requirements: {
            type: [String],
            default: []
        },

        decisions: {
            type: [String],
            default: []
        },

        actionItems: {
            type: [
                {
                    task: String,
                    owner: {
                        type: String,
                        default: null
                    },
                    deadline: {
                        type: String,
                        default: null
                    }
                }
            ],
            default: []
        },

        risks: {
            type: [String],
            default: []
        }
    },
    googleDocId: {
        type: String,
        default : null
    }
});

export default mongoose.model("Meeting", meetingSchema);