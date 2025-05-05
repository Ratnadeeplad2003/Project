const mongoose = require("mongoose");

const otherFeePaymentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  prnNumber: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  fee: { type: Number, required: true },
  pendingAmount: { type: Number, required: true },
  nextDueDate: { type: String, required: true },
  transactionId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },

  // ✅ New fields to store checkbox selections and amounts
  selectedOtherFees: {
    tripFees: { type: Boolean, default: false },
    departmentFunds: { type: Boolean, default: false },
  },
  tripFee: { type: Number, default: 0 },
  deptFee: { type: Number, default: 0 },
});

module.exports = mongoose.model("OtherFeePayment", otherFeePaymentSchema);
