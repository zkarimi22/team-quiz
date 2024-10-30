import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Team Quiz App',
  description: 'Internal quiz application for teams',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
