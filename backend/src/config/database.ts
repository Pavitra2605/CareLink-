import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const dbPath = process.env.DB_PATH || './carelink.db';
const schemaPath = path.resolve(__dirname, '../../schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run('PRAGMA foreign_keys = ON'); // Enable foreign keys
        initDb();
    }
});

function initDb() {
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error executing schema', err.message);
            } else {
                console.log('Database schema initialized.');
            }
        });
    } else {
        console.error('Schema file not found at:', schemaPath);
    }
}

export default db;
