"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Minus, ShoppingCart, User, MapPin, Check, Pizza, Star, CreditCard } from "lucide-react"
import { useMenu, type MenuItem } from "@/contexts/menu-context"
import { useOrders } from "@/contexts/orders-context"

interface OrderItem extends MenuItem {
  quantity: number
  selectedSize?: string
  selectedFlavors?: string[]
  observations?: string
  totalPrice: number
}

// TAMANHOS DE PIZZA COM PREÇOS ATUALIZADOS
const pizzaSizes = [
  { name: "Brotinho", price: 10, description: "Ideal para 1 pessoa" },
  { name: "P (4 fatias)", price: 25, carneSolPrice: 30, description: "Perfeita para 1-2 pessoas" },
  { name: "M (6 fatias)", price: 35, carneSolPrice: 40, description: "Ideal para 2-3 pessoas" },
  { name: "G (8 fatias)", price: 45, carneSolPrice: 50, description: "Perfeita para 3-4 pessoas" },
  { name: "F (8 fatias)", price: 55, carneSolPrice: 65, description: "Família pequena" },
  { name: "XF (10 fatias)", price: 65, carneSolPrice: 75, description: "Família média" },
  { name: "GG (12 fatias)", price: 85, carneSolPrice: 95, description: "Família grande" },
  {
    name: "Extra (15 fatias)",
    price: 145,
    carneSolPrice: 150,
    description: "Para grandes grupos (até 4 sabores, 70cm)",
  },
]

