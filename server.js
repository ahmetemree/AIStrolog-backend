import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import routes from './routes/index.js';
import { connectDB } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyası backend klasörünün kök dizininde
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(ClerkExpressRequireAuth());

// Ana router'ı kullan
app.use('/api', routes);

// Önce MongoDB bağlantısını yap, sonra server'ı başlat
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Server başlatılamadı:', err);
    process.exit(1);
});