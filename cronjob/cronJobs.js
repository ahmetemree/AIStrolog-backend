import cron from 'node-cron';
import User from '../models/user.js';

cron.schedule('0 0 * * 1', async () => {
    try {
        console.log("Cron job çalışıyor: Tüm kullanıcılar için canWeeklySpin güncelleniyor.");
        await User.updateMany({}, { canWeeklySpin: true });
        console.log("Tüm kullanıcılar için canWeeklySpin başarıyla güncellendi.");
    } catch (error) {
        console.error("Cron job sırasında hata oluştu:", error);
    }
}); 