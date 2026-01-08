
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, FortuneData, AppStatus } from './types';
import { getKSTDate, formatDateToKSTString, isPast9AMKST } from './dateUtils';
import { fetchDailyFortune } from './geminiService';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.LOADING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_profile');
    const savedFortune = localStorage.getItem('last_fortune');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (savedFortune) {
        setFortune(JSON.parse(savedFortune));
      }
      setStatus(AppStatus.DASHBOARD);
    } else {
      setStatus(AppStatus.ONBOARDING);
    }
  }, []);

  const updateFortune = useCallback(async (profile: UserProfile) => {
    try {
      setStatus(AppStatus.LOADING);
      const newFortune = await fetchDailyFortune(profile);
      setFortune(newFortune);
      localStorage.setItem('last_fortune', JSON.stringify(newFortune));
      setStatus(AppStatus.DASHBOARD);

      if (Notification.permission === 'granted') {
        new Notification('오늘의 운세가 도착했습니다!', {
          body: `오전 9시 업데이트 완료! 행운의 점수는 ${newFortune.overallScore}점입니다.`,
          icon: 'https://cdn-icons-png.flaticon.com/512/1154/1154944.png'
        });
      }
    } catch (err: any) {
      setError(err.message || '운세를 불러오는 중 오류가 발생했습니다.');
      setStatus(AppStatus.DASHBOARD);
    }
  }, []);

  useEffect(() => {
    if (status !== AppStatus.DASHBOARD || !user) return;

    const checkInterval = setInterval(() => {
      const nowKst = getKSTDate();
      const todayKstStr = formatDateToKSTString(nowKst);
      
      const shouldUpdate = 
        isPast9AMKST() && 
        (!fortune || fortune.date !== todayKstStr);

      if (shouldUpdate) {
        updateFortune(user);
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [status, user, fortune, updateFortune]);

  const handleRegister = (profile: UserProfile) => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setUser(profile);
    updateFortune(profile);
    
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleReset = () => {
    localStorage.clear();
    setUser(null);
    setFortune(null);
    setStatus(AppStatus.ONBOARDING);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col justify-center items-center">
      {status === AppStatus.LOADING && (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-300 font-medium">별자리를 분석 중입니다...</p>
        </div>
      )}

      {status === AppStatus.ONBOARDING && (
        <Onboarding onRegister={handleRegister} />
      )}

      {status === AppStatus.DASHBOARD && user && fortune && (
        <Dashboard 
          user={user} 
          fortune={fortune} 
          onRefresh={() => updateFortune(user)} 
          onReset={handleReset}
        />
      )}

      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-900/90 backdrop-blur-md text-red-100 p-4 rounded-xl border border-red-500/50 text-center z-50 shadow-2xl">
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
