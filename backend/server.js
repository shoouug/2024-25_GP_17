const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to match your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());

// Route to send confirmation email
app.post('/api/send-confirmation-email', async (req, res) => {
  const { email } = req.body;

  // Generate a random confirmation code (6 digits)
  const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Configure your SMTP transport with Nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password' // Replace with your email password or app-specific password
    }
  });

  // Email content
  let mailOptions = {
    from: 'your-email@gmail.com', // Sender address
    to: email, // Recipient's email
    subject: 'Your Confirmation Code',
    text: `Your confirmation code is: ${confirmationCode}`
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent to: ' + email);
    res.status(200).json({ message: 'Confirmation email sent', confirmationCode });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
