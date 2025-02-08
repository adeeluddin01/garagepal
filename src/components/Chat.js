import { useEffect, useState } from "react";

const Chat = ({ receiverId, receiverType, senderType, authToken }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        fetchMessages();
    }, [receiverId]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/messages?chatWith=${receiverId}&chatType=${receiverType}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ receiverId, receiverType, senderType, content: newMessage }),
            });

            if (response.ok) {
                setNewMessage("");
                fetchMessages();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Chat</h2>
            <div className="h-64 overflow-y-auto border p-2 mb-2">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.senderUserId === receiverId ? "text-left" : "text-right"}>
                        <p className="bg-gray-200 p-2 rounded inline-block">{msg.content}</p>
                    </div>
                ))}
            </div>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="border p-2 w-full" placeholder="Type a message..." />
            <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 py-2 mt-2 rounded">Send</button>
        </div>
    );
};

export default Chat;
