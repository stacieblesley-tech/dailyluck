
import React, { useState } from 'react';
import { UserProfile } from './types';

interface OnboardingProps {
  onRegister: (user: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      alert('이름과 생년월일을 입력해주세요!');
      return;
    }
    onRegister({
      ...formData,
      isRegistered: true
    });
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif text-white mb-2">Daily Luck</h1>
        <p className="text-indigo-300">매일 오전 9시, 행운의 메시지를 전달합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">이름</label>
          <input
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">생년월일</label>
          <input
            type="date"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/50 transition-all active:scale-95"
        >
          운세 받아보기 시작
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
