import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Pledge = () => {
    const [name, setName] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [pledgeCount, setPledgeCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPledgeCount();
    }, []);

    const fetchPledgeCount = async () => {
        const { count, error } = await supabase
            .from('pledges')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error fetching pledge count:', error);
        } else {
            setPledgeCount(count || 0);
        }
    };

    const handlePledge = async () => {
        if (!name.trim() || !affiliation.trim()) {
            alert('이름과 소속을 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('pledges')
                .insert([{ name, affiliation }]);

            if (error) throw error;

            alert('서약이 완료되었습니다! 감사합니다.');
            setName('');
            setAffiliation('');
            fetchPledgeCount(); // Refresh count
        } catch (error) {
            console.error('Error submitting pledge:', error);
            alert('서약 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gradient animate-slide-up">디지털 서약서</h2>
                <p className="text-white font-medium animate-slide-up drop-shadow-md" style={{ animationDelay: '0.1s' }}>
                    농업인의 마음을 담아<br />함께 응원합니다.
                </p>
            </div>

            <div className="glass-panel w-full p-8 rounded-2xl space-y-8 animate-slide-up !bg-white/80 backdrop-blur-xl" style={{ animationDelay: '0.2s' }}>
                <div className="text-center space-y-4">
                    <p className="text-gray-800 font-serif text-lg leading-relaxed break-keep">
                        "나는 농협인으로서, 생명을 가꾸는 농업인의 숭고한 땀방울을 기억하며 그들의 마음이 곧 하늘의 뜻임을 가슴 깊이 새기겠습니다.<br /><br />
                        농업의 소중한 가치를 지키고 활력 넘치는 농촌을 만드는 길에 언제나 함께할 것을 굳게 다짐합니다."
                    </p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름을 입력하세요"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nh-green/50 transition-all placeholder-gray-400 text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">소속</label>
                        <input
                            type="text"
                            value={affiliation}
                            onChange={(e) => setAffiliation(e.target.value)}
                            placeholder="소속을 입력하세요"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nh-green/50 transition-all placeholder-gray-400 text-gray-800"
                        />
                    </div>
                </div>

                <button
                    onClick={handlePledge}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-nh-green to-[#006c3e] text-white font-bold rounded-xl shadow-lg btn-press flex items-center justify-center space-x-2 hover:shadow-xl transition-shadow disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    ) : (
                        <span>서약하기</span>
                    )}
                </button>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-base text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    현재 <span className="text-nh-lime text-xl mx-1">{pledgeCount}</span>명이 서약했습니다.
                </p>
            </div>
        </div>
    );
};

export default Pledge;
