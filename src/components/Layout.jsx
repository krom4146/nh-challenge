import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FileText, HelpCircle, Camera, Megaphone, Lock, X } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    const tabs = [
        { id: '/', label: '서약', icon: FileText },
        { id: '/quiz', label: '퀴즈', icon: HelpCircle },
        { id: '/proof', label: '인증샷', icon: Camera },
        { id: '/cheer', label: '응원', icon: Megaphone },
    ];

    const handleAdminLogin = () => {
        if (password === 'nacf1660') {
            setIsAdminAuthenticated(true);
            alert('관리자 모드로 전환되었습니다.');
        } else {
            alert('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-rural flex justify-center items-center font-sans">
            {/* Mobile Container */}
            <div className="w-full max-w-md h-[100dvh] flex flex-col overflow-hidden relative shadow-2xl sm:rounded-3xl sm:h-[90vh] sm:border sm:border-white/30">

                {/* Glass Overlay Background for Container */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10"></div>

                {/* Top Navigation Banner */}
                <a
                    href="https://nh-gurye-edu.vercel.app"
                    className="bg-nh-green text-white text-xs py-2 text-center font-medium hover:bg-green-700 transition-colors shrink-0 z-20"
                >
                    교육원 통합관리 홈으로 가기
                </a>

                {/* Header */}
                <header className="glass-nav p-4 text-center shrink-0 z-10 relative flex justify-center items-center">
                    <h1 className="text-xl font-bold text-nh-green tracking-tight">농심천심 챌린지</h1>
                    <button
                        onClick={() => setIsAdminOpen(true)}
                        className="absolute right-4 text-gray-400 hover:text-nh-green transition-colors"
                    >
                        <Lock size={16} />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    <Outlet context={{ isAdmin: isAdminAuthenticated }} />
                </main>

                {/* Bottom Navigation */}
                <nav className="glass-nav flex justify-around items-center h-16 shrink-0 pb-safe z-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = location.pathname === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.id)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 btn-press ${isActive ? 'text-nh-green' : 'text-gray-500'
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Admin Modal */}
                {isAdminOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">관리자 설정 (Admin v1.1)</h3>
                                <button onClick={() => { setIsAdminOpen(false); setPassword(''); }} className="text-gray-500">
                                    <X size={24} />
                                </button>
                            </div>

                            {!isAdminAuthenticated ? (
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="비밀번호 입력"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nh-green"
                                    />
                                    <button
                                        onClick={handleAdminLogin}
                                        className="w-full py-3 bg-nh-green text-white font-bold rounded-lg"
                                    >
                                        로그인
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-4 bg-green-50 rounded-lg text-center">
                                        <p className="text-nh-green font-bold">관리자 모드 활성화됨</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            각 페이지에서 항목별 삭제(휴지통 아이콘)가 가능합니다.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setIsAdminAuthenticated(false); setIsAdminOpen(false); setPassword(''); }}
                                        className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
