import React from 'react';

const Quiz = () => {
    return (
        <div className="flex flex-col h-full justify-center items-center p-6 space-y-8 animate-fade-in pb-20">
            
            <div className="text-center space-y-4">
                <span className="text-6xl animate-bounce block">🌾</span>
                <h2 className="text-2xl font-bold text-gray-800">
                    도전! 농심(農心) 마스터
                </h2>
                <p className="text-gray-600 break-keep leading-relaxed">
                    아래 버튼을 누르면<br/>
                    <strong>'도전! 농심천심 마스터'</strong>로 이동합니다.
                </p>
            </div>

            <div className="w-full space-y-4">
                {/* 새 앱으로 이동하는 버튼 */}
                <a href="https://nongshim-master.vercel.app" target="_self" className="block w-full">
                    <button className="w-full py-5 bg-gradient-to-r from-nh-green to-[#006c3e] text-white font-bold rounded-2xl shadow-xl btn-press flex items-center justify-center space-x-2 text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <span>🚀 스탬프 투어 하러가기</span>
                    </button>
                </a>

                <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-sm text-blue-600 font-bold">
                        💡 팁: 현장의 QR코드를 카메라로 찍으면<br/>
                        바로 미션으로 연결됩니다.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Quiz;
