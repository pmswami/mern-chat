import mongoose from "mongoose";
// import Users from "./UserModel.js";
import User from "./UserModel.js";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    recepient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: false
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

});


const Message = mongoose.model("Messages", messageSchema);

export default Message;