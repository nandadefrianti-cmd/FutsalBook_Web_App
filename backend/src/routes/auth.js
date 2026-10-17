const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Endpoint Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (nama, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, nama, email, role',
      [name, email, passwordHash, 'player']
    );

    const createdUser = newUser.rows[0];

    res.status(201).json({
      message: 'Registrasi berhasil!',
      user: {
        id: createdUser.id,
        name: createdUser.nama,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (err) {
    console.error('❌ Error Register:', err.message);
    res.status(500).json({ message: 'Server error saat registrasi: ' + err.message });
  }
});

// Endpoint Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Email atau kata sandi salah' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau kata sandi salah' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.nama },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Error Login:', err.message);
    res.status(500).json({ message: 'Server error saat login: ' + err.message });
  }
});

module.exports = router;