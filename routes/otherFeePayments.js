const express = require("express");
const router = express.Router();
const OtherFeePayment = require("../models/OtherFeePayment");

// POST route to record a new payment
router.post("/", async (req, res) => {
  try {
    const newPayment = new OtherFeePayment(req.body);
    await newPayment.save();
    res.status(201).json({ message: "Other fee payment recorded successfully." });
  } catch (error) {
    console.error("Error saving other fee payment:", error);
    res.status(500).json({ message: "Failed to save payment." });
  }
});

// GET route to retrieve all other fee payments
router.get("/", async (req, res) => {
  try {
    const payments = await OtherFeePayment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching other fee payments:", error);
    res.status(500).json({ message: "Failed to fetch records." });
  }
});

// DELETE route to delete a payment by its ID
// DELETE a specific other fee payment record by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Deleting ID:", id); // 👈 this line

  try {
    const deletedPayment = await OtherFeePayment.findByIdAndDelete(id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment record not found." });
    }
    res.status(200).json({ message: "Payment record deleted successfully." });
  } catch (error) {
    console.error("Error deleting other fee payment:", error);
    res.status(500).json({ message: "Server error while deleting payment." });
  }
});


module.exports = router;
