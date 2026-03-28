import pool from "../config/db.js";
import { getCoordinatesFromAddress } from "../services/mapService.js";

/* GET all warehouses (Admin + Donor) */
export const getWarehouses = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM warehouses");
  res.json(rows);
};

/* UPDATE warehouse */
export const updateWarehouse = async (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude, capacity, phone, address } = req.body;

  await pool.query(
    `UPDATE warehouses SET name=?, latitude=?, longitude=?, capacity=?, phone=?, address=?
     WHERE warehouse_id=?`,
    [name, latitude, longitude, capacity, phone, address, id]
  );

  res.json({ message: "Warehouse updated" });
};

/* DELETE warehouse */
export const deleteWarehouse = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM warehouses WHERE warehouse_id=?", [id]);
  res.json({ message: "Warehouse deleted" });
};

export const nearestWarehouse = async (req, res) => {
  const { lat, lng } = req.query;

  const [rows] = await pool.query(`
    SELECT *,
    (6371 * acos(
      cos(radians(?)) *
      cos(radians(latitude)) *
      cos(radians(longitude) - radians(?)) +
      sin(radians(?)) *
      sin(radians(latitude))
    )) AS distance
    FROM warehouses
    ORDER BY distance
    LIMIT 1
  `, [lat, lng, lat]);

  res.json(rows[0]);
};

export const createWarehouse = async (req, res) => {
  try {
    const { name, latitude, longitude, capacity, phone, address } = req.body;

    if (!name || !latitude || !longitude || !capacity || !phone || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    await pool.query(
      "INSERT INTO warehouses (name, latitude, longitude, capacity, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [name, latitude, longitude, capacity, phone, address]
    );

    res.status(201).json({ message: "Warehouse created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

