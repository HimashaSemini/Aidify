import pool from "../config/db.js";

export const getMyNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, username, message, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.user_id] 
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};
