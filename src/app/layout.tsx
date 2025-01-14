import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SOORYAH!! Sunscreen App',
  description: 'Track your sun exposure and protect your skin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-r from-yellow-200 to-yellow-400`}>
        {children}
      </body>
    </html>
  )
}

