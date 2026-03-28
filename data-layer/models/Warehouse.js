import { query } from '../config/db';

class Warehouse {
    static async findAll() {
        const [rows] = await query('SELECT * FROM warehouses');
        return rows;
    }

    static async create({ name, latitude, longitude, capacity }) {
        const [result] = await query(
            'INSERT INTO warehouses (name, latitude, longitude, capacity) VALUES (?, ?, ?, ?)',
            [name, latitude, longitude, capacity]
        );
        return result.insertId;
    }
}

export default Warehouse;
