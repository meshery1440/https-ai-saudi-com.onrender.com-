import type React from "react"
import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import "./globals.css"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: "AI Chat - دردشة ذكية مع الذكاء الاصطناعي",
  description: "نظام دردشة ذكي يتعلم من المحادثات ويطور نفسه تلقائياً",
  keywords: "ذكاء اصطناعي, دردشة, تعلم آلي, محادثة ذكية",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={`${tajawal.className} antialiased`}>{children}</body>
    </html>
  )
}
