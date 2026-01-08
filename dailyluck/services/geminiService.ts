
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FortuneData } from "../types";
import { getZodiacFromYear, getStarSign } from "../utils/dateUtils";

export const fetchDailyFortune = async (user: UserProfile): Promise<FortuneData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const birthDate = new Date(user.birthDate);
  const zodiac = getZodiacFromYear(birthDate.getFullYear());
  const starSign = getStarSign(birthDate.getMonth() + 1, birthDate.getDate());
  
  const prompt = `
    오늘의 날짜: ${new Date().toLocaleDateString('ko-KR')}
    사용자 정보: 생년월일 ${user.birthDate}, 성별 무관, 이름 ${user.name}
    해당 사용자의 띠: ${zodiac}
    해당 사용자의 별자리: ${starSign}
    
    이 정보를 바탕으로 다음을 작성해줘:
    1. 오늘의 띠별 운세와 별자리 운세 (상세하고 긍정적으로)
    2. 행운의 숫자(1-99 사이)와 행운의 색상(한국어 명칭)
    3. 전체적인 운세 점수 (100점 만점)
    4. 오늘의 사용자에게 영감을 줄 수 있는 '오늘의 명언'과 그 '저자'
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          zodiacFortune: { type: Type.STRING },
          starFortune: { type: Type.STRING },
          luckyNumber: { type: Type.STRING },
          luckyColor: { type: Type.STRING },
          overallScore: { type: Type.NUMBER },
          dailyQuote: { type: Type.STRING },
          quoteAuthor: { type: Type.STRING }
        },
        required: ["zodiacFortune", "starFortune", "luckyNumber", "luckyColor", "overallScore", "dailyQuote", "quoteAuthor"]
      }
    }
  });

  const rawJson = JSON.parse(response.text || "{}");
  
  return {
    date: new Date().toISOString().split('T')[0],
    zodiacSign: zodiac,
    starSign: starSign,
    zodiacFortune: rawJson.zodiacFortune,
    starFortune: rawJson.starFortune,
    luckyNumber: rawJson.luckyNumber,
    luckyColor: rawJson.luckyColor,
    overallScore: rawJson.overallScore,
    dailyQuote: rawJson.dailyQuote,
    quoteAuthor: rawJson.quoteAuthor,
    lastUpdated: new Date().toISOString()
  };
};
