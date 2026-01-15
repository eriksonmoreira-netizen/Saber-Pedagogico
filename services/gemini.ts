'use server';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudentAnalysis = async (studentName: string, grades: number[], attendance: number, occurrences: number) => {
  if (!process.env.API_KEY) {
    return JSON.stringify({
      prediction: "Chave de API não configurada no servidor.",
      highlights: "Contate o administrador.",
      bnccAlignment: "N/A",
      status: "REGULAR"
    });
  }

  try {
    const prompt = `
      Atue como um Especialista Pedagógico Sênior especializado na BNCC.
      Analise o perfil:
      - Aluno: ${studentName}
      - Notas: ${grades.join(', ')}
      - Frequência: ${attendance}%
      - Ocorrências: ${occurrences}

      Gere um JSON com:
      1. prediction (previsão de desempenho)
      2. highlights (pontos fortes e de atenção)
      3. bnccAlignment (competência da BNCC sugerida)
      4. status (ATENÇÃO, REGULAR, ou EXCELENTE)

      Estrutura do JSON:
      {
        "prediction": "string",
        "highlights": "string",
        "bnccAlignment": "string",
        "status": "string"
      }
    `;

    // Using gemini-3-flash-preview as per prompt requirements for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({
      prediction: "Serviço de IA indisponível momentaneamente.",
      highlights: "Verifique sua conexão.",
      bnccAlignment: "N/A",
      status: "REGULAR"
    });
  }
};

export const generateLessonPlan = async (subject: string, topic: string, gradeLevel: string = "Ensino Fundamental II") => {
  if (!process.env.API_KEY) return JSON.stringify({ title: "Erro API Key", objective: "N/A", activities: [] });

  try {
    const prompt = `
      Crie um Plano de Aula estruturado para ${subject}, tópico "${topic}", nível ${gradeLevel}.
      O plano deve seguir a BNCC e usar Metodologias Ativas.
      
      Retorne APENAS um JSON:
      {
        "title": "string",
        "duration": "string",
        "bnccCode": "string",
        "objective": "string",
        "methodology": "string",
        "activities": [ { "time": "string", "description": "string" } ],
        "assessment": "string"
      }
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return response.text || "{}";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({
      title: "Erro na geração",
      objective: "Não foi possível conectar à IA.",
      activities: []
    });
  }
}