"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface OrderItem {
  id: string
  name: string
  basePrice: number
  category: string
  description?: string
  ingredients: string[]
  active: boolean
  isCarneSol?: boolean
  quantity: number
  selectedSize?: string
  selectedFlavors?: string[]
  observations?: string
  totalPrice: number
}

interface Order {
  id: string
  items: OrderItem[]
  customer: {
    name: string
  }
  deliveryType: "delivery" | "pickup" | "table"
  paymentMethod: "pix" | "card" | "cash"
  address?: string
  table?: string
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready"
  timestamp: string
  orderNumber: number
}

interface DeliveredOrder extends Order {
  deliveredAt: string
}

interface OrdersContextType {
  orders: Order[]
  deliveredOrders: DeliveredOrder[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  removeOrder: (orderId: string) => void
  getOrdersByStatus: (status: Order["status"]) => Order[]
  deliverOrder: (orderId: string) => void
  deleteDeliveredOrder: (orderId: string) => void
  getOrdersCount: () => number
  getKitchenOrdersCount: () => number
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [deliveredOrders, setDeliveredOrders] = useState<DeliveredOrder[]>([])

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const removeOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const getOrdersByStatus = (status: Order["status"]) => {
    return orders.filter((order) => order.status === status)
  }

  const deliverOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      // Adicionar aos pedidos entregues com timestamp de entrega
      const deliveredOrder: DeliveredOrder = {
        ...order,
        deliveredAt: new Date().toISOString(),
      }
      setDeliveredOrders((prev) => [deliveredOrder, ...prev])

      // Remover da lista de pedidos ativos
      removeOrder(orderId)
    }
  }

  const deleteDeliveredOrder = (orderId: string) => {
    setDeliveredOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const getOrdersCount = () => {
    return orders.filter((order) => order.status === "pending").length
  }

  const getKitchenOrdersCount = () => {
    return orders.filter((order) => ["confirmed", "preparing", "ready"].includes(order.status)).length
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        deliveredOrders,
        addOrder,
        updateOrderStatus,
        removeOrder,
        getOrdersByStatus,
        deliverOrder,
        deleteDeliveredOrder,
        getOrdersCount,
        getKitchenOrdersCount,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
