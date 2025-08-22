"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pizza, User, Lock } from "lucide-react"
import Dashboard from "./dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple authentication - in a real app, this would be more secure
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true)
      setError("")
    } else {
      setError("Usuário ou senha incorretos")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
    setError("")
  }

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Pizza className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-light text-white tracking-wide">Pizzaria Dona Rosa</CardTitle>
            <p className="text-gray-400 text-sm mt-2">Sistema de Gestão</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-400 text-sm font-light">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black/50 border-gray-700/50 text-white pl-10 h-11 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Digite seu usuário"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-400 text-sm font-light">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-gray-700/50 text-white pl-10 h-11 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-800/30">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 text-white font-medium h-11 transition-all duration-300"
              >
                Entrar
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-xs">Usuário: admin | Senha: admin</p>
            </div>
          </CardContent>
        </Card>

        {/* Geometric Elements */}
        <div className="fixed bottom-8 right-8">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full animate-pulse"></div>
        </div>
        <div className="fixed top-1/4 left-8">
          <div className="w-px h-16 bg-gradient-to-b from-orange-500/20 to-transparent"></div>
        </div>
        <div className="fixed bottom-1/4 right-16">
          <div className="w-12 h-px bg-gradient-to-l from-red-500/20 to-transparent"></div>
        </div>
      </div>
    </div>
  )
}
