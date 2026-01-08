
export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  isRegistered: boolean;
}

export interface FortuneData {
  date: string;
  zodiacSign: string; // 띠 (쥐, 소, 호랑이 등)
  starSign: string;   // 별자리 (양, 황소 등)
  zodiacFortune: string;
  starFortune: string;
  luckyNumber: string;
  luckyColor: string;
  overallScore: number; // 1-100
  dailyQuote: string;   // 오늘의 명언
  quoteAuthor: string;  // 명언 저자
  lastUpdated: string; // ISO String
}

export enum AppStatus {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  LOADING = 'LOADING'
}
