import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

export const metadata: Metadata = {
  title: 'MargDarshak',
  description: 'Frontend foundation for Quantum-Inspired Intelligent Traffic Route Optimization.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#040404',
  userScalable: false,
}

import { TrafficAppProvider } from '@/components/traffic-app-provider'
import { SplashScreen } from '@/components/splash-screen'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SplashScreen />
        <TrafficAppProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TrafficAppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