export default function OrderManagement() {
  const { getActiveMenuItems, getMenuItemsByCategory } = useMenu()
  const { orders, addOrder, getOrdersByStatus } = useOrders()

  const [cart, setCart] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup" | "table">("table")
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "cash">("pix")
  const [address, setAddress] = useState("")
  const [table, setTable] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderCounter, setOrderCounter] = useState(1)

  // Estados para construção de pizza
  const [pizzaBuilder, setPizzaBuilder] = useState({
    selectedSize: "",
    selectedFlavors: [] as string[],
    isBuilding: false,
  })

  // Obter itens ativos do cardápio
  const activeMenuItems = getActiveMenuItems()
  const pizzasSalgadas = getMenuItemsByCategory("Pizza Salgada")
  const pizzasDoces = getMenuItemsByCategory("Pizza Doce")
  const bebidas = getMenuItemsByCategory("Bebida")
  const pasteis = getMenuItemsByCategory("Pastel")
  const tiraGosto = getMenuItemsByCategory("Tira Gosto")

  // Função para tocar sons
  const playSound = (type: "add" | "success") => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      if (type === "add") {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } else if (type === "success") {
        const oscillator1 = audioContext.createOscillator()
        const oscillator2 = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator1.connect(gainNode)
        oscillator2.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator1.frequency.setValueAtTime(523, audioContext.currentTime)
        oscillator1.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
        oscillator1.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)

        oscillator2.frequency.setValueAtTime(262, audioContext.currentTime)
        oscillator2.frequency.setValueAtTime(330, audioContext.currentTime + 0.1)
        oscillator2.frequency.setValueAtTime(392, audioContext.currentTime + 0.2)

        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

        oscillator1.start(audioContext.currentTime)
        oscillator2.start(audioContext.currentTime)
        oscillator1.stop(audioContext.currentTime + 0.4)
        oscillator2.stop(audioContext.currentTime + 0.4)
      }
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  // Calcular preço da pizza
  const calculatePizzaPrice = () => {
    if (!pizzaBuilder.selectedSize) return 0

    const selectedSizeObj = pizzaSizes.find((s) => s.name === pizzaBuilder.selectedSize)
    if (!selectedSizeObj) return 0

    // Verificar se tem carne de sol nos sabores selecionados
    const hasCarneSol = pizzaBuilder.selectedFlavors.some((flavorId) => {
      const flavor = activeMenuItems.find((item) => item.id === flavorId)
      return flavor?.isCarneSol || flavor?.ingredients.some((ing) => ing.toLowerCase().includes("carne de sol"))
    })

    // Se tem carne de sol e mais de um sabor, usar preço especial + R$5
    if (hasCarneSol && pizzaBuilder.selectedFlavors.length > 1) {
      return (selectedSizeObj.carneSolPrice || selectedSizeObj.price) + 5
    }

    // Se tem apenas carne de sol, usar preço especial
    if (hasCarneSol) {
      return selectedSizeObj.carneSolPrice || selectedSizeObj.price
    }

    // Preço normal
    return selectedSizeObj.price
  }

  // Selecionar tamanho da pizza
  const selectPizzaSize = (sizeName: string) => {
    setPizzaBuilder({
      selectedSize: sizeName,
      selectedFlavors: [],
      isBuilding: true,
    })
  }

  // Adicionar/remover sabor
  const toggleFlavor = (flavorId: string) => {
    const currentFlavors = pizzaBuilder.selectedFlavors
    if (currentFlavors.includes(flavorId)) {
      setPizzaBuilder({
        ...pizzaBuilder,
        selectedFlavors: currentFlavors.filter((id) => id !== flavorId),
      })
    } else if (currentFlavors.length < 4) {
      setPizzaBuilder({
        ...pizzaBuilder,
        selectedFlavors: [...currentFlavors, flavorId],
      })
    }
  }

  // Confirmar pizza
  const confirmPizza = () => {
    if (pizzaBuilder.selectedFlavors.length === 0 || !pizzaBuilder.selectedSize) return

    const selectedItems = pizzaBuilder.selectedFlavors
      .map((id) => activeMenuItems.find((item) => item.id === id))
      .filter(Boolean) as MenuItem[]

    const flavorNames = selectedItems.map((item) => item.name).join(" / ")

    // Combinar ingredientes únicos de todos os sabores selecionados
    const allIngredients = selectedItems.reduce((acc, item) => {
      item.ingredients.forEach((ingredient) => {
        if (!acc.includes(ingredient)) {
          acc.push(ingredient)
        }
      })
      return acc
    }, [] as string[])

    const cartItem: OrderItem = {
      id: `pizza-${Date.now()}`,
      name: `Pizza ${flavorNames}`,
      basePrice: 0,
      category: "Pizza",
      description: `Pizza ${pizzaBuilder.selectedSize} - ${flavorNames}`,
      ingredients: allIngredients,
      quantity: 1,
      selectedSize: pizzaBuilder.selectedSize,
      selectedFlavors: pizzaBuilder.selectedFlavors,
      totalPrice: calculatePizzaPrice(),
      active: true,
      isCarneSol: allIngredients.some((ing) => ing.toLowerCase().includes("carne de sol")),
    }

    setCart([...cart, cartItem])
    playSound("add")

    // Reset pizza builder
    setPizzaBuilder({
      selectedSize: "",
      selectedFlavors: [],
      isBuilding: false,
    })
  }

  // Adicionar item normal ao carrinho
  const addToCart = (item: MenuItem) => {
    const cartItem: OrderItem = {
      ...item,
      quantity: 1,
      totalPrice: item.basePrice,
    }
    setCart([...cart, cartItem])
    playSound("add")
  }

  const updateCartItem = (index: number, updates: Partial<OrderItem>) => {
    const newCart = [...cart]
    newCart[index] = { ...newCart[index], ...updates }
    setCart(newCart)
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice * item.quantity, 0)
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

  const handleSubmitOrder = async () => {
    if (cart.length === 0 || !customerName) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newOrder = {
      id: `${String(Date.now()).slice(-6)}`,
      items: cart,
      customer: {
        name: customerName,
      },
      deliveryType,
      paymentMethod,
      address: deliveryType === "delivery" ? address : "",
      table: deliveryType === "table" ? table : "",
      total: getTotalPrice(),
      status: "pending" as const,
      timestamp: new Date().toISOString(),
      orderNumber: orderCounter,
    }

    // Adicionar pedido ao contexto global
    addOrder(newOrder)

    setOrderCounter(orderCounter + 1)
    playSound("success")

    // Reset form
    setCart([])
    setCustomerName("")
    setAddress("")
    setTable("")
    setPaymentMethod("pix")
    setIsSubmitting(false)
    setShowSuccess(true)

    setTimeout(() => setShowSuccess(false), 2000)
  }

  const getOrderPosition = (orderNumber: number) => {
    const pendingOrders = getOrdersByStatus("pending")
    const position = pendingOrders.findIndex((order) => order.orderNumber === orderNumber) + 1

    if (position === 1) return "1ª"
    if (position === 2) return "2ª"
    if (position === 3) return "3ª"
    return `${position}ª`
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <Card className="bg-green-900/90 border-green-700/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-4 flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Pedido enviado para a cozinha!</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white flex items-center">
            <ShoppingCart className="h-6 w-6 mr-3 text-orange-400" />
            Pedidos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de pedidos</p>
        </div>
        <div className="w-12 h-px bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Menu Items */}
        <div className="xl:col-span-2">
          <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-light text-white">Cardápio Pizzaria Dona Rosa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* TAMANHOS DE PIZZA */}
              <div>
                <h3 className="text-orange-400 font-medium mb-4 flex items-center">
                  <Pizza className="h-5 w-5 mr-2" />
                  Tamanho da Pizza
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pizzaSizes.map((size) => (
                    <Card
                      key={size.name}
                      className={`cursor-pointer transition-all duration-300 ${
                        pizzaBuilder.selectedSize === size.name
                          ? "bg-orange-900/50 border-orange-500 shadow-lg shadow-orange-500/20"
                          : "bg-black/30 border-gray-800/30 hover:bg-black/50 hover:border-orange-500/30"
                      }`}
                      onClick={() => selectPizzaSize(size.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-white">{size.name}</h4>
                            <p className="text-sm text-gray-400">{size.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-400">R$ {size.price.toFixed(2)}</p>
                            {size.carneSolPrice && (
                              <p className="text-xs text-yellow-400">
                                Carne de Sol: R$ {size.carneSolPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        {pizzaBuilder.selectedSize === size.name && (
                          <div className="mt-2 flex items-center text-orange-300 text-sm">
                            <Check className="h-4 w-4 mr-2" />
                            Tamanho selecionado
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* SABORES DE PIZZA */}
              {pizzaBuilder.selectedSize && (
                <div className="animate-slide-down">
                  <h3 className="text-orange-400 font-medium mb-4 flex items-center">
                    <Pizza className="h-5 w-5 mr-2" />
                    Cardápio de Pizzas ({pizzaBuilder.selectedFlavors.length}/4 sabores)
                  </h3>

                  {/* Pizzas Salgadas */}
                  {pizzasSalgadas.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-yellow-400 font-medium mb-3">Pizzas Salgadas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pizzasSalgadas.map((flavor) => (
                          <Card
                            key={flavor.id}
                            className={`cursor-pointer transition-all duration-300 ${
                              pizzaBuilder.selectedFlavors.includes(flavor.id)
                                ? "bg-orange-900/50 border-orange-500"
                                : "bg-black/20 border-gray-800/30 hover:bg-black/40 hover:border-orange-500/30"
                            } ${
                              !pizzaBuilder.selectedFlavors.includes(flavor.id) &&
                              pizzaBuilder.selectedFlavors.length >= 4
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => toggleFlavor(flavor.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={pizzaBuilder.selectedFlavors.includes(flavor.id)}
                                  disabled={
                                    !pizzaBuilder.selectedFlavors.includes(flavor.id) &&
                                    pizzaBuilder.selectedFlavors.length >= 4
                                  }
                                  className="border-orange-500"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-white text-sm flex items-center">
                                    {flavor.name}
                                    {flavor.isCarneSol && (
                                      <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />
                                    )}
                                  </h5>
                                  <p className="text-xs text-gray-400 mt-1">{flavor.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pizzas Doces */}
                  {pizzasDoces.length > 0 && (
                    <div>
                      <h4 className="text-pink-400 font-medium mb-3">Pizzas Doces</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pizzasDoces.map((flavor) => (
                          <Card
                            key={flavor.id}
                            className={`cursor-pointer transition-all duration-300 ${
                              pizzaBuilder.selectedFlavors.includes(flavor.id)
                                ? "bg-pink-900/50 border-pink-500"
                                : "bg-black/20 border-gray-800/30 hover:bg-black/40 hover:border-pink-500/30"
                            } ${
                              !pizzaBuilder.selectedFlavors.includes(flavor.id) &&
                              pizzaBuilder.selectedFlavors.length >= 4
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => toggleFlavor(flavor.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={pizzaBuilder.selectedFlavors.includes(flavor.id)}
                                  disabled={
                                    !pizzaBuilder.selectedFlavors.includes(flavor.id) &&
                                    pizzaBuilder.selectedFlavors.length >= 4
                                  }
                                  className="border-pink-500"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-white text-sm">{flavor.name}</h5>
                                  <p className="text-xs text-gray-400 mt-1">{flavor.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONFIRMAR PIZZA */}
              {pizzaBuilder.selectedSize && pizzaBuilder.selectedFlavors.length > 0 && (
                <div className="animate-slide-down">
                  <h3 className="text-orange-400 font-medium mb-4 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Confirmar Pedido de Pizza
                  </h3>
                  <Card className="bg-gray-900/50 border-orange-500/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium text-lg">Resumo da Pizza</h4>
                          <p className="text-gray-300">Tamanho: {pizzaBuilder.selectedSize}</p>
                          <div className="mt-2">
                            <p className="text-gray-300 text-sm mb-2">Sabores selecionados:</p>
                            <div className="flex flex-wrap gap-2">
                              {pizzaBuilder.selectedFlavors.map((flavorId) => {
                                const flavor = activeMenuItems.find((item) => item.id === flavorId)
                                return (
                                  <Badge
                                    key={flavorId}
                                    variant="outline"
                                    className="border-orange-500 text-orange-300 bg-orange-900/30 flex items-center"
                                  >
                                    {flavor?.name}
                                    {flavor?.isCarneSol && (
                                      <Star className="ml-1 h-3 w-3 text-yellow-400 fill-current" />
                                    )}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-orange-500/30 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-white font-medium">Valor Total:</span>
                            <span className="text-orange-400 font-bold text-2xl">
                              R$ {calculatePizzaPrice().toFixed(2)}
                            </span>
                          </div>

                          {pizzaBuilder.selectedFlavors.some((id) => {
                            const item = activeMenuItems.find((item) => item.id === id)
                            return (
                              item?.isCarneSol ||
                              item?.ingredients.some((ing) => ing.toLowerCase().includes("carne de sol"))
                            )
                          }) &&
                            pizzaBuilder.selectedFlavors.length > 1 && (
                              <p className="text-yellow-400 text-sm mb-4">
                                * Inclui acréscimo de R$ 5,00 para metade carne de sol
                              </p>
                            )}

                          <Button
                            onClick={confirmPizza}
                            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 text-white font-medium h-12 text-lg"
                          >
                            <Pizza className="h-5 w-5 mr-2" />
                            Adicionar Pizza ao Carrinho
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* BEBIDAS */}
              {bebidas.length > 0 && (
                <div>
                  <h3 className="text-blue-400 font-medium mb-4 flex items-center">🥤 Bebidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bebidas.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-black/30 border-gray-800/30 transition-all duration-300 hover:bg-black/50 hover:border-blue-500/30"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white flex items-center">
                                {item.name}
                                {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                              </h4>
                              <p className="text-xs text-gray-400">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-400">R$ {item.basePrice.toFixed(2)}</p>
                              <Button
                                onClick={() => addToCart(item)}
                                size="sm"
                                className="mt-2 bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* PASTÉIS */}
              {pasteis.length > 0 && (
                <div>
                  <h3 className="text-green-400 font-medium mb-4 flex items-center">🥟 Pastéis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pasteis.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-black/30 border-gray-800/30 transition-all duration-300 hover:bg-black/50 hover:border-green-500/30"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white flex items-center">
                                {item.name}
                                {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                              </h4>
                              <p className="text-xs text-gray-400">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-400">R$ {item.basePrice.toFixed(2)}</p>
                              <Button
                                onClick={() => addToCart(item)}
                                size="sm"
                                className="mt-2 bg-green-600 hover:bg-green-700"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TIRA GOSTO */}
              {tiraGosto.length > 0 && (
                <div>
                  <h3 className="text-purple-400 font-medium mb-4 flex items-center">🍟 Porções</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tiraGosto.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-black/30 border-gray-800/30 transition-all duration-300 hover:bg-black/50 hover:border-purple-500/30"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white flex items-center">
                                {item.name}
                                {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                              </h4>
                              <p className="text-xs text-gray-400">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-purple-400">R$ {item.basePrice.toFixed(2)}</p>
                              <Button
                                onClick={() => addToCart(item)}
                                size="sm"
                                className="mt-2 bg-purple-600 hover:bg-purple-700"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart and Order Form */}
        <div className="space-y-6">
          {/* Cart */}
          <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl hover:border-orange-500/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-light text-white flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 text-orange-400" />
                Carrinho
                <Badge className="ml-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-xs">
                  {cart.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-sm">Carrinho vazio</p>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="bg-black/30 p-4 rounded-lg border border-gray-800/30 hover:border-orange-500/30 hover:bg-black/40 transition-all duration-300 animate-slide-in"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-light text-white text-sm flex items-center">
                            {item.name}
                            {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(index)}
                            className="text-gray-400 hover:text-red-400 h-6 w-6 p-0 hover:bg-red-900/20 transition-all duration-300"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>

                        {item.selectedFlavors && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1">Sabores:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.selectedFlavors.map((flavorId) => {
                                const flavor = activeMenuItems.find((f) => f.id === flavorId)
                                return (
                                  <Badge
                                    key={flavorId}
                                    variant="outline"
                                    className="text-xs border-orange-500/50 text-orange-300 flex items-center"
                                  >
                                    {flavor?.name}
                                    {flavor?.isCarneSol && (
                                      <Star className="ml-1 h-3 w-3 text-yellow-400 fill-current" />
                                    )}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {item.selectedSize && (
                          <p className="text-xs text-gray-400 mb-3">Tamanho: {item.selectedSize}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartItem(index, { quantity: Math.max(1, item.quantity - 1) })}
                              className="h-6 w-6 p-0 border-gray-700 hover:border-orange-500 hover:bg-orange-900/20 transition-all duration-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartItem(index, { quantity: item.quantity + 1 })}
                              className="h-6 w-6 p-0 border-gray-700 hover:border-orange-500 hover:bg-orange-900/20 transition-all duration-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-orange-400 font-light">
                            R$ {(item.totalPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-800/50 pt-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-white font-light">Total:</span>
                      <span className="text-orange-400 font-light">R$ {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Details */}
          {cart.length > 0 && (
            <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl hover:border-red-500/20 transition-all duration-300 animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg font-light text-white flex items-center">
                  <User className="h-4 w-4 mr-2 text-red-400" />
                  Dados do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="customerName" className="text-gray-400 text-sm font-light">
                      Nome *
                    </Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-black/50 border-gray-700/50 text-white h-9 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm font-light">Tipo</Label>
                    <Select
                      value={deliveryType}
                      onValueChange={(value: "delivery" | "pickup" | "table") => setDeliveryType(value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700/50 h-9 hover:border-orange-500/50 transition-colors duration-300 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="table" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          Mesa
                        </SelectItem>
                        <SelectItem value="pickup" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          Retirada
                        </SelectItem>
                        <SelectItem value="delivery" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          Entrega
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm font-light">Meio de Pagamento</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value: "pix" | "card" | "cash") => setPaymentMethod(value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700/50 h-9 hover:border-orange-500/50 transition-colors duration-300 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="pix" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          PIX
                        </SelectItem>
                        <SelectItem value="card" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          Cartão
                        </SelectItem>
                        <SelectItem value="cash" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          Dinheiro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {deliveryType === "delivery" && (
                    <div className="animate-slide-down">
                      <Label htmlFor="address" className="text-gray-400 text-sm font-light">
                        Endereço (opcional)
                      </Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-black/50 border-gray-700/50 text-white focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder="Endereço para entrega"
                        rows={2}
                      />
                    </div>
                  )}

                  {deliveryType === "table" && (
                    <div className="animate-slide-down">
                      <Label htmlFor="table" className="text-gray-400 text-sm font-light">
                        Mesa
                      </Label>
                      <Input
                        id="table"
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                        className="bg-black/50 border-gray-700/50 text-white h-9 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder="Número da mesa"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitOrder}
                    disabled={!customerName || isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 text-white font-light h-11 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Finalizar Pedido
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Orders List */}
      {recentOrders.length > 0 && (
        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-light text-white flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-yellow-400" />
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-black/30 p-4 rounded-lg border border-gray-800/30 hover:border-yellow-500/30 hover:bg-black/40 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-light text-white">
                        Pedido {order.id} - {order.customer.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {order.status === "pending" && `${getOrderPosition(order.orderNumber)} posição na fila`}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={order.status === "pending" ? "default" : "secondary"}
                        className={`${
                          order.status === "pending"
                            ? "bg-yellow-600 text-white"
                            : order.status === "confirmed"
                              ? "bg-blue-600 text-white"
                              : order.status === "preparing"
                                ? "bg-orange-600 text-white"
                                : "bg-green-600 text-white"
                        } text-xs`}
                      >
                        {order.status === "pending"
                          ? "Pendente"
                          : order.status === "confirmed"
                            ? "Confirmado"
                            : order.status === "preparing"
                              ? "Preparando"
                              : "Pronto"}
                      </Badge>
                      <p className="text-orange-400 font-light text-sm mt-1">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300 flex items-center">
                          {item.quantity}x {item.name}
                          {item.isCarneSol && <Star className="ml-1 h-3 w-3 text-yellow-400 fill-current" />}
                        </span>
                        <span className="text-gray-400">R$ {(item.totalPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {order.deliveryType === "delivery" && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Entrega
                        </span>
                      )}
                      {order.deliveryType === "table" && (
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Mesa {order.table}
                        </span>
                      )}
                      {order.deliveryType === "pickup" && (
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Retirada
                        </span>
                      )}
                      <span className="flex items-center">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
