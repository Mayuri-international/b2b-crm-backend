

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'sales', 'vendor'],
    default: 'sales'
  },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // for vendor login users only
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;


