"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, Activity, Newspaper, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Estado para simular logs (depois virá da IA real)
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Simulação de Logs (efeito visual)
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const startProcess = () => {
    setIsRunning(true);
    setLogs([]);
    addLog("System initialized.");
    addLog("Connecting to Curation Agent...");
    
    // Simula atraso da rede/IA
    setTimeout(() => addLog("Fetching top headlines from NewsAPI..."), 1000);
    setTimeout(() => addLog("Found 5 relevant articles about 'AI'."), 2500);
    setTimeout(() => addLog("Sending data to Writer Agent (LLM)..."), 4000);
    setTimeout(() => {
        addLog("Drafting content completed.");
        setIsRunning(false);
    }, 6000);
  };

  return (
    <main className="flex h-screen w-full flex-col p-4 gap-4 bg-zinc-950 text-zinc-100">
      
      {/* Header estilo 'OS' */}
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tighter">NEWSROOM_OS v1.0</h1>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="border-green-500 text-green-500">SYSTEM ONLINE</Badge>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        
        {/* Coluna 1: O Terminal de Logs (Esquerda) */}
        <Card className="md:col-span-1 bg-zinc-900 border-zinc-800 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                SYSTEM LOGS
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[60vh] p-4 text-xs font-mono text-green-400">
                {logs.length === 0 && <span className="text-zinc-600">Waiting for command...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                ))}
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t border-zinc-800">
            <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                onClick={startProcess}
                disabled={isRunning}
            >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "PROCESSING..." : "START AGENTS"}
            </Button>
          </div>
        </Card>

        {/* Coluna 2: O Resultado Visual (Direita) */}
        <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    LIVE PREVIEW
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full bg-white text-black p-8 rounded-md m-4 max-h-[75vh] overflow-y-auto">
                {/* Aqui vai entrar o HTML do email gerado */}
                <h1 className="text-3xl font-bold mb-4">Tech Morning Digest</h1>
                <p className="text-gray-500 italic mb-6">Curated by AI Agents • {new Date().toLocaleDateString()}</p>
                
                <div className="space-y-6">
                    <div className="p-4 bg-gray-100 rounded">
                        <h2 className="font-bold text-xl">Aguardando geração...</h2>
                        <p className="text-gray-600 mt-2">Clique em "START AGENTS" para iniciar o processo de curadoria e escrita.</p>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}