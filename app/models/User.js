// app/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isNewCustomer: { type: Boolean, default: true },
  role: { type: String, default: "customer" },
  consentToMarketing: { type: Boolean, default: false } // Nuovo campo per il consenso
});

export default mongoose.models.User || mongoose.model("User", UserSchema);