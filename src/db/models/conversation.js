import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      idMsg: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: false,
      },
      txt: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Conv = mongoose.model("Conversation", conversationSchema);
export default Conv;
