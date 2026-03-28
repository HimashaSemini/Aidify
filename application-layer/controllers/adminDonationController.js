import pool from "../config/db.js";
import { createNotification } from "../utils/notificationHelper.js";
import { generateThankYouMessage } from "../services/aiThankYouService.js";

/* GET ONLY SUBMITTED donations */
export const getSubmittedDonations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.donation_id,
        d.item_name,
        d.item_category,
        d.quantity,
        d.handover_type,
        d.created_at,
        u.name AS donor_name,
        u.email AS donor_email,
        u.phone AS donor_phone,
        u.address AS donor_address,
        w.name AS warehouse_name
      FROM donations d
      JOIN users u ON d.user_id = u.user_id
      JOIN warehouses w ON d.warehouse_id = w.warehouse_id
      WHERE d.status = 'Submitted'
      ORDER BY d.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load donations" });
  }
};

/* SCHEDULE donation */
export const scheduleDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduled_date } = req.body;

    if (!scheduled_date) {
      return res.status(400).json({ message: "Schedule date required" });
    }

    await pool.query(
      `UPDATE donations
       SET status = 'Scheduled', scheduled_date = ?
       WHERE donation_id = ? AND status = 'Submitted'`,
      [scheduled_date, id]
    );

    const [[donation]] = await pool.query(
  "SELECT user_id FROM donations WHERE donation_id=?",
  [id]
);

await createNotification(
  donation.user_id,
  `📅 Your donation has been scheduled for ${scheduled_date}.`
);

res.json({ message: "Donation scheduled successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to schedule donation" });
  }
};

/* MARK AS RECEIVED */
export const markAsReceived = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE donations SET status='Received' WHERE donation_id=?`,
      [id]
    );

    await pool.query(
      `INSERT INTO donation_tracking (donation_id, status)
       VALUES (?, 'Received')`,
      [id]
    );

    const [[donation]] = await pool.query(
  "SELECT user_id FROM donations WHERE donation_id=?",
  [id]
);

await createNotification(
  donation.user_id,
  "📦 Your donation has been received at our warehouse."
);

res.json({ message: "Donation marked as received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// fillter by warehouse
export const getDonationsByWarehouse = async (req, res) => {
  const { warehouse_id } = req.params;
  const [rows] = await pool.query(`
    SELECT d.*, u.name AS donor_name, w.name AS warehouse_name
    FROM donations d
    JOIN users u ON d.user_id = u.user_id
    JOIN warehouses w ON d.warehouse_id = w.warehouse_id
    WHERE d.warehouse_id = ?
    ORDER BY d.created_at DESC
  `, [warehouse_id]);

  res.json(rows);
};

export const cancelDonation = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE donations
       SET status = 'Cancelled'
       WHERE donation_id = ?`,
      [id]
    );
    const [[donation]] = await pool.query(
  "SELECT user_id FROM donations WHERE donation_id=?",
  [id]
);

await createNotification(
  donation.user_id,
  "❌ Your donation has been cancelled."
);
    res.json({ message: "Donation cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel donation" });
  }
};

// get sheduled donations
export const getScheduledDonations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.donation_id,
        d.item_name,
        d.item_category,
        d.quantity,
        d.handover_type,
        d.scheduled_date,
        u.name AS donor_name,
        w.name AS warehouse_name
      FROM donations d
      JOIN users u ON d.user_id = u.user_id
      JOIN warehouses w ON d.warehouse_id = w.warehouse_id
      WHERE d.status = 'Scheduled'
      ORDER BY d.scheduled_date ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load scheduled donations" });
  }
};

// GET received donations
export const getReceivedDonations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.donation_id,
        d.status,
        d.item_category,
        d.warehouse_id,
        d.destination_warehouse_id,
        d.item_name,
        d.quantity,
        d.scheduled_date,
        u.name AS donor_name,
        w.name AS warehouse_name
      FROM donations d
      JOIN users u ON d.user_id = u.user_id  
      JOIN warehouses w ON d.warehouse_id = w.warehouse_id
      WHERE d.status = 'Received'
      ORDER BY d.updated_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("getReceivedDonations error:", error);
    res.status(500).json({ message: "Failed to load received donations" });
  }
};

