import Hider from '@/components/comp-hider/Hider'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <Hider routes={['/auth/login', '/auth/login/', '/auth/register', '/auth/register/', '/auth/forgot-password', '/auth/forgot-password/']}>
            <SiteHeader />
          </Hider>
          <Component {...pageProps} />
        </div>
        <TailwindIndicator />
      </ThemeProvider>
    </div>
  )
}
