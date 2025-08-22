"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pizza, ShoppingCart, ChefHat, LogOut, BarChart3, Settings, Clock } from "lucide-react"
import OrderManagement from "./components/order-management"
import KitchenDisplay from "./components/kitchen-display"
import Analytics from "./components/analytics"
import MenuSettings from "./components/menu-settings"
import { useOrders } from "@/contexts/orders-context"

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("orders")
  const [currentTime, setCurrentTime] = useState(new Date())
  const { getOrdersCount, getKitchenOrdersCount } = useOrders()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const menuItems = [
    { id: "orders", label: "Pedidos", icon: ShoppingCart, badge: getOrdersCount() },
    { id: "kitchen", label: "Cozinha", icon: ChefHat, badge: getKitchenOrdersCount() },
    { id: "analytics", label: "Relatórios", icon: BarChart3 },
    { id: "settings", label: "Cardápio", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/30 bg-black/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Pizza className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-light text-white tracking-wide">Pizzaria</h1>
                <p className="text-xs text-gray-500 tracking-wider">DONA ROSA</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`relative h-10 px-4 text-sm font-light transition-all duration-300 ${
                    isActive
                      ? "bg-gray-900/30 text-white backdrop-blur-sm"
                      : "text-gray-400 hover:text-white hover:bg-gray-900/20"
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className="ml-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-xs h-4 w-4 p-0 flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 w-8 h-px bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transform -translate-x-1/2"></div>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Status */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-gray-400 text-xs tracking-wide">ONLINE</span>
              </div>
              <div className="w-px h-4 bg-gray-700"></div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="h-3 w-3" />
                <span className="font-mono text-xs">{currentTime.toLocaleTimeString("pt-BR")}</span>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline text-sm font-light">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-8 py-8">
        <div className="animate-fade-in">
          {activeSection === "orders" && <OrderManagement />}
          {activeSection === "kitchen" && <KitchenDisplay />}
          {activeSection === "analytics" && <Analytics />}
          {activeSection === "settings" && <MenuSettings />}
        </div>
      </main>

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
  )
}
