import { query } from '../config/db';

class User {
    static async findByEmail(email) {
        const [rows] = await query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async create({ name, email, password, role }) {
        const [result] = await query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }
}

export default User;
