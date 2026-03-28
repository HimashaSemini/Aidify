import pool from "../config/db.js";

export const createNotification = async (userId, message) => {
  try {
    // Fetch user name
    const [[user]] = await pool.query(
      "SELECT name FROM users WHERE user_id = ?",
      [userId]
    );

    const username = user ? user.name : "Dear";

    await pool.query(
      `INSERT INTO notifications (user_id, username, message, is_read, created_at)
       VALUES (?, ?, ?, 0, NOW())`,
      [userId, username, message]
    );
  } catch (err) {
    console.error("Notification creation failed:", err);
  }
};