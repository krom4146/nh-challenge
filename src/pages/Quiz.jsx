import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, RefreshCw, ChevronRight } from 'lucide-react';

const questions = [
    {
        id: 1,
        category: "역사",
        question: "농협의 농업·농촌 운동은 시대에 따라 발전해왔습니다. 다음 중 2025년부터 새롭게 추진되는 운동의 명칭은?",
        options: [
            "신토불이 운동",
            "농촌사랑 운동",
            "또 하나의 마을 만들기 운동",
            "농심천심 운동"
        ],
        answer: 3,
        explanation: "1965년 새농민운동을 시작으로, 신토불이(1989), 농도불이(1995), 농촌사랑(2003) 등을 거쳐 2025년 '농심천심 운동'으로 계승·발전합니다."
    },
    {
        id: 2,
        category: "정의",
        question: "'농심천심(農心天心)' 운동의 핵심 의미로 가장 올바른 것은?",
        options: [
            "농촌을 관광지로 개발하는 운동",
            "농산물을 비싸게 파는 운동",
            "농부의 마음을 이해하는 것이 곧 하늘의 뜻을 실현하는 것",
            "도시민을 농촌으로 이주시키는 운동"
        ],
        answer: 2,
        explanation: "농심천심은 먹거리를 생산하는 농부의 마음을 이해하고 중요시하는 것이 하늘의 뜻(天心)을 실현하는 것이라는 의미입니다."
    },
    {
        id: 3,
        category: "철학",
        question: "농심천심 운동의 사상적 배경이 된 세종실록의 문구 '국이민위본(國以民為本), 민이식위천(民以食為天)'의 뜻은?",
        options: [
            "백성은 나라의 근본이고, 밥은 하늘이다.",
            "농업은 천하의 큰 근본이다.",
            "우리 몸에는 우리 농산물이 좋다.",
            "농촌과 도시는 하나다."
        ],
        answer: 0,
        explanation: "'나라는 백성을 근본으로 삼고, 백성은 먹는 것을 하늘로 삼는다'는 뜻으로 식량 안보와 농업의 중요성을 강조한 말입니다."
    },
    {
        id: 4,
        category: "전략",
        question: "농심천심 운동의 3대 추진 전략이 아닌 것은?",
        options: [
            "농업·농촌 가치 확산 (국민)",
            "농업소득 증대 (농업인)",
            "농촌 공간 가치 증대 (농업인)",
            "해외 농업 시장 개척 (수출)"
        ],
        answer: 3,
        explanation: "3대 추진 전략은 ①농업·농촌 가치 공감/참여, ②농업가치 증대, ③농촌공간가치 증대입니다."
    },
    {
        id: 5,
        category: "실천 과제",
        question: "농심천심 운동의 10대 과제 중, '농촌 공간 가치 증대'를 위해 빈집 등을 활용해 도시민이 머물 수 있게 하는 사업은?",
        options: [
            "스쿨팜 조성",
            "농촌살기 시범마을 조성 (4도3촌)",
            "영농작업 대행",
            "스마트팜 보급"
        ],
        answer: 1,
        explanation: "귀농·귀촌 및 생활인구 창출을 위해 체류형 공간을 제공하는 '농촌살기 시범마을' 조성을 추진하여 4도3촌 라이프를 지원합니다."
    }
];

const Quiz = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, message: string, selectedIndex: number }

    const handleAnswer = (selectedIndex) => {
        const currentQuestion = questions[currentStep];
        const isCorrect = currentQuestion.answer === selectedIndex;

        setFeedback({
            isCorrect,
            message: currentQuestion.explanation,
            selectedIndex
        });
    };

    const nextQuestion = () => {
        setFeedback(null);
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setShowResult(false);
        setFeedback(null);
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center shadow-xl animate-float">
                    <Award size={80} className="text-yellow-500 mb-6 drop-shadow-md" />
                    <h1 className="text-3xl font-bold text-gradient mb-2">축하합니다!</h1>
                    <p className="text-xl font-medium text-gray-700 mb-8">당신은 진정한<br />농심 마스터입니다!</p>
                    <button
                        onClick={resetQuiz}
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-nh-green to-[#006c3e] text-white rounded-full font-bold shadow-lg btn-press hover:shadow-xl"
                    >
                        <RefreshCw size={20} />
                        <span>다시 도전하기</span>
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep];

    return (
        <div className="flex flex-col h-full p-2 relative animate-fade-in">
            {/* Progress Bar */}
            <div className="w-full bg-white/30 rounded-full h-2.5 mb-6 backdrop-blur-sm">
                <div
                    className="bg-nh-green h-2.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,152,88,0.5)]"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col mb-4 overflow-y-auto scrollbar-hide">
                <div className="glass-panel w-full p-6 rounded-3xl shadow-lg flex flex-col items-start text-left animate-slide-up mb-4 relative">
                    <div className="flex justify-between items-center w-full mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-nh-green/10 text-nh-green font-bold text-xs">
                            {currentQuestion.category}
                        </span>
                        <button
                            onClick={nextQuestion}
                            className="text-gray-400 text-xs font-medium hover:text-nh-green flex items-center space-x-1 transition-colors"
                        >
                            <span>건너뛰기</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 break-keep leading-relaxed">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Options */}
                <div className="space-y-3 w-full pb-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={feedback !== null}
                            className={`w-full p-4 rounded-xl text-left font-medium text-sm transition-all border-2 ${feedback && feedback.selectedIndex === index
                                ? feedback.isCorrect
                                    ? 'bg-green-100 border-nh-green text-nh-green'
                                    : 'bg-red-100 border-red-500 text-red-500'
                                : 'glass-panel border-transparent hover:border-nh-green/30 active:scale-[0.98]'
                                }`}
                        >
                            <span className="mr-2 opacity-70">{index + 1}.</span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback Overlay */}
            {feedback && (
                <div className="absolute inset-0 z-20 flex items-end justify-center pb-safe">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={nextQuestion}></div>
                    <div className="glass-panel bg-white/95 p-6 rounded-t-3xl w-full max-h-[60vh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-30 animate-slide-up">
                        <div className="flex flex-col items-center text-center mb-4">
                            {feedback.isCorrect ? (
                                <div className="flex items-center space-x-2 text-nh-green mb-2">
                                    <CheckCircle size={32} />
                                    <span className="text-xl font-bold">정답입니다!</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 text-red-500 mb-2">
                                    <XCircle size={32} />
                                    <span className="text-xl font-bold">오답입니다</span>
                                </div>
                            )}
                            <p className="text-gray-700 text-sm font-medium break-keep leading-relaxed bg-gray-50 p-4 rounded-xl w-full text-left">
                                <span className="block font-bold text-gray-900 mb-1">[해설]</span>
                                {feedback.message}
                            </p>
                        </div>
                        <button
                            onClick={nextQuestion}
                            className="w-full py-4 bg-nh-green text-white font-bold rounded-xl shadow-lg btn-press flex items-center justify-center space-x-2"
                        >
                            <span>다음 문제</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
