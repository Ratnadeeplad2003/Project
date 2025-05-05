const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Student = require('./models/student'); // Student model
const Payment = require('./models/payment'); // Payment model
const OtherFeePayment= require('./models/OtherFeePayment'); // Payment model

const multer = require("multer");
const app = express();
const XLSX = require("xlsx");
const PORT = process.env.PORT || 5000;
const path = require("path");



// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
// Serve uploads folder (optional but helpful)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you're using cookies/sessions
}));

app.use(bodyParser.json());
// Configure multer storage
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // separate folder for Excel files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const excelUpload = multer({ storage: excelStorage });

const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/receipts"); // separate folder for PDFs
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const receiptUpload = multer({ storage: receiptStorage });

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/test';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

// JWT Secret Key
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Admin Signup Route (updated)
app.post("/api/admin/signup", async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: "Admin already exists" });
      }
  
      // NOTE: In production, hash the password before saving!
      const newAdmin = new Admin({ name, email, password });
      await newAdmin.save();
  
      const token = jwt.sign({ email: newAdmin.email }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ success: true, token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ success: false, message: "Signup failed" });
    }
});

// Admin Login Route (updated)
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin not found" });
        }
        // Direct password comparison – In production, compare hashed passwords
        if (admin.password === password) {
            const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ success: true, token });
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token is missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.email = decoded.email; // Attach admin email to request
        next();
    });
};

app.post('/api/students', async (req, res) => {
    const { studentName, prnNumber, email, department, semester, mobileNumber, password } = req.body;
  
    if (!studentName || !prnNumber || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
  
    try {
      const student = await Student.findOne({ prnNumber });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found. Please contact admin.' });
      }
  
      // If student already exists, update the password and other fields
      student.studentName = studentName;
      student.email = email;
      student.department = department;
      student.semester = semester;
      student.mobileNumber = mobileNumber;
      student.password = password; // 🔒 Tip: Hash in production
  
      await student.save();
  
      res.status(200).json({ message: 'Signup successful. You can now sign in.', student });
    } catch (error) {
      console.error('Error registering student:', error);
      res.status(500).json({ message: 'Failed to complete signup.' });
    }
  });
  

// Student Sign-In
app.post('/api/students/signin', async (req, res) => {
    const { prnNumber, password } = req.body;

    try {
        const student = await Student.findOne({ prnNumber });
        if (!student || student.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { prnNumber: student.prnNumber, studentName: student.studentName },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, token, student });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ success: false, message: 'An error occurred.' });
    }
});

// Fetch all students
app.get('/api/students',  async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students.' });
    }
});

