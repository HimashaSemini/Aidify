import pool from "../config/db.js";

export const getThankYouMessage = async (req, res) => {
  try {
    const { donationId } = req.params;

    const [[msg]] = await pool.query(
      "SELECT message FROM thank_you_messages WHERE donation_id = ?",
      [donationId]
    );

    res.json(msg || { message: "No message found" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};