import Hider from '@/components/comp-hider/hider'
import BottomNavigation from '@/components/navigation-bars/bottom-navigation'
import RouteLoader from '@/components/route-loader/route-loader'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@/context/user-context'
import '@/styles/globals.css'
import '@/styles/globals.scss'
import { useMediaQuery } from '@mui/material'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import { FC, useState } from 'react'


const poppins = Poppins({
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['roboto'],
  preload: false
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const isMobile = useMediaQuery('(max-width:540px)');
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnReconnect: true,
          refetchOnWindowFocus: false,
          staleTime: 60000,
          cacheTime: 90000,
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
              <RouteLoader />
              <Toaster />
              <div suppressHydrationWarning className={`${poppins.variable} relative flex min-h-screen flex-col justify-between`}>
                <div>
                  <main>
                    <Component {...pageProps} />
                  </main>
                </div>
                {isMobile &&
                  <Hider routes={['/auth/login', '/auth/login/', '/auth/register', '/auth/register/', '/auth/forgot-password', '/auth/forgot-password/']}>
                    <BottomNavigation />
                  </Hider>
                }
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