// Fetch student by PRN
// GET student by PRN
app.get('/api/students/:prnNumber', async (req, res) => {
    try {
      const student = await Student.findOne({ prnNumber: req.params.prnNumber });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({
        studentName: student.studentName,
        prnNumber: student.prnNumber,
        fee: student.fee || 40000, // fallback value
        hasPaid: student.hasPaid || false,
      });
    } catch (err) {
      console.error('Error fetching student details:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Add payment record
app.post('/api/payments', async (req, res) => {
    const { studentName, prnNumber, paymentMethod, amountPaid, paymentOption, courseFee } = req.body;

    const transactionId = `TX${Math.floor(Math.random() * 100000)}`;

    try {
        const student = await Student.findOne({ prnNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        let pendingAmount = student.pendingAmount || courseFee;
        let nextDueDate = student.nextDueDate;

        if (paymentOption === 'full') {
            pendingAmount = 0;
            nextDueDate = null;
        } else if (paymentOption === 'installment') {
            pendingAmount -= amountPaid;
            if (pendingAmount > 0) {
                nextDueDate = new Date();
                nextDueDate.setMonth(nextDueDate.getMonth() + 2);
            } else {
                pendingAmount = 0;
                nextDueDate = null;
            }
        }

        const newPayment = new Payment({
            studentName,
            prnNumber,
            paymentMethod,
            amountPaid,
            transactionId,
            timestamp: new Date(),
        });

        await newPayment.save();

        student.pendingAmount = pendingAmount;
        student.nextDueDate = nextDueDate;
        await student.save();

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully.',
            transactionId,
            pendingAmount,
            nextDueDate,
        });
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ message: 'Failed to record payment.' });
    }
});

// Fetch payment records
app.get('/api/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Failed to fetch payments.' });
    }
});
// Bulk student upload endpoint
// Bulk student upload endpoint with file processing
app.post('/api/students/bulk', excelUpload.single("file"), async (req, res) => {
    // Extract branch and year from the form data
    const branch = req.body.branch;
    const year = req.body.year;
  
    try {
      // Read the uploaded Excel file using XLSX
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      // Convert the sheet to JSON (2D array) and parse headers/rows
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const [headers, ...rows] = parsedData;
      const sanitizedHeaders = headers.map(header => header.trim());
  
      // Map each row to a student object with branch and year info
      const students = rows.map((row, index) => {
        const mappedRow = {};
        sanitizedHeaders.forEach((header, colIndex) => {
          mappedRow[header] = row[colIndex];
        });
        return {
          name: mappedRow["Name"] || "",
          prn: mappedRow["PRN"] || "",
          fee: mappedRow["Total Fee"] || 0,
          course: branch,
          year: year,
        };
      });
  
      // Insert each student if they don't already exist (by PRN)
      const insertedStudents = (await Promise.all(
        students.map(async (studentData) => {
          const existingStudent = await Student.findOne({ prnNumber: studentData.prn });
          if (!existingStudent) {
            const newStudent = new Student({
              studentName: studentData.name,
              prnNumber: studentData.prn,
              email: "", // Email can be updated as needed
              department: studentData.course,
              semester: studentData.year,
              mobileNumber: "", // Update if available
              password: "",     // 
              // Set a default if necessary
              fee: studentData.fee,
            });
            return await newStudent.save();
          }
          return null;
        })
      )).filter(student => student !== null);
  
      res.status(201).json({ message: 'Students uploaded successfully.', insertedStudents });
    } catch (error) {
      console.error('Error in bulk student upload:', error);
      res.status(500).json({ message: 'Failed to upload students.' });
    }
  });
 
// DELETE /api/payments/:transactionId
// DELETE a payment record by PRN
app.delete("/api/payments/:prn", async (req, res) => {
  try {
    const prn = req.params.prn;
    const deletedPayment = await Payment.findOneAndDelete({ prnNumber: prn });

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    res.status(200).json({ message: "Payment record deleted successfully." });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Server error while deleting payment." });
  }
});

// POST route to upload the receipt
// POST route to upload the receipt at /api/uploads/receipts
app.post("/api/uploads/receipts", receiptUpload.single("receipt"), (req, res) => {
  try {
    // If the file was uploaded, req.file will contain the file info
    res.status(200).json({
      message: "Receipt uploaded successfully",
      filePath: req.file.path,
      fileName: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading receipt:", error);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
});




const fs = require('fs');

// Express route to serve the receipt PDF




app.get('/api/receipts/:prnNumber', (req, res) => {
  const { prnNumber } = req.params;
  const receiptsDir = path.join(__dirname, 'uploads', 'receipts');

  // Read the receipts directory
  fs.readdir(receiptsDir, (err, files) => {
    if (err) {
      console.error("Error reading receipts directory:", err);
      return res.status(500).send('Internal Server Error');
    }
    
    // Find file(s) that end with "-{prnNumber}_receipt.pdf"
    const matchingFiles = files.filter(file => file.endsWith(`-${prnNumber}_receipt.pdf`));
    
    if (matchingFiles.length === 0) {
      return res.status(404).send('Receipt not found');
    }

    // Use the first matching file (or choose the latest if needed)
    const filePath = path.join(receiptsDir, matchingFiles[0]);
    
    // Serve the file for download
    res.download(filePath, matchingFiles[0], (downloadErr) => {
      if (downloadErr) {
        console.error('Error sending receipt:', downloadErr);
        return res.status(500).send('Error downloading receipt');
      }
    });
  });
});




  const otherFeeRoute = require("./routes/otherFeePayments");
  app.use("/api/otherfeepayments", otherFeeRoute); // ✅ here is where it belongs
  
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
