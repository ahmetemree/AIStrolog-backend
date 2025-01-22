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
        const { subscription, subscriptionStartDate, subscriptionEndDate, credits } = planData;
        return await User.findOneAndUpdate(
            { userId }, 
            { subscription, subscriptionStartDate, subscriptionEndDate,credits }, 
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
        // Her gün kontrol et
        cron.schedule('0 0 * * *', async () => {
            try {
                const users = await User.find({});
                
                for (const user of users) {
                    if (!user.subscriptionStartDate) continue;

                    const nextResetDate = new Date(user.subscriptionStartDate);
                    nextResetDate.setMonth(nextResetDate.getMonth() + 1);
                    
                    const today = new Date();
                    
                    // Eğer bugün reset tarihi ise kredileri güncelle
                    if (today.toDateString() === nextResetDate.toDateString()) {
                        let newCredits = 12; // varsayılan free credits
                        
                        if (user.subscription === 'plus') {
                            newCredits = 200;
                        } else if (user.subscription === 'premium') {
                            newCredits = 999999;
                        }
                        
                        await User.findByIdAndUpdate(user._id, {
                            $set: { 
                                credits: newCredits,
                                subscriptionStartDate: new Date() // Yeni periyot için tarihi güncelle
                            }
                        });
                        
                        console.log(`${user._id} ID'li kullanıcının kredileri güncellendi: ${newCredits}`);
                    }
                }
                
                console.log('Günlük kredi kontrolleri tamamlandı');
            } catch (error) {
                console.error('Kredi güncellemesi sırasında hata:', error);
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

    

    async updateWeeklySpin(userId, canWeeklySpin) {
        return await User.findOneAndUpdate(
            { userId },
            { canWeeklySpin },
            { new: true }
        );
    }
}

export default new UserService();
