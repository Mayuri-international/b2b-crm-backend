

import mongoose from "mongoose";

import { user_role } from "../utils/data.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(user_role),
    default: 'sales'
  },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // for vendor login users only
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;


