
import React from 'react';
import { UserProfile, FortuneData } from './types';

interface DashboardProps {
  user: UserProfile;
  fortune: FortuneData;
  onRefresh: () => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, fortune, onRefresh, onReset }) => {
  const scoreColor = fortune.overallScore >= 80 ? 'text-emerald-400' : fortune.overallScore >= 50 ? 'text-amber-400' : 'text-rose-400';

  const zodiacIcons: Record<string, string> = {
    "쥐": "fa-cheese", "소": "fa-cow", "호랑이": "fa-shield-cat", "토끼": "fa-carrot", 
    "용": "fa-dragon", "뱀": "fa-staff-snake", "말": "fa-horse", "양": "fa-sheep", 
    "원숭이": "fa-masks-theater", "닭": "fa-sun", "개": "fa-dog", "돼지": "fa-coins"
  };

  const starIcons: Record<string, string> = {
    "양자리": "fa-fire-flame-curved", "황소자리": "fa-gem", "쌍둥이자리": "fa-comments", 
    "게자리": "fa-house-heart", "사자자리": "fa-crown", "처녀자리": "fa-wheat-awn", 
    "천칭자리": "fa-scale-balanced", "전갈자리": "fa-bolt-lightning", "사수자리": "fa-compass", 
    "염소자리": "fa-mountain", "물병자리": "fa-lightbulb", "물고기자리": "fa-fish-fins"
  };

  const currentZodiacIcon = zodiacIcons[fortune.zodiacSign] || "fa-paw";
  const currentStarIcon = starIcons[fortune.starSign] || "fa-star";

  const handleShare = async () => {
    const shareText = `✨ ${user.name}님의 오늘의 운세 ✨\n\n📅 날짜: ${fortune.date}\n💯 총점: ${fortune.overallScore}점\n🐉 띠(${fortune.zodiacSign}): ${fortune.zodiacFortune.substring(0, 50)}...\n🌟 별자리(${fortune.starSign}): ${fortune.starFortune.substring(0, 50)}...\n\n🍀 행운의 숫자: ${fortune.luckyNumber}\n🎨 행운의 색상: ${fortune.luckyColor}\n\n💬 오늘의 명언: "${fortune.dailyQuote}" - ${fortune.quoteAuthor}\n\n#오늘의운세 #DailyLuck`;

    if (navigator.share) {
      try { await navigator.share({ title: 'Daily Luck', text: shareText, url: window.location.href }); } 
      catch (err) { console.error('Sharing failed', err); }
    } else {
      try { await navigator.clipboard.writeText(shareText); alert('클립보드에 복사되었습니다!'); } 
      catch (err) { console.error('Clipboard failed', err); }
    }
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fortune.overallScore / 100) * circumference;

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex justify-between items-center mb-2 px-2">
        <div>
          <h2 className="text-2xl font-bold text-white">{user.name}님의 운세</h2>
          <p className="text-indigo-300 text-sm">{fortune.date} 기준 (KST 09:00 업데이트)</p>
        </div>
        <button onClick={onReset} className="text-white/40 hover:text-white/80 transition-colors p-2">
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative">
          <p className="text-indigo-200 text-xs uppercase tracking-widest mb-6">Overall Fortune Score</p>
          <div className="relative flex items-center justify-center w-40 h-40 mx-auto mb-8">
            <svg className="absolute w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s ease-out' }} strokeLinecap="round" className={`${scoreColor}`} />
            </svg>
            <div className={`text-6xl font-serif z-10 ${scoreColor}`}>{fortune.overallScore}</div>
          </div>
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <p className="text-white/40 text-[10px] uppercase mb-1">Lucky Color</p>
              <p className="text-white font-medium text-sm">{fortune.luckyColor}</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-[10px] uppercase mb-1">Lucky Number</p>
              <p className="text-white font-medium text-sm">{fortune.luckyNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 p-6 rounded-3xl text-center italic">
        <p className="text-white text-lg font-medium mb-4">"{fortune.dailyQuote}"</p>
        <p className="text-indigo-300 text-sm not-italic font-bold">— {fortune.quoteAuthor}</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300">
            <i className={`fa-solid ${currentZodiacIcon}`}></i>
          </div>
          <h3 className="font-bold text-white">오늘의 띠: {fortune.zodiacSign}</h3>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{fortune.zodiacFortune}</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-300">
            <i className={`fa-solid ${currentStarIcon}`}></i>
          </div>
          <h3 className="font-bold text-white">별자리 운세: {fortune.starSign}</h3>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{fortune.starFortune}</p>
      </div>

      <div className="sticky bottom-4 w-full flex space-x-3 pt-4 z-20">
        <button onClick={handleShare} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/30">운세 공유</button>
        <button onClick={onRefresh} className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-bold border border-white/10 backdrop-blur-md">새로고침</button>
      </div>
    </div>
  );
};

export default Dashboard;
