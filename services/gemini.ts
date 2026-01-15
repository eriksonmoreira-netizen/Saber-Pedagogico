import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente com a chave da API 
// Fallback para string vazia evita erro no build time, mas deve existir em runtime
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

// Utilizando modelo estável 'gemini-1.5-flash' para respostas rápidas
const MODEL_NAME = 'gemini-1.5-flash';

export const generateStudentAnalysis = async (studentName: string, grades: number[], attendance: number, occurrences: number) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Retorna um fallback seguro em caso de erro na API
    return JSON.stringify({
      prediction: "Serviço de IA indisponível momentaneamente. Verifique a chave de API.",
      highlights: "Verifique sua conexão.",
      bnccAlignment: "N/A",
      status: "REGULAR"
    });
  }
};

export const generateLessonPlan = async (subject: string, topic: string, gradeLevel: string = "Ensino Fundamental II") => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

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
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({
      title: "Erro na geração",
      objective: "Não foi possível conectar à IA.",
      activities: []
    });
  }
}