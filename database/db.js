const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'bot_database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err.message);
    } else {
        console.log('تم الاتصال بقاعدة بيانات SQLite بنجاح.');
    }
});

// إنشاء الجداول إذا لم تكن موجودة
db.serialize(() => {
    // جدول المستخدمين
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        money INTEGER DEFAULT 100,
        exp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        last_daily INTEGER DEFAULT 0
    )`);

    // جدول إضافي للألعاب (مثال)
    db.run(`CREATE TABLE IF NOT EXISTS games (
        user_id TEXT,
        game_name TEXT,
        score INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

const userDb = {
    getUser: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },
    createUser: (id, name) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)`, [id, name], function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
        });
    },
    updateMoney: (id, amount) => {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE users SET money = money + ? WHERE id = ?`, [amount, id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    },
    updateLastDaily: (id, time) => {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE users SET last_daily = ? WHERE id = ?`, [time, id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }
};

module.exports = { db, userDb };
