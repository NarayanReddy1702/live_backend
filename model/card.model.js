import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    thumbline: {
      type: String,
      required: true,
      trim: true
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category:{
      type:String,
      require:true,
    },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
  },
  {
    timestamps: true, 
  }
);

const SareeModel = mongoose.model("Saree", sareeSchema);

export default SareeModel;
