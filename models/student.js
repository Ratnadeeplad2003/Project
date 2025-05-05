const mongoose = require('mongoose');

// Define the Student schema
const StudentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
    },
    prnNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Changed from true to false to allow bulk uploads
    },
    email: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    semester: {
        type: String,
        default: ""
    },
    mobileNumber: {
        type: String,
        default: ""
    },
    fee: {
        type: Number,
        default: 0
    },
    pendingAmount: {
        type: Number,
        default: 0,
    },
    nextDueDate: {
        type: Date,
        default: null,
    },
    hasPaid: {
        type: Boolean,
        default: false,
    },
    payments: [
        {
            paymentMethod: String,
            amountPaid: Number,
            transactionId: String,
            timestamp: Date,
        },
    ],
});

// Export the Student model
module.exports = mongoose.model('student', StudentSchema);
