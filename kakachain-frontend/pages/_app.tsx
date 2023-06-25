import { ThemeUIProvider } from 'theme-ui'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import theme from '../lib/theme'

export default function App({ Component, pageProps }: AppProps) {
  return <ThemeUIProvider theme={theme} ><Component {...pageProps} /></ThemeUIProvider>
}
