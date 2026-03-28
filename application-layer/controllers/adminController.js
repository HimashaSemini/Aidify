import pool from '../config/db.js';
import bcrypt from "bcrypt";

export async function getAllUsers(req, res) {
    try {
        const [rows] = await pool.query('SELECT user_id, name, email, role, created_at FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}

export async function getAllDonations(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM donations');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch donations' });
    }
}

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin creation failed" });
  }
};

export const getAdminlist= async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.created_at 
       FROM users u
       WHERE u.role = 'admin'`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin list" });
  }
};