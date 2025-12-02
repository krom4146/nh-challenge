```javascript
import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOutletContext } from 'react-router-dom';

const Cheer = () => {
    const { isAdmin } = useOutletContext();
    const [messages, setMessages] = useState([]);
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();

        const subscription = supabase
            .channel('messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prev) => [payload.new, ...prev]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!author.trim() || !content.trim()) {
            alert('이름과 메시지를 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert([{ author, content }]);

            if (error) throw error;

            setAuthor('');
            setContent('');
            fetchMessages(); 
        } catch (error) {
            console.error('Error submitting message:', error);
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
            // Real-time subscription will handle the UI update
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
        if (diff < 3600) return `${ Math.floor(diff / 60) }분 전`;
        if (diff < 86400) return `${ Math.floor(diff / 3600) }시간 전`;
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
                        <div key={msg.id || Math.random()} className="glass-panel p-4 rounded-xl shadow-sm relative group">
                            {isAdmin && (
                                <button 
                                    onClick={() => handleDelete(msg.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                            <div className="flex justify-between items-start mb-2 pr-6">
                                <div className="flex items-center space-x-2">
                                    <span className="w-8 h-8 rounded-full bg-nh-green/10 flex items-center justify-center text-nh-green font-bold text-xs">
                                        {(msg.author && msg.author.charAt(0)) || '?'}
                                    </span>
                                    <span className="font-bold text-gray-800 text-sm">{msg.author || '익명'}</span>
                                </div>
                                <span className="text-[10px] text-gray-400">{formatTime(msg.created_at)}</span>
                            </div>
                            <p className="text-gray-700 text-sm pl-10 break-all">{msg.content || ''}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="glass-panel p-3 rounded-xl space-y-2 shrink-0 shadow-lg">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="이름"
                        className="w-1/4 px-3 py-2 rounded-lg bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nh-green/50 text-sm"
                    />
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="응원 메시지를 입력하세요"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nh-green/50 text-sm"
                    />
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-nh-green to-[#006c3e] text-white font-bold rounded-lg shadow-md btn-press flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    ) : (
                        <>
                            <Send size={16} />
                            <span>응원 메시지 남기기</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Cheer;
```
