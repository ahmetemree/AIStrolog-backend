import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Config'i yükle
dotenv.config();

export const connectDB = async () => {
    try {
        if (!process.env.MONGO) {
            throw new Error('MONGO environment variable is not defined');
        }
        
        await mongoose.connect(process.env.MONGO);
        console.log('MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        throw error;
    }
};