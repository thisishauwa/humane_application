import type { Metadata } from "next"
import "@/app/globals.css"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "@/components/theme-provider"
import { britti } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Humane - Make your posts sound more human",
  description: "Transform corporate jargon into authentic, relatable content",
  generator: "Next.js"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.className} ${britti.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-britti antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
