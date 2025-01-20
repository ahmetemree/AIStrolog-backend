import chatService from '../service/chatService.js';

export const getChats = async (req, res) => {
    try {
        const userId = req.auth.userId;
        if (!userId) {
            return res.status(401).json({ message: "Kullanıcı kimliği doğrulanamadı" });
        }
        const result = await chatService.getUserChats(userId);
        res.status(result.status).json(result.data || { message: result.error });
    } catch (error) {
        res.status(500).json({ message: "Sohbetler getirilemedi", error: error.message });
    }
};

export const createChat = async (req, res) => {
    try {
        const { chatId, title, history } = req.body;
        const userId = req.auth.userId;
        const result = await chatService.createChat(userId, chatId, title, history);
        res.status(result.status).json(result.data || { message: result.error });
    } catch (error) {
        res.status(500).json({ message: "Sohbet oluşturulamadı", error: error.message });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const result = await chatService.getChatById(chatId);
        res.status(result.status).json(result.data || { message: result.error });
    } catch (error) {
        res.status(500).json({ message: "Sohbet bulunamadı", error: error.message });
    }
};

export const updateChat = async (req, res) => {
    try {
        const { role, parts } = req.body;
        const { chatId } = req.params;
        const result = await chatService.updateChat(chatId, role, parts);
        res.status(result.status).json(result.data || { message: result.error });
    } catch (error) {
        res.status(500).json({ message: "Sohbet güncellenemedi", error: error.message });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const result = await chatService.deleteChat(chatId);
        res.status(result.status).json(result.data || { message: result.error });
    } catch (error) {
        res.status(500).json({ message: "Sohbet silinemedi", error: error.message });
    }
};