const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    prnNumber: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    pendingAmount: { type: Number, default: 0 },  // Track the remaining amount if paid in installments
    nextDueDate: { type: Date }, // Next installment due date (if applicable)
    receiptData: String // Store receipt details if needed
});

// Additional method to calculate the next due date based on the last payment date
paymentSchema.methods.calculateNextDueDate = function() {
    const nextDue = new Date(this.timestamp);
    nextDue.setMonth(nextDue.getMonth() + 2); // Set the next due date two months from the payment date
    return nextDue;
};

module.exports = mongoose.model('Payment', paymentSchema);
