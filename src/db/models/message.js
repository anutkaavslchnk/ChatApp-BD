import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
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
    txt: {
      type: String,
    },
    image: {
      type: String,
    },
    isDelivered: {
      type: Boolean,
    },
    isRead: {
      type: Boolean,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Msg = mongoose.model("Message", messageSchema);
export default Msg;
