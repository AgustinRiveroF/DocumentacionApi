import mongoose from "mongoose"; 

const messageSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true,
        
    },
    user_message: {
        type: String,
        required: true,
    },
});


export const messageModel = mongoose.model('messages', messageSchema);
