import { Clerk } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const authMiddleware = async (req, res, next) => {
  try {
    // İstekten Authorization başlığını al
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Token bulunamadı" });
    }

    // Token'ı doğrula
    const decodedToken = await clerk.verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Geçersiz token" });
    }

    // Kullanıcı kimliğini request nesnesine ekle
    req.userId = decodedToken.sub;

    next();
  } catch (error) {
    console.error('Kimlik doğrulama hatası:', error);
    res.status(401).json({ message: "Kimlik doğrulama başarısız" });
  }
};
