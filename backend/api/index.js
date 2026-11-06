import 'dotenv/config';
import app from '../app.js';
import { connectDB } from '../config/db.js';

let databaseConnection = null;

async function initializeDatabase() {
    if (!databaseConnection) {
        databaseConnection = connectDB().catch((error) => {
            databaseConnection = null;
            throw error;
        });
    }

    await databaseConnection;
}

export default async function handler(req, res) {
    try {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname;
        if (pathname.startsWith('/api/') && pathname !== '/api/health') {
            await initializeDatabase();
        }
        return app(req, res);
    } catch (error) {
        console.error(
            'Vercel server error:',
            error
        );
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
            status: false,
            message: 'Database connection failed.'
        }));
    }
}