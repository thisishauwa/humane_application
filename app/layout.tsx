import type React from "react"
import "@/app/globals.css"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "@/components/theme-provider"
import { britti } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.className} ${britti.variable}`}>
      <head>
        <title>Humane - Make your posts sound more human</title>
        <meta name="description" content="Transform corporate jargon into authentic, relatable content" />
        <link rel="preload" href="/Font/BrittiSansTrial-Regular-BF6757bfd47ffbf.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/Font/BrittiSansTrial-Bold-BF6757bfd4a96ed.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body className={`font-britti`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
