
export const getKSTDate = (): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kstOffset = 9 * 60; // KST is UTC+9
  return new Date(utc + (kstOffset * 60000));
};

export const formatDateToKSTString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const isPast9AMKST = (): boolean => {
  const kstNow = getKSTDate();
  return kstNow.getHours() >= 9;
};

export const getZodiacFromYear = (year: number): string => {
  const animals = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
  return animals[year % 12];
};

export const getStarSign = (month: number, day: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "쌍둥이자리";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "게자리";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 23)) return "처녀자리";
  if ((month === 9 && day >= 24) || (month === 10 && day <= 22)) return "천칭자리";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return "전갈자리";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 24)) return "사수자리";
  if ((month === 12 && day >= 25) || (month === 1 && day <= 19)) return "염소자리";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리";
  return "물고기자리";
};
