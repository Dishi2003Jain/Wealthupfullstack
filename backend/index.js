const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
// MongoDB connection setup
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Code = mongoose.model('Code', {
  code: String,
  used: Boolean,
  createdAt: { type: Date, expires: 60, default: Date.now },
});

app.use(express.json());

// Generate a new code and return it
app.get('/api/codes', async (req, res) => {
  const generatedCode = generateCode();
  const newCode = new Code({ code: generatedCode, used: false });
  await newCode.save();
  res.json({ code: generatedCode });
});

// Check and use the code sent in the request body
app.post('/api/codes/use', async (req, res) => {
  const { code } = req.body;

  try {
    const foundCode = await Code.findOne({ code });

    if (!foundCode) {
      return res.status(400).json({ error: 'Enter a valid code' });
    }

    if (foundCode.used) {
      return res.status(400).json({ error: 'This code has already been used' });
    }

    foundCode.used = true;
    await foundCode.save();

    res.json({ message: 'Code is correct' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to generate a code
function generateCode() {
  // Generate a random alphanumeric code of length 5
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
