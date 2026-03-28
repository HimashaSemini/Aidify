import pool from "../config/db.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs"

/* DONATION TRENDS */
export const getDonationTrends = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS count
      FROM donations
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Donation trends error" });
  }
};



/* WAREHOUSE STATS */
export const getWarehouseStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        w.name AS warehouse,
        COUNT(d.donation_id) AS count
      FROM donations d
      LEFT JOIN warehouses w 
        ON d.warehouse_id = w.warehouse_id
      GROUP BY w.name
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Warehouse stats error" });
  }
};



/* TOP DONORS */
export const getTopDonors = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.user_id, u.name, u.email, 
             COALESCE(SUM(d.impact_points), 0) AS impactPoints
      FROM users u
      LEFT JOIN donations d ON u.user_id = d.user_id
      WHERE u.role = 'donor'
      GROUP BY u.user_id, u.name, u.email
      ORDER BY impactPoints DESC
      LIMIT 10
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Top donors error" });
  }
};


/* ALL DONORS */
export const getAllDonors = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.user_id, u.name, u.email, u.created_at,
             COALESCE(SUM(d.impact_points), 0) AS impactPoints
      FROM users u
      LEFT JOIN donations d ON u.user_id = d.user_id
      WHERE u.role = 'donor'
      GROUP BY u.user_id, u.name, u.email, u.created_at
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "All donors error" });
  }
};

