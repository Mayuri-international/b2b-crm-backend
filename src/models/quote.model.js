// MongoDB Quote Model for Finalized Quotes with Vendor Details

import mongoose from 'mongoose';

import {quote_status} from "../utils/data.js";

const vendorSplitSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    description: String,
    quantity: Number,
    costPerUnit: Number,
    advance: Number,
    deliveryDate: Date
});

const quoteItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    hsn: String,
    unit: String,
    quantity: Number,
    finalUnitPrice: Number,
    subtotal: Number,
    vendors: [vendorSplitSchema]
});

const quoteSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    version: { type: Number, required: true },
    items: [quoteItemSchema],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gstPercent: Number,
    taxPercent: Number,
    transport: Number,
    installation: Number,
    totalAmount: Number,
    reason: String, // reason for revision if not version 1
    notes: String,
    image: String,
    sentToClient: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: [...Object.values(quote_status), ...Object.values(quote_status).map(v => v.toLowerCase())],
        default: quote_status.DRAFT
    },
    createdAt: { type: Date, default: Date.now },

}, {

    timestamps: true,

});

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;


