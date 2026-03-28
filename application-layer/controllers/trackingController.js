import pool from "../config/db.js";

export const getLatestDonationTracking= async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [donations] = await pool.query(
      `SELECT 
         d.donation_id,
         d.status,
         d.item_name,
         d.item_category,
         d.item_condition,
         d.quantity,
         d.image_url,
         w1.name AS pickup_name,
         w1.latitude AS pickup_lat,
         w1.longitude AS pickup_lng,
         w2.name AS dest_name,
         w2.latitude AS dest_lat,
         w2.longitude AS dest_lng
       FROM donations d
       LEFT JOIN warehouses w1 ON d.warehouse_id = w1.warehouse_id
       LEFT JOIN warehouses w2 ON d.destination_warehouse_id = w2.warehouse_id

       WHERE d.user_id = ?
       ORDER BY d.created_at DESC`,
      [userId]
    );

    if (donations.length === 0) {
      return res.json([]);
    }

    // Attach tracking timeline for each donation
   for (let donation of donations) {
  const [tracking] = await pool.query(
    `SELECT status, updated_at
     FROM donation_tracking
     WHERE donation_id = ?
     ORDER BY updated_at ASC`,
    [donation.donation_id]
  );

  donation.timeline = tracking.length
    ? tracking.map(t => ({
        stage: t.status,
        date: t.updated_at
      }))
    : [];

  // Pickup location
  donation.location = donation.pickup_lat && donation.pickup_lng
    ? {
        lat: Number(donation.pickup_lat),
        lng: Number(donation.pickup_lng),
        warehouse: donation.pickup_name
      }
    : null;

  // Destination location
  donation.destination = donation.dest_lat && donation.dest_lng
    ? {
        lat: Number(donation.dest_lat),
        lng: Number(donation.dest_lng),
        warehouse: donation.dest_name
      }
    : null;
}

    res.json(donations);

  } catch (err) {
    console.error("Donation tracking error:", err);
    res.status(500).json({ message: "Failed to load donation tracking" });
  }
};

