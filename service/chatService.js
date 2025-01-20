import Chat from '../models/chat.js';
import UserChats from '../models/userChat.js';

class ChatService {
    async getUserChats(userId) {
        try {
            const userChats = await UserChats.find({ userId: userId });
            return { status: 200, data: userChats };
        } catch (error) {
            return { status: 500, error: "Failed to fetch user chats" };
        }
    }

    async createChat(userId, chatId, title, history) {
        const newChat = new UserChats({
            userId,
            chats: [{
                _id: chatId,
                title,
                createdAt: new Date()
            }]
        });
        const newDetailedChat = new Chat({
            userId,
            chatId,
            history
        });
        
        try {
            const savedChat = await newChat.save();
            const savedDetailedChat = await newDetailedChat.save();
            return { status: 201, data: savedChat };
        } catch (error) {
            return { status: 500, error: "Failed to create user chat" };
        }
    }

    async getChatById(chatId) {
        try {
            const chat = await Chat.findOne({ chatId: chatId });
            return { status: 200, data: chat };
        } catch (error) {
            return { status: 500, error: "Failed to get chat" };
        }
    }

    async updateChat(chatId, role, parts) {
        try {
            await Chat.findOneAndUpdate(
                { chatId: chatId },
                { $push: { history: { role: role, parts: parts } } },
                { new: true }
            );
            return { status: 200, message: "Chat updated successfully" };
        } catch (error) {
            return { status: 500, error: "Failed to update chat" };
        }
    }

    async deleteChat(chatId) {
        try {
            await UserChats.findOneAndDelete({ "chats._id": chatId });
            await Chat.findOneAndDelete({ chatId: chatId });
            const userChats = await UserChats.find();
            return { status: 200, data: userChats };
        } catch (error) {
            return { status: 500, error: "Failed to delete chat" };
        }
    }
}

export default new ChatService();
