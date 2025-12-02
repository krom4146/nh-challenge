import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Cheer = () => {
    const { isAdmin } = useOutletContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prev) => [payload.new, ...prev]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert([{ content: newMessage }]);

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('메시지 전송 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('정말로 이 메시지를 삭제하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('메시지 삭제 중 오류가 발생했습니다.');
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return '방금 전';
        if (diff < 3600) return Math.floor(diff / 60) + '분 전';
        if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
        return date.toLocaleDateString();
    };

    return (
        <div className="flex flex-col h-full space-y-4 pb-2">
            <div className="text-center space-y-1 shrink-0">
                <h2 className="text-2xl font-bold text-gradient">농업인 응원하기</h2>
                <p className="text-sm text-gray-700">
                    따뜻한 응원의 한마디를 남겨주세요.
                </p>
            </div>

            {/* Message List Area */}
            <div className="flex-1 overflow-y-auto space-y-3 p-1 scrollbar-hide">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nh-green"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="glass-panel p-6 rounded-xl text-center text-gray-600">
                        <Megaphone className="mx-auto mb-2 text-nh-green opacity-50" size={32} />
                        <p>아직 작성된 응원 메시지가 없습니다.<br />첫 번째 응원을 남겨주세요!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="glass-panel p-4 rounded-xl shadow-sm relative group">
                            <p className="text-gray-800 break-words pr-6">{msg.content}</p>
                            <span className="text-xs text-gray-400 mt-2 block text-right">
                                {formatTime(msg.created_at)}
                            </span>

                            {/* Admin Delete Button */}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="shrink-0 pt-2">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="응원 메시지를 입력하세요..."
                        className="flex-1 px-4 py-3 rounded-xl border border-white/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-nh-green shadow-sm"
                        maxLength={100}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newMessage.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-nh-green to-emerald-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center justify-center min-w-[3.5rem]"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Cheer;
