const db = require("../config/db");

class Admin {
    static login(username, password, callback) {
        const sql = "SELECT * FROM admins WHERE username = ? AND password = ?";
        db.query(sql, [username, password], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result.length > 0 ? result[0] : null);
        });
    }
}

module.exports = Admin;
