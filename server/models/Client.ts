import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    email: String,
    ProjectId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        default: null
    },

})

export default mongoose.model('client', ClientSchema)