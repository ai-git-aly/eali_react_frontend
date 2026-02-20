import React, { useEffect, useState } from 'react';
import api, { Message } from '../../services/api';
import { Mail, Send, X, Check } from 'lucide-react';

const MessagesManager: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages');
            setMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!selectedMessage || !replyContent.trim()) return;
        setIsReplying(true);
        try {
            await api.post(`/messages/${selectedMessage.id}/reply`, {
                reply_content: replyContent
            });
            setSelectedMessage(null);
            setReplyContent('');
            fetchMessages();
        } catch (err) {
            alert('Failed to send reply');
        } finally {
            setIsReplying(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Manage Messages</h2>
                <div className="text-sm text-gray-600">
                    {messages.filter(m => !m.replied).length} unread messages
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Messages List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-semibold">All Messages</h3>
                    </div>
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">Loading...</div>
                        ) : messages.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No messages found</div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => setSelectedMessage(message)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                                        selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    } ${!message.replied ? 'bg-yellow-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium">{message.name}</span>
                                        {message.replied ? (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                                                <Check size={12} /> Replied
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">New</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">{message.subject}</div>
                                    <div className="text-xs text-gray-400 mt-1">{formatDate(message.created_at)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {selectedMessage ? (
                        <>
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold">Message Details</h3>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="text-xs text-gray-500 uppercase">From</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail size={16} className="text-gray-400" />
                                        <span>{selectedMessage.name} &lt;{selectedMessage.email}&gt;</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-xs text-gray-500 uppercase">Subject</label>
                                    <div className="mt-1 font-medium">{selectedMessage.subject}</div>
                                </div>
                                <div className="mb-6">
                                    <label className="text-xs text-gray-500 uppercase">Message</label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-xs text-gray-500 uppercase">Date</label>
                                    <div className="mt-1 text-gray-600">{formatDate(selectedMessage.created_at)}</div>
                                </div>

                                {/* Reply Section */}
                                {selectedMessage.replied ? (
                                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                                            <Check size={18} />
                                            <span>Reply Sent</span>
                                        </div>
                                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {selectedMessage.reply_content}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 pt-6 border-t">
                                        <label className="block text-sm font-medium mb-2">Send Reply</label>
                                        <textarea
                                            className="w-full p-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Type your reply here..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                        />
                                        <button
                                            onClick={handleReply}
                                            disabled={isReplying || !replyContent.trim()}
                                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send size={18} />
                                            {isReplying ? 'Sending...' : 'Send Reply'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-gray-400">
                            Select a message to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesManager;
