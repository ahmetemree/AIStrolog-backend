import User from "../models/user.js";
import cron from 'node-cron';

class UserService {
    async createOrUpdateUser(userData) {
        const { userId, name, email, birthDate, birthTime, zodiacSign, subscription, birthPlace } = userData;
        
        const existingUser = await User.findOne({ userId });
        
        if (existingUser) {
            return await User.findOneAndUpdate(
                { userId },
                {
                    name,
                    email,
                    birthDate,
                    birthTime,
                    isFirstTime: false,
                    subscription: existingUser.subscription,
                    subscriptionEndDate: existingUser.subscriptionEndDate,
                    canWeeklySpin: existingUser.canWeeklySpin,
                    zodiacSign: zodiacSign,
                    credits: existingUser.credits,
                    birthPlace: birthPlace
                },
                { new: true }
            );
        }

        const newUser = new User({
            name,
            userId,
            email, 
            birthDate,
            birthTime,
            isFirstTime: false,
            subscription,
            subscriptionEndDate: "",
            canWeeklySpin: true,
            zodiacSign,
            credits: 5,
            birthPlace
        });
        return await newUser.save();
    }

    async updateUserPlan(userId, planData) {
        const { subscription, subscriptionEndDate } = planData;
        return await User.findOneAndUpdate(
            { userId }, 
            { subscription, subscriptionEndDate }, 
            { new: true }
        );
    }

    async updateUserCredits(userId, credits) {
        return await User.findOneAndUpdate(
            { userId }, 
            { credits }, 
            { new: true }
        );

        
    }

    async addUserCredits(userId, credits) {
        console.log("credits", credits);
        
        // Önce mevcut kullanıcıyı bul
        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            throw new Error('Kullanıcı bulunamadı');
        }

        // Sonra kredileri güncelle
        return await User.findOneAndUpdate(
            { userId }, 
            { $inc: { credits: credits } }, // $inc kullanımı daha güvenli
            { new: true }
        );
    }

    constructor() {
        // Her ayın 1'inde çalışacak cron job
        const cronSchedule = '0 0 1 * *'; // Her ayın 1'i saat 00:00'da
        cron.schedule(cronSchedule, async () => {
            try {
                // Free abonelikler için 12 kredi
                await User.updateMany(
                    { subscription: 'free' },
                    { $set: { credits: 12 } }
                );

                // Plus abonelikler için 200 kredi
                await User.updateMany(
                    { subscription: 'plus' },
                    { $set: { credits: 200 } }
                );

                // Premium abonelikler için sınırsız (999999) kredi  
                await User.updateMany(
                    { subscription: 'premium' },
                    { $set: { credits: 999999 } }
                );

                console.log('Aylık kredi güncellemesi başarıyla tamamlandı');
            } catch (error) {
                console.error('Aylık kredi güncellemesi sırasında hata:', error);
            }

            
        });

        // Her pazartesi günü saat 00:00'da çalışacak cron job
        cron.schedule('0 0 * * 1', async () => {
            try {
                // Tüm kullanıcıların haftalık çark çevirme hakkını true yap
                await User.updateMany(
                    {},
                    { $set: { canWeeklySpin: true } }
                );
                console.log('Haftalık çark çevirme hakları başarıyla güncellendi');
            } catch (error) {
                console.error('Haftalık çark güncellemesi sırasında hata:', error);
            }
        });
    }

    async getUserInfo(userId) {
        return await User.findOne({ userId });
    }

    async updateSubscription(userId, subscriptionData) {
        const { subscription, subscriptionEndDate } = subscriptionData;
        return await User.findByIdAndUpdate(
            userId,
            { subscription, subscriptionEndDate },
            { new: true }
        );
    }

    async updateWeeklySpin(userId, canWeeklySpin) {
        return await User.findOneAndUpdate(
            { userId },
            { canWeeklySpin },
            { new: true }
        );
    }
}

export default new UserService();
