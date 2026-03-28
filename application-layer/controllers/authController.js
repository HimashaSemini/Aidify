import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, normalizedEmail, hashedPassword, role || 'donor']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profile_image: user.profile_image 
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   GET MY PROFILE
========================= */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // ✅ FIXED

    const [rows] = await pool.query(
      `SELECT 
        user_id,
        name,
        email,
        role,
        phone,
        address,
        profile_image,
        created_at
       FROM users
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // ✅ FIXED
    const { name, phone, address } = req.body;

    const profileImage = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : null;

    await pool.query(
      `UPDATE users 
       SET 
        name = ?, 
        phone = ?, 
        address = ?, 
        profile_image = COALESCE(?, profile_image)
       WHERE user_id = ?`,
      [name, phone, address, profileImage, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
};


/* =========================
   DELETE PROFILE
========================= */
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // ✅ FIXED

    await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

