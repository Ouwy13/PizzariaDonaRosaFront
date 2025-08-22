"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, User, Phone, MapPin } from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: Array<{
    name: string
    quantity: number
    selectedSize?: string
    selectedType?: string
    observations?: string
  }>
  deliveryType: "delivery" | "pickup"
  deliveryTime: string
  address?: string
  total: number
  status: "pending" | "preparing" | "ready"
  timestamp: string
}

// Dados simulados de pedidos
const mockOrders: Order[] = [
  {
    id: "001",
    customerName: "João Silva",
    customerPhone: "(85) 99999-9999",
    items: [
      { name: "Pizza Margherita", quantity: 1, selectedSize: "Grande", selectedType: "Padrão" },
      { name: "Refrigerante 2L", quantity: 1 },
    ],
    deliveryType: "delivery",
    deliveryTime: "19:30",
    address: "Rua das Flores, 123 - Centro",
    total: 53.5,
    status: "pending",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "002",
    customerName: "Maria Santos",
    customerPhone: "(85) 88888-8888",
    items: [{ name: "Pizza Calabresa", quantity: 2, selectedSize: "Média", selectedType: "Carne de Sol" }],
    deliveryType: "pickup",
    deliveryTime: "20:00",
    total: 92.0,
    status: "preparing",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "003",
    customerName: "Pedro Costa",
    customerPhone: "(85) 77777-7777",
    items: [
      { name: "Pizza Margherita", quantity: 1, selectedSize: "Pequena", selectedType: "Padrão" },
      { name: "Água Mineral", quantity: 2 },
    ],
    deliveryType: "pickup",
    deliveryTime: "19:45",
    total: 34.0,
    status: "ready",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
  },
]

export default function KitchenPanel() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600"
      case "preparing":
        return "bg-blue-600"
      case "ready":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "preparing":
        return "Preparando"
      case "ready":
        return "Pronto"
      default:
        return status
    }
  }

  const getTimeElapsed = (timestamp: string) => {
    const elapsed = Math.floor((currentTime.getTime() - new Date(timestamp).getTime()) / 60000)
    return `${elapsed} min atrás`
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const preparingOrders = orders.filter((order) => order.status === "preparing")
  const readyOrders = orders.filter((order) => order.status === "ready")

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-900/20 border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-white">{pendingOrders.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Preparando</p>
                <p className="text-2xl font-bold text-white">{preparingOrders.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/20 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Prontos</p>
                <p className="text-2xl font-bold text-white">{readyOrders.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Pedidos Pendentes
          </h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900 border-yellow-800">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">#{order.id}</CardTitle>
                      <CardDescription className="text-gray-400">{getTimeElapsed(order.timestamp)}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    {order.customerName}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    {order.customerPhone}
                  </div>
                  {order.deliveryType === "delivery" && order.address && (
                    <div className="flex items-start text-sm text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-2" />
                    {order.deliveryType === "delivery" ? "Entrega" : "Retirada"}: {order.deliveryTime}
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <h4 className="text-white font-medium mb-2">Itens:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-300 mb-1">
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                        {item.selectedSize && <span className="text-gray-400"> - {item.selectedSize}</span>}
                        {item.selectedType && item.selectedType !== "Padrão" && (
                          <span className="text-gray-400"> - {item.selectedType}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-green-400 font-bold">R$ {order.total.toFixed(2)}</span>
                    <Button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Iniciar Preparo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preparing Orders */}
        <div>
          <h2 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Em Preparo
          </h2>
          <div className="space-y-4">
            {preparingOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900 border-blue-800">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">#{order.id}</CardTitle>
                      <CardDescription className="text-gray-400">{getTimeElapsed(order.timestamp)}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    {order.customerName}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-2" />
                    {order.deliveryType === "delivery" ? "Entrega" : "Retirada"}: {order.deliveryTime}
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <h4 className="text-white font-medium mb-2">Itens:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-300 mb-1">
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                        {item.selectedSize && <span className="text-gray-400"> - {item.selectedSize}</span>}
                        {item.selectedType && item.selectedType !== "Padrão" && (
                          <span className="text-gray-400"> - {item.selectedType}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-green-400 font-bold">R$ {order.total.toFixed(2)}</span>
                    <Button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Marcar Pronto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ready Orders */}
        <div>
          <h2 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Pedidos Prontos
          </h2>
          <div className="space-y-4">
            {readyOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900 border-green-800">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">#{order.id}</CardTitle>
                      <CardDescription className="text-gray-400">{getTimeElapsed(order.timestamp)}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    {order.customerName}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    {order.customerPhone}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-2" />
                    {order.deliveryType === "delivery" ? "Entrega" : "Retirada"}: {order.deliveryTime}
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <h4 className="text-white font-medium mb-2">Itens:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-300 mb-1">
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                        {item.selectedSize && <span className="text-gray-400"> - {item.selectedSize}</span>}
                        {item.selectedType && item.selectedType !== "Padrão" && (
                          <span className="text-gray-400"> - {item.selectedType}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="text-green-400 font-bold">R$ {order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
