
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FortuneData } from "./types";
import { getZodiacFromYear, getStarSign } from "./dateUtils";

export const fetchDailyFortune = async (user: UserProfile): Promise<FortuneData> => {
  // Vite 환경에서는 process.env.API_KEY가 define을 통해 주입됩니다.
  const apiKey = (process.env as any).API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY가 설정되지 않았습니다. Vercel Environment Variables에 API_KEY를 추가해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const birthDate = new Date(user.birthDate);
  const zodiac = getZodiacFromYear(birthDate.getFullYear());
  const starSign = getStarSign(birthDate.getMonth() + 1, birthDate.getDate());
  
  const today = new Date().toLocaleDateString('ko-KR');
  
  const prompt = `
    오늘의 날짜: ${today}
    사용자 정보: 이름 ${user.name}, 생년월일 ${user.birthDate}
    사용자의 띠: ${zodiac}
    사용자의 별자리: ${starSign}
    
    위 정보를 바탕으로 한국어로 다음을 작성해줘:
    1. 오늘의 띠별 운세와 별자리 운세 (상세하고 희망차게)
    2. 행운의 숫자(1-99)와 행운의 색상
    3. 전체적인 운세 점수 (1-100점 사이 숫자만)
    4. 오늘의 사용자에게 어울리는 명언과 저자
  `;

  try {
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

    const text = response.text;
    if (!text) throw new Error("AI 응답이 올바르지 않습니다.");
    
    const rawJson = JSON.parse(text);
    
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
  } catch (error) {
    console.error("Fortune fetch error:", error);
    throw error;
  }
};
