import pool from "../config/db.js";
import { classifyImage } from "../services/aiService.js";
import { createNotification } from "../utils/notificationHelper.js";

export const getDonations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, u.name AS donor_name,
      u.email AS donor_email, u.phone AS donor_phone, u.address AS donor_address
      FROM donations d
      JOIN users u ON d.user_id = u.user_id
      ORDER BY d.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

export const createDonation = async (req, res) => {
  const { item_name, item_condition, warehouse_id, quantity, handover_type, comments} = req.body;
  const userId = req.user.user_id;
  const imageUrl = req.file ? req.file.path : null;

  console.log("AUTH HEADER:", req.headers.authorization);
  console.log("REQ.USER:", req.user);

 if (!req.user || !req.user.user_id) {
  return res.status(401).json({
    message: "User not authenticated"
  });
}


  try {
    // AI IMAGE CLASSIFICATION
    const aiResult = await classifyImage(imageUrl);

    // INSERT DONATION
    const [result] = await pool.query(
      `INSERT INTO donations
      (user_id, item_name, item_category, item_condition, quantity, handover_type, comments, image_url, warehouse_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
      [
        userId,
        item_name,
        aiResult.label,
        item_condition,
        quantity,
        handover_type,
        comments,
        imageUrl,
        warehouse_id,
        "Submitted"
      ]
    );

    const donationId = result.insertId;

    // AI LOG (OPTIONAL BUT GOOD)
    await pool.query(
      `INSERT INTO ai_logs
      (donation_id, classification_result, confidence)
      VALUES (?, ?, ?)`,
      [donationId, aiResult.label, aiResult.confidence]
    );

    // 🔹 INITIAL TRACKING STATUS
    await pool.query(
      `INSERT INTO donation_tracking (donation_id, status)
       VALUES (?, 'Submitted')`,
      [donationId]
    );

    await createNotification(
      req.user.user_id,
      "Your donation request has been submitted successfully."
    );

    res.status(201).json({
      message: "Donation submitted successfully",
      ai_category: aiResult.label,
      confidence: aiResult.confidence,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Donation creation failed" });
  }
};

export const getDonorImpact = async (req, res) => {

  try {

    const userId = req.user.user_id;

    // 1️⃣ Get donor name safely
    const [userRows] = await pool.query(
      "SELECT name FROM users WHERE user_id = ?",
      [userId]
    );

    const donorName = userRows.length ? userRows[0].name : "Donor";

    // 1️⃣ Only delivered donations
    const [[summary]] = await pool.query(
      `
      SELECT 
        COUNT(*) AS total_donations,
        IFNULL(SUM(quantity), 0) AS total_items,
        IFNULL(SUM(impact_points), 0) AS total_impact_points
      FROM donations
      WHERE user_id = ? AND status = 'Delivered'
      `,
      [userId]
    );

    // 2️⃣ Status breakdown (all donations)
    const [statusData] = await pool.query(
      `
      SELECT status, COUNT(*) AS count
      FROM donations
      WHERE user_id = ?
      GROUP BY status
      `,
      [userId]
    );

    // 3️⃣ Donor name
    const [[user]] = await pool.query(
      `SELECT name FROM users WHERE user_id = ?`,
      [userId]
    );

    res.json({
      donorName,
      impactPoints: summary.total_impact_points,
      totalDonations: summary.total_donations,
      totalItems: summary.total_items,
      statusData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load impact data" });
  }
};

export const getTopDonors = async (req, res) => {
  const { year, month } = req.query;

  let dateFilter = "";
  let params = [];

  if (year) {
    dateFilter += " AND YEAR(d.created_at) = ?";
    params.push(year);
  }

  if (month) {
    dateFilter += " AND MONTH(d.created_at) = ?";
    params.push(month);
  }

  const [rows] = await pool.query(
    `
    SELECT 
      u.user_id,
      u.name,
      COALESCE(SUM(d.impact_points), 0) AS impact_points,
      COUNT(d.donation_id) AS total_donations,
      COALESCE(SUM(d.quantity), 0) AS total_items
    FROM users u
    LEFT JOIN donations d 
      ON d.user_id = u.user_id 
      AND d.status = 'Delivered'
      ${dateFilter}
    WHERE u.role = 'donor'
    GROUP BY u.user_id, u.name
    ORDER BY impact_points DESC

    `,
    params
  );

  res.json(rows);
};

export const getMyDeliveredDonations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [rows] = await pool.query(`
      SELECT 
        d.donation_id,
        d.item_name,
        d.quantity,
        d.item_category,
        d.image_url,
        d.impact_points,
        d.updated_at,
        w_from.name AS from_warehouse,
        w_to.name AS to_warehouse
      FROM donations d
      LEFT JOIN warehouses w_from 
        ON d.warehouse_id = w_from.warehouse_id
      LEFT JOIN warehouses w_to 
        ON d.destination_warehouse_id = w_to.warehouse_id
      WHERE d.status = 'Delivered'
      AND d.user_id = ?
      ORDER BY d.updated_at DESC
    `, [userId]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load my donations" });
  }
};
