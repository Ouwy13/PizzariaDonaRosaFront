"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, ShoppingCart, Clock, User } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  sizes?: { name: string; multiplier: number }[]
  types?: { name: string; priceAdd: number }[]
}

interface OrderItem extends MenuItem {
  quantity: number
  selectedSize?: string
  selectedType?: string
  observations?: string
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    price: 35.0,
    category: "Pizza",
    sizes: [
      { name: "Pequena", multiplier: 0.8 },
      { name: "Média", multiplier: 1.0 },
      { name: "Grande", multiplier: 1.3 },
    ],
    types: [
      { name: "Padrão", priceAdd: 0 },
      { name: "Carne de Sol", priceAdd: 8.0 },
    ],
  },
  {
    id: "2",
    name: "Pizza Calabresa",
    price: 38.0,
    category: "Pizza",
    sizes: [
      { name: "Pequena", multiplier: 0.8 },
      { name: "Média", multiplier: 1.0 },
      { name: "Grande", multiplier: 1.3 },
    ],
    types: [
      { name: "Padrão", priceAdd: 0 },
      { name: "Carne de Sol", priceAdd: 8.0 },
    ],
  },
  {
    id: "3",
    name: "Refrigerante 2L",
    price: 8.0,
    category: "Bebida",
  },
  {
    id: "4",
    name: "Água Mineral",
    price: 3.0,
    category: "Bebida",
  },
]

export default function PointOfSale() {
  const [cart, setCart] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("pickup")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [address, setAddress] = useState("")

  const addToCart = (item: MenuItem) => {
    const cartItem: OrderItem = {
      ...item,
      quantity: 1,
      selectedSize: item.sizes ? "Média" : undefined,
      selectedType: item.types ? "Padrão" : undefined,
    }
    setCart([...cart, cartItem])
  }

  const updateCartItem = (index: number, updates: Partial<OrderItem>) => {
    const newCart = [...cart]
    newCart[index] = { ...newCart[index], ...updates }
    setCart(newCart)
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const calculateItemPrice = (item: OrderItem) => {
    let price = item.price

    if (item.selectedSize && item.sizes) {
      const size = item.sizes.find((s) => s.name === item.selectedSize)
      if (size) price *= size.multiplier
    }

    if (item.selectedType && item.types) {
      const type = item.types.find((t) => t.name === item.selectedType)
      if (type) price += type.priceAdd
    }

    return price * item.quantity
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0)
  }

  const handleSubmitOrder = () => {
    if (cart.length === 0) return

    const order = {
      items: cart,
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      deliveryType,
      deliveryTime,
      address: deliveryType === "delivery" ? address : "",
      total: getTotalPrice(),
      timestamp: new Date().toISOString(),
    }

    console.log("Novo pedido:", order)

    // Reset form
    setCart([])
    setCustomerName("")
    setCustomerPhone("")
    setDeliveryTime("")
    setAddress("")

    alert("Pedido enviado para a cozinha!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Items */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Cardápio</CardTitle>
            <CardDescription className="text-gray-400">Selecione os itens para o pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-green-400 mb-3">R$ {item.price.toFixed(2)}</p>
                    <Button onClick={() => addToCart(item)} className="w-full bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Order Details */}
      <div className="space-y-6">
        {/* Cart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Carrinho ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Carrinho vazio</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.sizes && (
                      <Select
                        value={item.selectedSize}
                        onValueChange={(value) => updateCartItem(index, { selectedSize: value })}
                      >
                        <SelectTrigger className="mb-2 bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.sizes.map((size) => (
                            <SelectItem key={size.name} value={size.name}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {item.types && (
                      <Select
                        value={item.selectedType}
                        onValueChange={(value) => updateCartItem(index, { selectedType: value })}
                      >
                        <SelectTrigger className="mb-2 bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.types.map((type) => (
                            <SelectItem key={type.name} value={type.name}>
                              {type.name} {type.priceAdd > 0 && `(+R$ ${type.priceAdd.toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(index, { quantity: Math.max(1, item.quantity - 1) })}
                          className="h-8 w-8 p-0 border-gray-600"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-white font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(index, { quantity: item.quantity + 1 })}
                          className="h-8 w-8 p-0 border-gray-600"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-green-400 font-bold">R$ {calculateItemPrice(item).toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-green-400">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Customer Details */}
        {cart.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName" className="text-gray-300">
                  Nome
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <Label htmlFor="customerPhone" className="text-gray-300">
                  Telefone
                </Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label className="text-gray-300">Tipo de Entrega</Label>
                <Select value={deliveryType} onValueChange={(value: "delivery" | "pickup") => setDeliveryType(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Retirada</SelectItem>
                    <SelectItem value="delivery">Entrega</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {deliveryType === "delivery" && (
                <div>
                  <Label htmlFor="address" className="text-gray-300">
                    Endereço
                  </Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Endereço completo para entrega"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="deliveryTime" className="text-gray-300">
                  Horário {deliveryType === "delivery" ? "de Entrega" : "de Retirada"}
                </Label>
                <Input
                  id="deliveryTime"
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                disabled={!customerName || !customerPhone}
              >
                <Clock className="h-4 w-4 mr-2" />
                Enviar Pedido
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
