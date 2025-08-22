"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  Printer,
  Trash2,
  MapPin,
  CreditCard,
  User,
  Star,
} from "lucide-react"
import { useOrders } from "@/contexts/orders-context"

export default function Analytics() {
  const { deliveredOrders, deleteDeliveredOrder } = useOrders()
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString())

  // Filtrar pedidos por período
  const getFilteredOrders = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return deliveredOrders.filter((order) => {
      const orderDate = new Date(order.deliveredAt)

      switch (selectedPeriod) {
        case "today":
          const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate())
          return orderDay.getTime() === today.getTime()

        case "month":
          return (
            orderDate.getMonth() === Number.parseInt(selectedMonth) - 1 &&
            orderDate.getFullYear() === Number.parseInt(selectedYear)
          )

        case "year":
          return orderDate.getFullYear() === Number.parseInt(selectedYear)

        case "custom":
          const customDate = new Date(
            Number.parseInt(selectedYear),
            Number.parseInt(selectedMonth) - 1,
            Number.parseInt(selectedDay),
          )
          const customDay = new Date(customDate.getFullYear(), customDate.getMonth(), customDate.getDate())
          const orderCustomDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate())
          return orderCustomDay.getTime() === customDay.getTime()

        default:
          return true
      }
    })
  }

  const filteredOrders = getFilteredOrders()

  // Calcular estatísticas
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = filteredOrders.length

  // Produtos mais vendidos
  const productStats = filteredOrders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        const key = item.name
        if (!acc[key]) {
          acc[key] = { name: item.name, quantity: 0, revenue: 0, isCarneSol: item.isCarneSol }
        }
        acc[key].quantity += item.quantity
        acc[key].revenue += item.totalPrice * item.quantity
      })
      return acc
    },
    {} as Record<string, { name: string; quantity: number; revenue: number; isCarneSol?: boolean }>,
  )

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "today":
        return "Hoje"
      case "month":
        return `${getMonthName(Number.parseInt(selectedMonth))} ${selectedYear}`
      case "year":
        return selectedYear
      case "custom":
        return `${selectedDay}/${selectedMonth}/${selectedYear}`
      default:
        return period
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return months[month - 1]
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

  const generateReport = () => {
    const reportContent = `
      RELATÓRIO DE VENDAS - PIZZARIA DONA ROSA
      ========================================
      
      Período: ${getPeriodLabel(selectedPeriod)}
      Data do Relatório: ${new Date().toLocaleDateString("pt-BR")}
      
      RESUMO FINANCEIRO:
      ------------------
      Faturamento Total: R$ ${totalRevenue.toFixed(2)}
      Total de Pedidos: ${totalOrders}
      
      PRODUTOS MAIS VENDIDOS:
      -----------------------
      ${topProducts
        .map(
          (item, index) =>
            `${index + 1}. ${item.name}
           Quantidade: ${item.quantity} unidades
           Faturamento: R$ ${item.revenue.toFixed(2)}`,
        )
        .join("\n\n")}
      
      HISTÓRICO DE VENDAS:
      -------------------
      ${filteredOrders
        .map(
          (order) =>
            `Pedido ${order.id} - ${order.customer.name}
           Data: ${new Date(order.deliveredAt).toLocaleString("pt-BR")}
           Valor: R$ ${order.total.toFixed(2)}
           Pagamento: ${getPaymentMethodLabel(order.paymentMethod)}
           Local: ${getDeliveryTypeLabel(order.deliveryType)}${order.table ? ` ${order.table}` : ""}`,
        )
        .join("\n\n")}
      
      ========================================
      Relatório gerado automaticamente pela Pizzaria Dona Rosa
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(
        `<pre style="font-family: monospace; font-size: 12px; line-height: 1.4; padding: 20px;">${reportContent}</pre>`,
      )
      printWindow.document.close()
      printWindow.print()
    }
  }

  const downloadReport = () => {
    const reportData = {
      period: getPeriodLabel(selectedPeriod),
      date: new Date().toISOString(),
      summary: {
        totalRevenue,
        totalOrders,
        topProducts,
      },
      orders: filteredOrders,
      generated_by: "Pizzaria Dona Rosa",
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-vendas-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-green-400" />
            Relatórios e Análises
          </h1>
          <p className="text-gray-400 mt-2">Acompanhe o desempenho da sua pizzaria</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={downloadReport}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>

          <Button onClick={generateReport} className="bg-green-600 hover:bg-green-700">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-400" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-400 text-sm">Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="month">Mês Específico</SelectItem>
                  <SelectItem value="year">Ano Específico</SelectItem>
                  <SelectItem value="custom">Data Específica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-400 text-sm">Ano</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedPeriod === "month" || selectedPeriod === "custom") && (
              <div>
                <Label className="text-gray-400 text-sm">Mês</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {getMonthName(i + 1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedPeriod === "custom" && (
              <div>
                <Label className="text-gray-400 text-sm">Dia</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Faturamento</p>
                <p className="text-3xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-300 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {getPeriodLabel(selectedPeriod)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Pedidos</p>
                <p className="text-3xl font-bold text-white">{totalOrders}</p>
                <p className="text-xs text-blue-300 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {getPeriodLabel(selectedPeriod)}
                </p>
              </div>
              <ShoppingCart className="h-12 w-12 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-yellow-400" />
              Produtos Mais Vendidos - {getPeriodLabel(selectedPeriod)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white flex items-center">
                          {item.name}
                          {item.isCarneSol && <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />}
                        </h3>
                        <p className="text-sm text-gray-400">{item.quantity} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">R$ {item.revenue.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">
                        {totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0}% do total
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales History */}
      <Card className="bg-gray-900/20 border-gray-800/30 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-purple-400" />
            Histórico de Vendas - {getPeriodLabel(selectedPeriod)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma venda encontrada</h3>
              <p className="text-gray-400">Não há vendas registradas para o período selecionado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        Pedido {order.id} - {order.customer.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Entregue em: {new Date(order.deliveredAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600 text-white">R$ {order.total.toFixed(2)}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDeliveredOrder(order.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      {getDeliveryTypeLabel(order.deliveryType)}
                      {order.table && `: ${order.table}`}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <User className="h-4 w-4 mr-2" />
                      {order.customer.name}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-medium mb-3">Produtos:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                          <span className="text-gray-300 flex items-center">
                            <Badge variant="secondary" className="bg-purple-600 text-white text-xs mr-2">
                              {item.quantity}x
                            </Badge>
                            {item.name}
                            {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                            {item.selectedSize && (
                              <span className="text-xs text-gray-500 ml-2">({item.selectedSize})</span>
                            )}
                          </span>
                          <span className="text-green-400 font-medium">
                            R$ {(item.totalPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
