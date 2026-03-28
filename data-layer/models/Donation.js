import { query } from '../config/db';

class Donation {
    static async create({ user_id, item_name, item_category, condition, image_url, warehouse_id }) {
        const [result] = await query(
            'INSERT INTO donations (user_id, item_name, item_category, `condition`, image_url, warehouse_id) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, item_name, item_category, condition, image_url, warehouse_id]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await query('SELECT * FROM donations');
        return rows;
    }
}

export default Donation;