// MARK donation as In Transit
export const markAsTransit = async (req, res) => {
  const { id } = req.params;
  const { destination_warehouse_id } = req.body;

  if (!destination_warehouse_id) {
    return res.status(400).json({ message: "Destination warehouse required" });
  }

  try {
    await pool.query(
      `
      UPDATE donations
      SET 
        status = 'In Transit',
        destination_warehouse_id = ?
      WHERE donation_id = ?
      `,
      [destination_warehouse_id, id]
    );

    
    const [[donation]] = await pool.query(
  "SELECT user_id FROM donations WHERE donation_id=?",
  [id]
);

await createNotification(
  donation.user_id,
  "🚚 Your donation is now in transit to the destination warehouse."
);

res.json({ message: "Donation moved to In Transit" });
  } catch (err) {
    console.error("markAsTransit error:", err);
    res.status(500).json({ message: "Failed to dispatch donation" });
  }
};

export const getInTransitDonations = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT
      d.donation_id,
      d.item_name,
      d.quantity,
      u.name AS donor_name,
      w_from.name AS warehouse_name,
      w_to.name AS destination_warehouse_name
    FROM donations d
    JOIN users u ON d.user_id = u.user_id
    JOIN warehouses w_from ON d.warehouse_id = w_from.warehouse_id
    LEFT JOIN warehouses w_to 
      ON d.destination_warehouse_id = w_to.warehouse_id
    WHERE d.status = 'In Transit'
    ORDER BY d.updated_at DESC
  `);

  res.json(rows);
};

export const markAsDelivered = async (req, res) => {
  const donationId = req.params.id;

  try {
    // 1️⃣ Get donation details
    const [[donation]] = await pool.query(
      `
      SELECT donation_id, user_id, quantity
      FROM donations
      WHERE donation_id = ?
      `,
      [donationId]
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // 2️⃣ Calculate impact points
    const impactPoints = donation.quantity * 10;

    // 3️⃣ Update donation
    await pool.query(
      `
      UPDATE donations
      SET status = 'Delivered',
          impact_points = ?
      WHERE donation_id = ?
      `,
      [impactPoints, donationId]
    );

    // 4️⃣ Update donor total impact points
    await pool.query(
      `
      UPDATE users
      SET impact_points = impact_points + ?
      WHERE user_id = ?
      `,
      [impactPoints, donation.user_id]
    );

    // 5️⃣ Insert tracking record
    await pool.query(
      `
      INSERT INTO donation_tracking (donation_id, status)
      VALUES (?, 'Delivered')
      `,
      [donationId]
    );

    // Get donor info
    const [[user]] = await pool.query(
      "SELECT name FROM users WHERE user_id = ?",
      [donation.user_id]
    );

    // Generate AI message
    const message = await generateThankYouMessage({
      name: user.name,
      item: donation.item_name,
      location: donation.destination_warehouse_name || "our warehouse",
    });

    // Save message
    await pool.query(
      `INSERT INTO thank_you_messages (donation_id, user_id, message)
      VALUES (?, ?, ?)`,
      [donationId, donation.user_id, message]
    );

    // Notify donor
    await createNotification(
      donation.user_id,
      `THANKYOU::${donationId}`
    );

    res.json({
      message: "Donation marked as Delivered 🎉",
      impactPoints,
    });
  } catch (err) {
    console.error("Delivery error:", err);
    res.status(500).json({ message: "Failed to mark as delivered" });
  }
};

export const getDeliveredDonations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.donation_id,
        d.item_name,
        d.quantity,
        d.item_category,
        d.image_url,
        d.impact_points,
        u.name AS donor_name,
        w_from.name AS from_warehouse,
        w_to.name AS to_warehouse,
        d.updated_at
      FROM donations d
      JOIN users u ON d.user_id = u.user_id
      LEFT JOIN warehouses w_from 
        ON d.warehouse_id = w_from.warehouse_id
      LEFT JOIN warehouses w_to 
        ON d.destination_warehouse_id = w_to.warehouse_id
      WHERE d.status = 'Delivered'
      ORDER BY d.updated_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load delivered donations" });
  }
};
