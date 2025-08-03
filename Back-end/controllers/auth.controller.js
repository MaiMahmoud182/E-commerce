const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    await sendVerificationEmail(user.email, token);
    res.status(201).json({ message: 'User registered, verification email sent.' });

  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isVerified) return res.status(401).json({ message: 'Email not verified' });

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
