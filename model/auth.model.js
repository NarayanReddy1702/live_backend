import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    addToCard:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Saree"
      }
    ],

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    ProfilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Auth", authSchema);

export default User;
