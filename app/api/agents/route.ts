import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST() {
  try {
    
    // 1. Verificar chaves
    if (!process.env.NEWS_API_KEY || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API Keys not configured" },
        { status: 500 }
      );
    }

    let url = `https://newsapi.org/v2/everything?q="inteligencia artificial" OR tecnologia&language=pt&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
    
    console.log("Tentando buscar:", url);
    let newsResponse = await fetch(url);
    let newsData = await newsResponse.json();

    // FALLBACK: Se não achar nada de Tech, pega as manchetes gerais do Brasil (fofoca, política, etc) para não quebrar
    if (!newsData.articles || newsData.articles.length === 0) {
        console.log("Tech vazio. Tentando manchetes gerais...");
        url = `https://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.NEWS_API_KEY}`;
        newsResponse = await fetch(url);
        newsData = await newsResponse.json();
    }

    console.log("Artigos encontrados:", newsData.totalResults);

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error("No news found even after fallback.");
    }

    // Pega as 3 primeiras notícias para não estourar o limite
    const articles = newsData.articles.slice(0, 3).map((a: any) => ({
      title: a.title,
      description: a.description,
      source: a.source.name,
    }));

    // 3. Agente Escritor: Manda para o Gemini
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

    const prompt = `
      Você é um Editor Chefe de uma Newsletter Tech chamada 'Newsroom OS'.
      Sua persona é cínica, direta e focada em negócios, estilo 'The Hustle' ou 'Morning Brew'.

      Aqui estão as notícias do dia:
      ${JSON.stringify(articles, null, 2)}

      Tarefa:
      Escreva uma newsletter curta em formato HTML. 
      - Use tags <h2> para títulos e <p> para texto.
      - Não use <html>, <head> ou <body>, apenas o conteúdo interno (divs, h2, p).
      - Para cada notícia, escreva um resumo ácido de 2 frases e uma piada curta no final.
      - Adicione uma 'Conclusão do Editor' no final.
      - Use classes do Tailwind CSS para estilizar se quiser (ex: text-blue-500), mas mantenha simples.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpa o markdown ```html se o Gemini mandar
    const cleanHtml = text.replace(/```html|```/g, "");

    return NextResponse.json({ 
      content: cleanHtml,
      logs: [
        "CurationAgent: Connected to NewsAPI.",
        `CurationAgent: Retrieved ${articles.length} top stories.`,
        "WriterAgent: Analysing content patterns...",
        "WriterAgent: Generating HTML output with Gemini Flash...",
        "System: Newsletter ready for distribution."
      ]
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}