/* DASHBOARD STATS */
export const getDashboardStats = async (req, res) => {
  try {
    const totalDonations = await pool.query("SELECT COUNT(*) AS total FROM donations");
    const requests = await pool.query("SELECT COUNT(*) AS requests FROM donations WHERE status = 'Scheduled'");
    const inTransit = await pool.query("SELECT COUNT(*) AS inTransit FROM donations WHERE status = 'In Transit'");
    const delivered = await pool.query("SELECT COUNT(*) AS delivered FROM donations WHERE status = 'Delivered'");

    res.json({
      totalDonations: totalDonations[0].total,
      requests: requests[0].requests,
      inTransit: inTransit[0].inTransit,
      delivered: delivered[0].delivered,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Analytics error" });
  }
};

export const previewAnalyticsReport = async (req, res) => {
  try {
    console.log("➡️ Report API hit by:", req.user);

    const [[total]] = await pool.query(
      "SELECT COUNT(*) AS total FROM donations"
    );

    const [[delivered]] = await pool.query(
      "SELECT COUNT(*) AS delivered FROM donations WHERE status='Delivered'"
    );

    const [[inTransit]] = await pool.query(
      "SELECT COUNT(*) AS inTransit FROM donations WHERE status='In Transit'"
    );

    const [topDonors] = await pool.query(`
      SELECT 
        u.user_id,
        u.name,
        SUM(d.impact_points) AS impact_points
      FROM donations d
      JOIN users u ON d.user_id = u.user_id
      GROUP BY u.user_id, u.name
      ORDER BY impact_points DESC
      LIMIT 5
    `);

    const [donors] = await pool.query(`
      SELECT u.user_id, u.name, u.email, u.created_at
      FROM users u
      WHERE u.role = 'donor'
      GROUP BY u.user_id, u.name, u.email, u.created_at
    `);

    const [donations] = await pool.query(`
        SELECT 
            d.donation_id,
            d.item_name,
            d.item_category,
            d.item_condition,
            d.handover_type,
            d.status,
            d.image_url,
            d.created_at,
            u.name AS donor_name
        FROM donations d
        JOIN users u ON d.user_id = u.user_id
        WHERE d.status = 'Delivered'
        ORDER BY d.created_at DESC
    `);

    const [warehouses] = await pool.query(`
      SELECT warehouse_id, name, phone, capacity, address AS location
      FROM warehouses
    `);

    res.json({
      generatedAt: new Date(),
      totalDonations: total.total,
      delivered: delivered.delivered,
      inTransit: inTransit.inTransit,
      topDonors,
      donors,
      donations,
      warehouses
    });

    } catch (err) {
        console.error("PREVIEW ERROR:", err);
        res.status(500).json({ message: "Preview failed" });
    }
    };

  // 📄 Create PDF
export const downloadAnalyticsReport = async (req, res) => {

    try {
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Aidify_Analytics_Report.pdf"
    );

    doc.pipe(res);

    // 🧾 TITLE
    doc.fontSize(20).text("Aidify Analytics Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Generated At: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // 📊 SUMMARY
    doc.fontSize(14).text("Summary", { underline: true });
    doc.moveDown(0.5);

    const [[total]] = await pool.query("SELECT COUNT(*) AS total FROM donations");
    doc.fontSize(12).text(`Total Donations: ${total.total}`);
    doc.moveDown();

    const [[delivered]] = await pool.query("SELECT COUNT(*) AS delivered FROM donations WHERE status='Delivered'");
    doc.fontSize(12).text(`Delivered Donations: ${delivered.delivered}`);
    doc.moveDown();

    const [[inTransit]] = await pool.query(
      "SELECT COUNT(*) AS inTransit FROM donations WHERE status='In Transit'"
    );
    doc.fontSize(12).text(`In Transit Donations: ${inTransit.inTransit}`);
    doc.moveDown();

    // 🏆 TOP DONORS
    doc.fontSize(14).text("Top Donors", { underline: true });
    doc.moveDown(0.5);

    const [topDonors] = await pool.query(`
      SELECT 
        u.user_id,
        u.name,
        SUM(d.impact_points) AS impact_points
      FROM donations d
      JOIN users u ON d.user_id = u.user_id
      GROUP BY u.user_id, u.name
      ORDER BY impact_points DESC
      LIMIT 5
    `);
    topDonors.forEach((donor, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${donor.name} - Impact Points: ${donor.impact_points}`
      );
    });
    doc.moveDown();

    // DONORS
    // -----------------------
    const [donors] = await pool.query(`
      SELECT u.user_id, u.name, u.email, u.created_at
      FROM users u
      WHERE u.role = 'donor'
      GROUP BY u.user_id, u.name, u.email, u.created_at
    `);
    doc.fontSize(14).text("Donor Details", { underline: true });
    doc.moveDown(0.5);

    donors.forEach((u, i) => {
      doc.fontSize(10).text(
        `${i + 1}. ${u.name} | ${u.email} | ${u.created_at.toLocaleDateString()}`
      );
    });

    doc.moveDown();

    

    const [donations] = await pool.query(`
        SELECT 
            d.donation_id,
            d.item_name,
            d.item_category,
            d.item_condition,
            d.handover_type,
            d.status,
            d.image_url,
            d.created_at,
            u.name AS donor_name
        FROM donations d
        JOIN users u ON d.user_id = u.user_id
        WHERE d.status = 'Delivered'
        ORDER BY d.created_at DESC
    `);

    const [warehouses] = await pool.query(`
      SELECT warehouse_id, name, phone, capacity, address AS location
      FROM warehouses
    `);
    
    
    // -----------------------
    // DONATIONS
    // -----------------------
    doc.fontSize(14).text("Donation Details", { underline: true });
    doc.moveDown(0.5);

    donations.forEach((donation) => {
      doc.fontSize(10).text(
        `ID: ${donation.donation_id} | Item: ${donation.item_name} | Category: ${donation.item_category} | Condition: ${donation.item_condition} | Handover: ${donation.handover_type} | Status: ${donation.status} | Donor: ${donation.donor_name} | Created At: ${donation.created_at.toLocaleDateString()}`
      );

      if (donation.image_url) {
        try {
            const imgPath = path.join(process.cwd(), donation.image_url);
            if (fs.existsSync(imgPath)) {
            doc.moveDown(0.5);
            doc.image(imgPath, { width: 80 });
            }
        } catch (imgErr) {
            console.warn("Image skipped:", donation.image_url);
        }
        }

    });

    doc.moveDown();

    // -----------------------
    // WAREHOUSES
    // -----------------------
    doc.fontSize(14).text("Warehouse Details", { underline: true });
    doc.moveDown(0.5);

    warehouses.forEach((w) => {
      doc.fontSize(10).text(
        `ID: ${w.warehouse_id} | Name: ${w.name} | Location: ${w.location} | Capacity: ${w.capacity}`
      );
    });

    doc.end();

  } catch (error) {
    console.error("PDF REPORT ERROR:", error);
    
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF report" });
    }

  }
};


