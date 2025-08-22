"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Pizza, Coffee } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description?: string
  image?: string
  sizes?: { name: string; multiplier: number }[]
  types?: { name: string; priceAdd: number }[]
  active: boolean
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    price: 35.0,
    category: "Pizza",
    description: "Molho de tomate, mussarela, manjericão fresco",
    sizes: [
      { name: "Pequena", multiplier: 0.8 },
      { name: "Média", multiplier: 1.0 },
      { name: "Grande", multiplier: 1.3 },
    ],
    types: [
      { name: "Padrão", priceAdd: 0 },
      { name: "Carne de Sol", priceAdd: 8.0 },
    ],
    active: true,
  },
  {
    id: "2",
    name: "Pizza Calabresa",
    price: 38.0,
    category: "Pizza",
    description: "Molho de tomate, mussarela, calabresa, cebola",
    sizes: [
      { name: "Pequena", multiplier: 0.8 },
      { name: "Média", multiplier: 1.0 },
      { name: "Grande", multiplier: 1.3 },
    ],
    types: [
      { name: "Padrão", priceAdd: 0 },
      { name: "Carne de Sol", priceAdd: 8.0 },
    ],
    active: true,
  },
  {
    id: "3",
    name: "Refrigerante 2L",
    price: 8.0,
    category: "Bebida",
    description: "Refrigerante 2 litros - diversos sabores",
    active: true,
  },
  {
    id: "4",
    name: "Água Mineral",
    price: 3.0,
    category: "Bebida",
    description: "Água mineral 500ml",
    active: true,
  },
]

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    category: "Pizza",
    description: "",
    active: true,
  })

  const categories = ["Pizza", "Bebida", "Sobremesa", "Entrada"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingItem) {
      // Update existing item
      setMenuItems(
        menuItems.map((item) => (item.id === editingItem.id ? ({ ...item, ...formData } as MenuItem) : item)),
      )
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        sizes:
          formData.category === "Pizza"
            ? [
                { name: "Pequena", multiplier: 0.8 },
                { name: "Média", multiplier: 1.0 },
                { name: "Grande", multiplier: 1.3 },
              ]
            : undefined,
        types:
          formData.category === "Pizza"
            ? [
                { name: "Padrão", priceAdd: 0 },
                { name: "Carne de Sol", priceAdd: 8.0 },
              ]
            : undefined,
      } as MenuItem

      setMenuItems([...menuItems, newItem])
    }

    // Reset form
    setFormData({
      name: "",
      price: 0,
      category: "Pizza",
      description: "",
      active: true,
    })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, active: !item.active } : item)))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Pizza":
        return <Pizza className="h-4 w-4" />
      case "Bebida":
        return <Coffee className="h-4 w-4" />
      default:
        return <Pizza className="h-4 w-4" />
    }
  }

  const groupedItems = categories.reduce(
    (acc, category) => {
      acc[category] = menuItems.filter((item) => item.category === category)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão do Cardápio</h1>
          <p className="text-gray-400">Gerencie os itens do cardápio da pizzaria</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar Item" : "Novo Item do Cardápio"}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingItem ? "Edite as informações do item" : "Adicione um novo item ao cardápio"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Nome do item"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-gray-300">
                    Preço (R$)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Descrição do item"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingItem(null)
                    setFormData({
                      name: "",
                      price: 0,
                      category: "Pizza",
                      description: "",
                      active: true,
                    })
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {editingItem ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items by Category */}
      {categories.map((category) => {
        const items = groupedItems[category]
        if (items.length === 0) return null

        return (
          <Card key={category} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
                <Badge variant="secondary" className="ml-2 bg-gray-700 text-gray-300">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={item.id} className={`bg-gray-800 border-gray-700 ${!item.active ? "opacity-60" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <Badge
                          variant={item.active ? "default" : "secondary"}
                          className={item.active ? "bg-green-600" : "bg-gray-600"}
                        >
                          {item.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>

                      {item.description && <p className="text-sm text-gray-400 mb-3">{item.description}</p>}

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-green-400">R$ {item.price.toFixed(2)}</span>
                      </div>

                      {item.sizes && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Tamanhos:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.sizes.map((size) => (
                              <Badge
                                key={size.name}
                                variant="outline"
                                className="text-xs border-gray-600 text-gray-400"
                              >
                                {size.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.types && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Tipos:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.types.map((type) => (
                              <Badge
                                key={type.name}
                                variant="outline"
                                className="text-xs border-gray-600 text-gray-400"
                              >
                                {type.name} {type.priceAdd > 0 && `(+R$ ${type.priceAdd.toFixed(2)})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(item.id)}
                          className={`text-xs ${
                            item.active
                              ? "border-red-600 text-red-400 hover:bg-red-900/20"
                              : "border-green-600 text-green-400 hover:bg-green-900/20"
                          }`}
                        >
                          {item.active ? "Desativar" : "Ativar"}
                        </Button>

                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
