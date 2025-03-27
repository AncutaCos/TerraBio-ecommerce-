// app/models/Review.js

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false, // La recensione è non approvata per default
  },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
