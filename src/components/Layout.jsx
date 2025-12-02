import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FileText, HelpCircle, Camera, Megaphone } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: '/', label: '서약', icon: FileText },
        { id: '/quiz', label: '퀴즈', icon: HelpCircle },
        { id: '/proof', label: '인증샷', icon: Camera },
        { id: '/cheer', label: '응원', icon: Megaphone },
    ];

    return (
        <div className="min-h-screen bg-rural flex justify-center items-center font-sans">
            {/* Mobile Container */}
            <div className="w-full max-w-md h-[100dvh] flex flex-col overflow-hidden relative shadow-2xl sm:rounded-3xl sm:h-[90vh] sm:border sm:border-white/30">

                {/* Glass Overlay Background for Container */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10"></div>

                {/* Header */}
                <header className="glass-nav p-4 text-center shrink-0 z-10">
                    <h1 className="text-xl font-bold text-nh-green tracking-tight">농심천심 챌린지</h1>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    <Outlet />
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
            </div>
        </div>
    );
};

export default Layout;
