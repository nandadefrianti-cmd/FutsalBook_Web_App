const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route uji coba
app.get('/', (req, res) => {
  res.json({ message: 'Backend Futsal Booking API berhasil berjalan!' });
});

// Menyalakan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
app.use(express.json());