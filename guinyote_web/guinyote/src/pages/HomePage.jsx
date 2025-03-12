import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trophy, History, Settings } from "lucide-react"

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
            <AvatarFallback>MN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Manel</span>
            <span className="text-xs text-green-500">online</span>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-300">LOGO</div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Historial">
            <History className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Ranking">
            <Trophy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Ajustes">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 sm:left-10">
          <Button className="bg-primary text-white hover:bg-primary/90 w-36">Partida online</Button>
          <Button variant="outline" className="w-36">
            Partida IA
          </Button>
        </div>

        <div className="absolute bottom-4 right-4">
          <Button variant="outline" className="rounded-md">
            Reglas
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;