import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente com a chave da API (Fallback para string vazia para evitar crash no build se a env não estiver setada, mas falhará em runtime)
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

// Utilizando modelo estável compatível com o SDK @google/generative-ai
const MODEL_NAME = 'gemini-1.5-flash';

export const generateStudentAnalysis = async (studentName: string, grades: number[], attendance: number, occurrences: number) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Atue como um Especialista Pedagógico Sênior especializado na BNCC (Base Nacional Comum Curricular).
      
      Analise o seguinte perfil de aluno:
      - Nome: ${studentName}
      - Histórico de Notas: ${grades.join(', ')} (Média: ${(grades.reduce((a,b)=>a+b,0)/(grades.length || 1)).toFixed(1)})
      - Frequência: ${attendance}%
      - Ocorrências Disciplinares: ${occurrences}

      Tarefa: Gere uma análise estratégica estruturada em JSON.
      
      Requisitos da Análise:
      1. **prediction**: Uma previsão fundamentada sobre o desempenho futuro se o padrão atual continuar.
      2. **highlights**: Identifique pontos fortes (Destaques) e pontos que exigem 'Superação' imediata.
      3. **bnccAlignment**: Cite especificamente UMA competência geral ou habilidade da BNCC que deve ser trabalhada para melhorar o quadro deste aluno.
      4. **status**: Classifique estritamente como "ATENÇÃO", "REGULAR" ou "EXCELENTE".

      Formato de Saída (JSON Puro):
      {
        "prediction": "string",
        "highlights": "string",
        "bnccAlignment": "string",
        "status": "ATENÇÃO" | "REGULAR" | "EXCELENTE"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({
      prediction: "Não foi possível gerar a análise preditiva no momento. Verifique a chave de API.",
      highlights: "Verifique a conexão de rede.",
      bnccAlignment: "Dados indisponíveis.",
      status: "REGULAR"
    });
  }
};

export const generateLessonPlan = async (subject: string, topic: string, gradeLevel: string = "Ensino Fundamental II") => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Crie um Plano de Aula estruturado para a disciplina de ${subject}, tópico "${topic}", voltado para ${gradeLevel}.
      
      O plano deve ser alinhado à BNCC e utilizar Metodologias Ativas.
      
      Retorne APENAS um JSON com a seguinte estrutura:
      {
        "title": "Título Criativo da Aula",
        "duration": "Duração estimada",
        "bnccCode": "Código da Habilidade BNCC (ex: EF09MA01)",
        "objective": "Objetivo de aprendizagem claro e conciso",
        "methodology": "Descrição da metodologia ativa utilizada (ex: Sala de Aula Invertida, Gamificação)",
        "activities": [
           { "time": "10min", "description": "Atividade inicial" },
           { "time": "30min", "description": "Desenvolvimento" },
           { "time": "10min", "description": "Fechamento" }
        ],
        "assessment": "Como os alunos serão avaliados nesta aula"
      }
    `;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error(error);
    return JSON.stringify({
      title: "Erro na geração do plano",
      objective: "Tente novamente mais tarde.",
      activities: []
    });
  }
}