"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, X, Star } from "lucide-react"
import { useMenu, type MenuItem } from "@/contexts/menu-context"

export default function MenuSettings() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, getMenuItemsByCategory } = useMenu()
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    basePrice: 0,
    category: "Pizza Salgada",
    ingredients: [] as string[],
    active: true,
    isCarneSol: false,
  })
  const [newIngredient, setNewIngredient] = useState("")

  const categories = ["Pizza Salgada", "Pizza Doce", "Bebida", "Pastel", "Porção"]

  const handleAddItem = () => {
    if (newItem.name && newItem.basePrice > 0) {
      addMenuItem({
        id: `item-${Date.now()}`,
        name: newItem.name,
        basePrice: newItem.basePrice,
        category: newItem.category,
        ingredients: newItem.ingredients,
        active: newItem.active,
        isCarneSol: newItem.isCarneSol,
      })

      setNewItem({
        name: "",
        basePrice: 0,
        category: "Pizza Salgada",
        ingredients: [],
        active: true,
        isCarneSol: false,
      })
      setIsAddingItem(false)
    }
  }

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setNewItem({
        ...newItem,
        ingredients: [...newItem.ingredients, newIngredient.trim()],
      })
      setNewIngredient("")
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setNewItem({
      ...newItem,
      ingredients: newItem.ingredients.filter((_, i) => i !== index),
    })
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item.id)
    setNewItem({
      name: item.name,
      basePrice: item.basePrice,
      category: item.category,
      ingredients: [...item.ingredients],
      active: item.active,
      isCarneSol: item.isCarneSol || false,
    })
  }

  const handleSaveEdit = () => {
    if (editingItem && newItem.name && newItem.basePrice > 0) {
      updateMenuItem(editingItem, {
        name: newItem.name,
        basePrice: newItem.basePrice,
        category: newItem.category,
        ingredients: newItem.ingredients,
        active: newItem.active,
        isCarneSol: newItem.isCarneSol,
      })

      setEditingItem(null)
      setNewItem({
        name: "",
        basePrice: 0,
        category: "Pizza Salgada",
        ingredients: [],
        active: true,
        isCarneSol: false,
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setIsAddingItem(false)
    setNewItem({
      name: "",
      basePrice: 0,
      category: "Pizza Salgada",
      ingredients: [],
      active: true,
      isCarneSol: false,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light text-white">Gerenciamento do Cardápio</h1>
          <p className="text-gray-500 text-sm mt-1">Adicione, edite ou remova itens do cardápio</p>
        </div>
        <Button
          onClick={() => setIsAddingItem(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          disabled={isAddingItem || editingItem !== null}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingItem || editingItem) && (
        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">{isAddingItem ? "Adicionar Novo Item" : "Editar Item"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-400 text-sm">Nome do Item</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="bg-black/50 border-gray-700/50 text-white"
                  placeholder="Ex: Pizza Margherita"
                />
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Preço Base (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.basePrice}
                  onChange={(e) => setNewItem({ ...newItem, basePrice: Number.parseFloat(e.target.value) || 0 })}
                  className="bg-black/50 border-gray-700/50 text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Categoria</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger className="bg-black/50 border-gray-700/50 text-white">
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

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newItem.active}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, active: checked })}
                  />
                  <Label className="text-gray-400 text-sm">Ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newItem.isCarneSol}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, isCarneSol: checked })}
                  />
                  <Label className="text-gray-400 text-sm flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-400" />
                    Carne de Sol
                  </Label>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <Label className="text-gray-400 text-sm mb-3 block">Ingredientes</Label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  className="bg-black/50 border-gray-700/50 text-white flex-1"
                  placeholder="Digite um ingrediente"
                  onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
                />
                <Button onClick={handleAddIngredient} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {newItem.ingredients.map((ingredient, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-800/50 text-gray-300 border-gray-600 flex items-center"
                  >
                    {ingredient}
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                onClick={isAddingItem ? handleAddItem : handleSaveEdit}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAddingItem ? "Adicionar" : "Salvar"}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="border-gray-600 text-gray-300 bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items by Category */}
      {categories.map((category) => {
        const categoryItems = getMenuItemsByCategory(category)
        if (categoryItems.length === 0) return null

        return (
          <Card key={category} className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {category}
                <Badge className="bg-gray-700 text-white">{categoryItems.length} itens</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`${
                      item.active ? "bg-black/30 border-gray-800/30" : "bg-red-900/20 border-red-800/30"
                    } transition-all duration-300`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white flex items-center">
                            {item.name}
                            {item.isCarneSol && <Star className="ml-2 h-3 w-3 text-yellow-400 fill-current" />}
                          </h4>
                          <p className="text-lg font-bold text-green-400 mt-1">R$ {item.basePrice.toFixed(2)}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => handleEditItem(item)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            disabled={editingItem !== null || isAddingItem}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => deleteMenuItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            disabled={editingItem !== null || isAddingItem}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {item.ingredients.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-2">Ingredientes:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients.slice(0, 3).map((ingredient, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-gray-600 text-gray-400 bg-gray-800/30"
                              >
                                {ingredient}
                              </Badge>
                            ))}
                            {item.ingredients.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 bg-gray-800/30">
                                +{item.ingredients.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <Badge className={item.active ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                          {item.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button
                          onClick={() => updateMenuItem(item.id, { active: !item.active })}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          disabled={editingItem !== null || isAddingItem}
                        >
                          {item.active ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Empty State */}
      {menuItems.length === 0 && (
        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-light text-white mb-2">Nenhum item no cardápio</h3>
            <p className="text-gray-500 mb-6">Comece adicionando itens ao seu cardápio</p>
            <Button
              onClick={() => setIsAddingItem(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
