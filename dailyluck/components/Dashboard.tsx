
import React from 'react';
import { UserProfile, FortuneData } from '../types';

interface DashboardProps {
  user: UserProfile;
  fortune: FortuneData;
  onRefresh: () => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, fortune, onRefresh, onReset }) => {
  const scoreColor = fortune.overallScore >= 80 ? 'text-emerald-400' : fortune.overallScore >= 50 ? 'text-amber-400' : 'text-rose-400';

  // 띠별 아이콘 매핑 (Font Awesome 6 Free 기반 최적화)
  const zodiacIcons: Record<string, string> = {
    "쥐": "fa-cheese",         // 기민함과 식복
    "소": "fa-cow",            // 성실함
    "호랑이": "fa-shield-cat",   // 용맹함 (Free에 tiger가 없어 방패와 고양이과 조합 상징)
    "토끼": "fa-carrot",         // 귀여움과 활기
    "용": "fa-dragon",          // 신성함
    "뱀": "fa-staff-snake",      // 지혜와 치유
    "말": "fa-horse",           // 역동성
    "양": "fa-sheep",           // 온유함
    "원숭이": "fa-masks-theater", // 재치와 다재다능
    "닭": "fa-sun",             // 부지런함 (아침을 알림)
    "개": "fa-dog",             // 충성심
    "돼지": "fa-coins"           // 풍요와 복
  };

  // 별자리 아이콘 매핑 (점성술적 의미와 원소 상징 반영)
  const starIcons: Record<string, string> = {
    "양자리": "fa-fire-flame-curved", // 열정적인 불의 원소
    "황소자리": "fa-gem",              // 가치와 풍요를 추구하는 흙
    "쌍둥이자리": "fa-comments",        // 소통과 정보의 공기
    "게자리": "fa-house-heart",        // 가정적이고 감성적인 물 (Free 조합 상징)
    "사자자리": "fa-crown",             // 왕의 기질과 태양
    "처녀자리": "fa-wheat-awn",         // 분석적이고 결실을 맺는 흙
    "천칭자리": "fa-scale-balanced",    // 균형과 평화의 공기
    "전갈자리": "fa-bolt-lightning",     // 강렬한 에너지와 변화의 물
    "사수자리": "fa-compass",           // 모험과 철학의 불
    "염소자리": "fa-mountain",          // 인내와 성취의 흙
    "물병자리": "fa-lightbulb",         // 혁신과 인도주의의 공기
    "물고기자리": "fa-fish-fins"          // 예술적 영감과 유영하는 물
  };

  const currentZodiacIcon = zodiacIcons[fortune.zodiacSign] || "fa-paw";
  const currentStarIcon = starIcons[fortune.starSign] || "fa-star";

  const handleShare = async () => {
    const shareText = `✨ ${user.name}님의 오늘의 운세 ✨\n\n📅 날짜: ${fortune.date}\n💯 총점: ${fortune.overallScore}점\n🐉 띠(${fortune.zodiacSign}): ${fortune.zodiacFortune.substring(0, 50)}...\n🌟 별자리(${fortune.starSign}): ${fortune.starFortune.substring(0, 50)}...\n\n🍀 행운의 숫자: ${fortune.luckyNumber}\n🎨 행운의 색상: ${fortune.luckyColor}\n\n💬 오늘의 명언: "${fortune.dailyQuote}" - ${fortune.quoteAuthor}\n\n#오늘의운세 #DailyLuck`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Luck - 오늘의 운세',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('운세가 클립보드에 복사되었습니다! 원하는 곳에 붙여넣어 공유하세요.');
      } catch (err) {
        console.error('Clipboard failed', err);
      }
    }
  };

  // Circular progress math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fortune.overallScore / 100) * circumference;

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-10 duration-700">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-2 px-2">
        <div>
          <h2 className="text-2xl font-bold text-white">{user.name}님의 운세</h2>
          <p className="text-indigo-300 text-sm">{fortune.date} 기준 (KST 09:00 업데이트)</p>
        </div>
        <button 
          onClick={onReset}
          className="text-white/40 hover:text-white/80 transition-colors p-2"
          title="설정 초기화"
        >
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>

      {/* Main Score Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative">
          <p className="text-indigo-200 text-xs uppercase tracking-widest mb-6">Overall Fortune Score</p>
          
          <div className="relative flex items-center justify-center w-40 h-40 mx-auto mb-8">
            <svg className="absolute w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                style={{ 
                  strokeDashoffset: offset,
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: 'url(#glow)'
                }}
                strokeLinecap="round"
                className={`${scoreColor}`}
              />
            </svg>
            <div className={`text-6xl font-serif z-10 ${scoreColor} animate-pulse-slow`}>
              {fortune.overallScore}
            </div>
          </div>

          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <p className="text-white/40 text-[10px] uppercase tracking-tighter mb-1">Lucky Color</p>
              <p className="text-white font-medium text-sm">{fortune.luckyColor}</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-[10px] uppercase tracking-tighter mb-1">Lucky Number</p>
              <p className="text-white font-medium text-sm">{fortune.luckyNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quote Section */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center italic shadow-inner">
        <div className="text-indigo-400 text-2xl mb-3">
          <i className="fa-solid fa-quote-left"></i>
        </div>
        <p className="text-white text-lg font-medium leading-relaxed mb-4">
          {fortune.dailyQuote}
        </p>
        <p className="text-indigo-300 text-sm not-italic font-bold tracking-tight">— {fortune.quoteAuthor}</p>
      </div>

      {/* Zodiac Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl group hover:bg-white/10 transition-all duration-300 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl text-indigo-300 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all">
            <i className={`fa-solid ${currentZodiacIcon}`}></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">오늘의 띠: {fortune.zodiacSign}</h3>
            <p className="text-indigo-300/60 text-xs tracking-wide">Oriental Zodiac</p>
          </div>
        </div>
        <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">
          {fortune.zodiacFortune}
        </p>
      </div>

      {/* Star Sign Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl group hover:bg-white/10 transition-all duration-300 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl text-purple-300 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all">
            <i className={`fa-solid ${currentStarIcon}`}></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">별자리 운세: {fortune.starSign}</h3>
            <p className="text-purple-300/60 text-xs tracking-wide">Western Horoscope</p>
          </div>
        </div>
        <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">
          {fortune.starFortune}
        </p>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-4 w-full flex space-x-3 pt-4 bg-transparent z-20">
        <button 
          onClick={handleShare}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 active:scale-95"
        >
          <i className="fa-solid fa-share-nodes"></i>
          <span>운세 공유</span>
        </button>
        <button 
          onClick={onRefresh}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 border border-white/10 backdrop-blur-md active:scale-95"
        >
          <i className="fa-solid fa-rotate"></i>
          <span>새로고침</span>
        </button>
      </div>

      <p className="text-center text-white/20 text-[10px] pb-12 leading-loose">
        본 서비스는 Gemini AI 분석 결과를 제공합니다.<br/>
        매일 오전 9시(KST) 당신을 위한 새로운 운세가 업데이트됩니다.
      </p>
    </div>
  );
};

export default Dashboard;
