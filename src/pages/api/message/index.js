import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: "Invalid token" });
    }

    if (req.method === "POST") {
        const { receiverId, content, senderType, receiverType } = req.body;

        if (!receiverId || !content || !senderType || !receiverType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const message = await prisma.message.create({
                data: {
                    senderUserId: senderType === "user" ? decoded.id : null,
                    senderProviderId: senderType === "serviceProvider" ? decoded.id : null,
                    receiverUserId: receiverType === "user" ? receiverId : null,
                    receiverProviderId: receiverType === "serviceProvider" ? receiverId : null,
                    content,
                },
            });

            return res.status(201).json(message);
        } catch (err) {
            console.error("Error sending message:", err);
            return res.status(500).json({ error: "Failed to send message" });
        }
    }

    if (req.method === "GET") {
        const { chatWith, chatType } = req.query;

        if (!chatWith || !chatType) {
            return res.status(400).json({ error: "ChatWith ID and ChatType required" });
        }

        try {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            senderUserId: chatType === "user" ? decoded.id : null,
                            receiverProviderId: chatType === "serviceProvider" ? parseInt(chatWith) : null,
                        },
                        {
                            senderProviderId: chatType === "serviceProvider" ? decoded.id : null,
                            receiverUserId: chatType === "user" ? parseInt(chatWith) : null,
                        },
                    ],
                },
                orderBy: { sentAt: "asc" },
            });

            return res.status(200).json(messages);
        } catch (err) {
            console.error("Error fetching messages:", err);
            return res.status(500).json({ error: "Failed to fetch messages" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
