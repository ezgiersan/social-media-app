import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

//Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("register istek geldi!", username, email, password)

    const existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);

    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("istek geldi!", email, password)

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err); 
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
