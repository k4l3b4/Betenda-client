import Hider from '@/components/comp-hider/hider'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserProvider } from '@/context/user-context'
import { Toaster } from '@/components/ui/toaster'
import { Kanit } from 'next/font/google';


const kanit = Kanit({
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-kanit',
  fallback: ['roboto'],
  preload: false
});

const App: FC<AppProps> = ({ Component, pageProps }) => {

  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnReconnect: true,
          refetchOnWindowFocus: false,
          staleTime: 60000,
          cacheTime: 90000,
          networkMode: "always"
        },
      },
    }),
  );

  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <UserProvider>
              <Toaster />
              <div className="relative flex min-h-screen flex-col font-kanit">
                <Hider routes={['/auth/login', '/auth/login/', '/auth/register', '/auth/register/', '/auth/forgot-password', '/auth/forgot-password/']}>
                  <SiteHeader />
                </Hider>
                <main className='mt-4'>
                  <Component {...pageProps} />
                </main>
              </div>
            </UserProvider>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <TailwindIndicator />
      </ThemeProvider>
    </div>
  )
}


export default App