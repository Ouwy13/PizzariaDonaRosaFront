import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MenuProvider } from "@/contexts/menu-context"
import { OrdersProvider } from "@/contexts/orders-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pizzaria Dona Rosa - Sistema de Gestão",
  description: "Sistema completo de gestão para pizzaria",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MenuProvider>
            <OrdersProvider>{children}</OrdersProvider>
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
