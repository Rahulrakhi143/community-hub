import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google' // Optional: for fonts
import './globals.css' // Your Tailwind CSS styles

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Community Hub',
  description: 'Connect with me!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}