import User from "../models/user.js";

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
