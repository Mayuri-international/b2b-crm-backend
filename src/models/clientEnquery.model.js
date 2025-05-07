import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    requirement: { type: String }, // summary of inquiry
    sourceWebsite: { type: String },
    sourcePlatform: { type: String }, // e.g., "Instagram", "Facebook"

    // Assignment logic
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Salesperson
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin
    assignmentDate: { type: Date, default: Date.now },

    // Status
    status: {
        type: String,
        enum: ['Unassigned', 'Assigned', 'Quoted', 'Confirmed', 'In Production', 'Shipped', 'Delivered', 'Converted', 'Lost'],
        default: 'Unassigned'
    },

    // Quotation & Negotiation
    quoteValue: { type: Number },
    finalQuoteApproved: { type: Number }, // after negotiation
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }, // reference to invoice if generated

    // Vendor assignment (multi-vendor per order)
    vendorAssignments: [
        {
            vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
            productDescription: String,
            estimatedCost: Number,
            advancePaid: Number,
            deliveryEstimate: Date,
            deliveryStatus: {
                type: String,
                enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
                default: 'Pending'
            }
        }
    ],

    // Communication & Notes
    communicationNotes: [
        {
            note: String,
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    // Follow-up reminders
    followUps: [
        {
            followUpDate: Date,
            followUpNote: String,
            done: { type: Boolean, default: false },
            responses: [
                {
                    message: String,
                    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                    respondedAt: { type: Date, default: Date.now }
                }
            ]
        }
    ],

    quoteSubmitted: { type: Boolean, default: false },
    attachments: [String], // e.g., URLs to signed quote PDFs, drawings, WhatsApp screenshots

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

clientSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
