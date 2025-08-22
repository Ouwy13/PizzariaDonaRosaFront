"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ChefHat, MapPin, CreditCard, Star } from "lucide-react"
import { useOrders } from "@/contexts/orders-context"
import { useEffect } from "react"

export default function KitchenDisplay() {
  const { orders, updateOrderStatus, deliverOrder, getOrdersByStatus } = useOrders()

  useEffect(() => {
    // Auto-confirmar pedidos pendentes que chegam na cozinha
    const pendingOrders = getOrdersByStatus("pending")
    pendingOrders.forEach((order) => {
      // Aguardar 2 segundos e então confirmar automaticamente
      setTimeout(() => {
        updateOrderStatus(order.id, "confirmed")
      }, 2000)
    })
  }, [orders, getOrdersByStatus, updateOrderStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-600"
      case "preparing":
        return "bg-orange-600"
      case "ready":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "preparing":
        return "Preparando"
      case "ready":
        return "Pronto"
      default:
        return status
    }
  }

  const getOrderPosition = (orderNumber: number, status: string) => {
    if (status !== "confirmed") return ""

    const confirmedOrders = getOrdersByStatus("confirmed").sort((a, b) => a.orderNumber - b.orderNumber)
    const position = confirmedOrders.findIndex((order) => order.orderNumber === orderNumber) + 1

    if (position === 1) return "1ª"
    if (position === 2) return "2ª"
    if (position === 3) return "3ª"
    return `${position}ª`
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX"
      case "card":
        return "Cartão"
      case "cash":
        return "Dinheiro"
      default:
        return method
    }
  }

  const getDeliveryTypeLabel = (type: string) => {
    switch (type) {
      case "delivery":
        return "Entrega"
      case "pickup":
        return "Retirada"
      case "table":
        return "Mesa"
      default:
        return type
    }
  }

  const confirmedOrders = getOrdersByStatus("confirmed")
  const preparingOrders = getOrdersByStatus("preparing")
  const readyOrders = getOrdersByStatus("ready")

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Confirmados</p>
                <p className="text-3xl font-bold text-white">{confirmedOrders.length}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Preparando</p>
                <p className="text-3xl font-bold text-white">{preparingOrders.length}</p>
              </div>
              <ChefHat className="h-10 w-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Prontos</p>
                <p className="text-3xl font-bold text-white">{readyOrders.length}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Display */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Confirmed Orders */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 mr-3" />
            Pedidos Confirmados
          </h2>
          <div className="space-y-6">
            {confirmedOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900/30 border-gray-800/40 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl font-bold">{order.customer.name}</CardTitle>
                      <div className="flex items-center mt-2 space-x-4">
                        <Badge className="bg-yellow-600 text-white text-xs">
                          {getOrderPosition(order.orderNumber, order.status)} na fila
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {getDeliveryTypeLabel(order.deliveryType)}
                    {order.deliveryType === "table" && order.table && `: ${order.table}`}
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Itens do Pedido:
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="bg-blue-600 text-white text-sm font-bold">
                              {item.quantity}x
                            </Badge>
                            <span className="text-white font-medium flex items-center">
                              {item.name}
                              {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                            </span>
                          </div>

                          {item.selectedSize && (
                            <p className="text-sm text-gray-400 mb-2">Tamanho: {item.selectedSize}</p>
                          )}

                          {item.observations && (
                            <p className="text-xs text-yellow-400 mt-2 bg-yellow-900/20 p-2 rounded">
                              <strong>Obs:</strong> {item.observations}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-green-400 font-bold text-lg">R$ {order.total.toFixed(2)}</span>
                    <Button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      size="sm"
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
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
          <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center">
            <ChefHat className="h-6 w-6 mr-3" />
            Em Preparo
          </h2>
          <div className="space-y-6">
            {preparingOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900/30 border-gray-800/40 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl font-bold">{order.customer.name}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white animate-pulse`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {getDeliveryTypeLabel(order.deliveryType)}
                    {order.deliveryType === "table" && order.table && `: ${order.table}`}
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Ingredientes Necessários:
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="secondary" className="bg-orange-600 text-white text-sm font-bold">
                              {item.quantity}x
                            </Badge>
                            <span className="text-white font-medium flex items-center">
                              {item.name}
                              {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                            </span>
                          </div>

                          {item.selectedSize && (
                            <p className="text-sm text-gray-400 mb-3">Tamanho: {item.selectedSize}</p>
                          )}

                          {item.ingredients && item.ingredients.length > 0 && (
                            <div>
                              <p className="text-sm text-orange-300 font-medium mb-2">Ingredientes:</p>
                              <div className="flex flex-wrap gap-2">
                                {item.ingredients.map((ingredient, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={`text-xs ${
                                      ingredient.toLowerCase().includes("carne de sol")
                                        ? "border-yellow-500 text-yellow-300 bg-yellow-900/20"
                                        : "border-gray-600 text-gray-300 bg-gray-800/30"
                                    }`}
                                  >
                                    {ingredient}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.observations && (
                            <p className="text-xs text-yellow-400 mt-3 bg-yellow-900/20 p-2 rounded">
                              <strong>Obs:</strong> {item.observations}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-green-400 font-bold text-lg">R$ {order.total.toFixed(2)}</span>
                    <Button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
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
          <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
            <CheckCircle className="h-6 w-6 mr-3" />
            Pedidos Prontos
          </h2>
          <div className="space-y-6">
            {readyOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900/30 border-gray-800/40 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl font-bold">{order.customer.name}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white animate-pulse`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {getDeliveryTypeLabel(order.deliveryType)}
                    {order.deliveryType === "table" && order.table && `: ${order.table}`}
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Itens do Pedido:
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg">
                          <span className="text-white flex items-center">
                            <Badge variant="secondary" className="bg-green-600 text-white text-xs mr-2">
                              {item.quantity}x
                            </Badge>
                            {item.name}
                            {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-green-400 font-bold text-lg">R$ {order.total.toFixed(2)}</span>
                    <Button
                      onClick={() => deliverOrder(order.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Entregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Empty States */}
      {confirmedOrders.length === 0 && preparingOrders.length === 0 && readyOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="h-12 w-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-light text-white mb-2">Nenhum pedido na cozinha</h3>
          <p className="text-gray-500">Os pedidos aparecerão aqui quando forem enviados</p>
        </div>
      )}
    </div>
  )
}
