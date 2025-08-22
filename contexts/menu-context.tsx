"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface MenuItem {
  id: string
  name: string
  basePrice: number
  category: string
  description?: string
  ingredients: string[]
  active: boolean
  isCarneSol?: boolean
}

interface MenuContextType {
  menuItems: MenuItem[]
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  getActiveMenuItems: () => MenuItem[]
  getMenuItemsByCategory: (category: string) => MenuItem[]
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

const initialMenuItems: MenuItem[] = [
  // PIZZAS SALGADAS
  {
    id: "pizza-mexicana",
    name: "Mexicana",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, pimentão, pimenta calabresa, tomate, cebola e orégano",
    ingredients: ["molho", "mussarela", "pimentão", "pimenta calabresa", "tomate", "cebola", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-seis-coberturas",
    name: "Seis Coberturas",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, presunto, frango, milho, tomate e orégano",
    ingredients: ["molho", "mussarela", "presunto", "frango", "milho", "tomate", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-nordestina",
    name: "Nordestina",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, carne de sol, cebola roxa, cheiro verde, pimenta calabresa e orégano",
    ingredients: ["molho", "mussarela", "carne de sol", "cebola roxa", "cheiro verde", "pimenta calabresa", "orégano"],
    active: true,
    isCarneSol: true,
  },
  {
    id: "pizza-mussarela",
    name: "Mussarela",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, tomate, azeitona e orégano",
    ingredients: ["molho", "mussarela", "tomate", "azeitona", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-calabresa",
    name: "Calabresa",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, calabresa, tomate, cebola e orégano",
    ingredients: ["molho", "mussarela", "calabresa", "tomate", "cebola", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-vegetariana",
    name: "Vegetariana",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, tomate, cebola, pimentão, milho, batata palha, azeitona e orégano",
    ingredients: ["molho", "mussarela", "tomate", "cebola", "pimentão", "milho", "batata palha", "azeitona", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-frango",
    name: "Frango",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, frango, tomate, cebola e orégano",
    ingredients: ["molho", "mussarela", "frango", "tomate", "cebola", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-bacon-milho",
    name: "Bacon com Milho",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, bacon, milho, tomate, cebola e orégano",
    ingredients: ["molho", "mussarela", "bacon", "milho", "tomate", "cebola", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-baiacubana",
    name: "Baiacubana",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, presunto, frango, bacon, cebola e azeitona",
    ingredients: ["molho", "mussarela", "presunto", "frango", "bacon", "cebola", "azeitona"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-portuguesa",
    name: "Portuguesa",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, presunto, tomate, cebola, milho, ovo, catupiry, azeitona e orégano",
    ingredients: [
      "molho",
      "mussarela",
      "presunto",
      "tomate",
      "cebola",
      "milho",
      "ovo",
      "catupiry",
      "azeitona",
      "orégano",
    ],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-moda-casa",
    name: "À Moda da Casa",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, presunto, frango, milho, ovo, azeitona e orégano",
    ingredients: ["molho", "mussarela", "presunto", "frango", "milho", "ovo", "azeitona", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-briana",
    name: "Briana",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, presunto, cebola, ovo, pimenta calabresa, azeitona e orégano",
    ingredients: ["molho", "mussarela", "presunto", "cebola", "ovo", "pimenta calabresa", "azeitona", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-mista",
    name: "Mista",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, presunto, frango, calabresa, milho, azeitona e orégano",
    ingredients: ["molho", "mussarela", "presunto", "frango", "calabresa", "milho", "azeitona", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-frango-catupiry",
    name: "Frango com Catupiry",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, frango, catupiry e orégano",
    ingredients: ["molho", "mussarela", "frango", "catupiry", "orégano"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-carne-sol",
    name: "Carne de Sol",
    basePrice: 0,
    category: "Pizza Salgada",
    description: "Molho, mussarela, carne de sol, tomate, cebola e orégano",
    ingredients: ["molho", "mussarela", "carne de sol", "tomate", "cebola", "orégano"],
    active: true,
    isCarneSol: true,
  },

  // PIZZAS DOCES
  {
    id: "pizza-abacaxi",
    name: "Abacaxi",
    basePrice: 0,
    category: "Pizza Doce",
    description: "Mussarela, abacaxi e leite condensado",
    ingredients: ["mussarela", "abacaxi", "leite condensado"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-banana",
    name: "Banana",
    basePrice: 0,
    category: "Pizza Doce",
    description: "Mussarela, banana, canela e leite condensado",
    ingredients: ["mussarela", "banana", "canela", "leite condensado"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-chocolate",
    name: "Chocolate",
    basePrice: 0,
    category: "Pizza Doce",
    description: "Mussarela, chocolate e leite condensado",
    ingredients: ["mussarela", "chocolate", "leite condensado"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pizza-coco",
    name: "Pizza de Coco",
    basePrice: 0,
    category: "Pizza Doce",
    description: "Mussarela, coco ralado e chocolate",
    ingredients: ["mussarela", "coco ralado", "chocolate"],
    active: true,
    isCarneSol: false,
  },

  // BEBIDAS
  {
    id: "suco-laranja",
    name: "Suco Natural de Laranja",
    basePrice: 8.0,
    category: "Bebida",
    description: "Suco natural de laranja 300ml",
    ingredients: ["laranja natural"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "suco-maracuja",
    name: "Suco Natural de Maracujá",
    basePrice: 8.0,
    category: "Bebida",
    description: "Suco natural de maracujá 300ml",
    ingredients: ["maracujá natural"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "suco-caja",
    name: "Suco Natural de Cajá",
    basePrice: 8.0,
    category: "Bebida",
    description: "Suco natural de cajá 300ml",
    ingredients: ["cajá natural"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "refrigerante-2l",
    name: "Refrigerante 2L",
    basePrice: 15.0,
    category: "Bebida",
    description: "Refrigerante 2 litros - diversos sabores",
    ingredients: [],
    active: true,
    isCarneSol: false,
  },
  {
    id: "refrigerante-1l",
    name: "Refrigerante 1L",
    basePrice: 8.0,
    category: "Bebida",
    description: "Refrigerante 1 litro - diversos sabores",
    ingredients: [],
    active: true,
    isCarneSol: false,
  },
  {
    id: "refrigerante-lata",
    name: "Refrigerante Lata",
    basePrice: 5.0,
    category: "Bebida",
    description: "Refrigerante lata 350ml - diversos sabores",
    ingredients: [],
    active: true,
    isCarneSol: false,
  },

  // PASTÉIS
  {
    id: "pastel-frango-catupiry",
    name: "Pastel de Frango com Catupiry",
    basePrice: 6.0,
    category: "Pastel",
    description: "Pastel frito recheado com frango e catupiry",
    ingredients: ["massa de pastel", "frango", "catupiry"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pastel-frango",
    name: "Pastel de Frango",
    basePrice: 6.0,
    category: "Pastel",
    description: "Pastel frito recheado com frango temperado",
    ingredients: ["massa de pastel", "frango", "temperos"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pastel-queijo",
    name: "Pastel de Queijo",
    basePrice: 6.0,
    category: "Pastel",
    description: "Pastel frito recheado com queijo mussarela",
    ingredients: ["massa de pastel", "queijo mussarela"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pastel-romeu-julieta",
    name: "Pastel Romeu e Julieta",
    basePrice: 8.0,
    category: "Pastel",
    description: "Pastel doce com queijo e goiabada",
    ingredients: ["massa de pastel", "queijo", "goiabada"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pastel-docura",
    name: "Pastel Doçura",
    basePrice: 8.0,
    category: "Pastel",
    description: "Pastel doce especial da casa",
    ingredients: ["massa de pastel", "recheio doce especial"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pastel-carne",
    name: "Pastel de Carne",
    basePrice: 9.0,
    category: "Pastel",
    description: "Pastel frito recheado com carne moída temperada",
    ingredients: ["massa de pastel", "carne moída", "cebola", "temperos"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "pastel-pizza",
    name: "Pastel de Pizza",
    basePrice: 9.0,
    category: "Pastel",
    description: "Pastel com recheio sabor pizza",
    ingredients: ["massa de pastel", "molho de tomate", "mussarela", "orégano"],
    active: true,
    isCarneSol: false,
  },

  // TIRA GOSTO (PORÇÕES)
  {
    id: "batata-frita",
    name: "Batata Frita",
    basePrice: 15.0,
    category: "Tira Gosto",
    description: "Porção de batata frita crocante",
    ingredients: ["batata", "óleo", "sal"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "classico-fritas",
    name: "Clássico com Fritas",
    basePrice: 45.0,
    category: "Tira Gosto",
    description: "Porção especial clássica com batatas fritas",
    ingredients: ["batata frita", "ingredientes especiais"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "ovo-codorna",
    name: "Ovo de Codorna",
    basePrice: 10.0,
    category: "Tira Gosto",
    description: "Porção de ovos de codorna",
    ingredients: ["ovos de codorna", "temperos"],
    active: true,
    isCarneSol: false,
  },
  {
    id: "aperitivo-nordestino",
    name: "Aperitivo Nordestino",
    basePrice: 45.0,
    category: "Tira Gosto",
    description: "Aperitivo especial com sabores nordestinos",
    ingredients: ["ingredientes nordestinos especiais"],
    active: true,
    isCarneSol: false,
  },
]

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)

  // Atualizar isCarneSol baseado nos ingredientes
  useEffect(() => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isCarneSol: item.ingredients.some((ingredient) => ingredient.toLowerCase().includes("carne de sol")),
      })),
    )
  }, [])

  const addMenuItem = (item: MenuItem) => {
    const newItem = {
      ...item,
      isCarneSol: item.ingredients.some((ingredient) => ingredient.toLowerCase().includes("carne de sol")),
    }
    setMenuItems((prev) => [...prev, newItem])
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates }
          return {
            ...updatedItem,
            isCarneSol: updatedItem.ingredients.some((ingredient) => ingredient.toLowerCase().includes("carne de sol")),
          }
        }
        return item
      }),
    )
  }

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getActiveMenuItems = () => {
    return menuItems.filter((item) => item.active)
  }

  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category && item.active)
  }

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getActiveMenuItems,
        getMenuItemsByCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
